package com.c24tipping.service

import com.c24tipping.entity.Bet
import com.c24tipping.entity.Game
import com.c24tipping.entity.User
import com.c24tipping.exception.UnauthorizedException
import com.c24tipping.repository.CommunityRepository
import com.c24tipping.repository.GameRepository
import jakarta.enterprise.context.ApplicationScoped
import jakarta.enterprise.context.control.ActivateRequestContext
import jakarta.inject.Inject
import jakarta.persistence.EntityManager
import jakarta.transaction.Transactional
import org.eclipse.microprofile.config.inject.ConfigProperty
import java.util.concurrent.ExecutorService

/**
 * Handles admin requests
 */
@ApplicationScoped
class AdminService : AbstractService() {

    @Inject
    lateinit var gameRepository: GameRepository;

    @Inject
    lateinit var communityRepository: CommunityRepository;

    @Inject
    lateinit var leaderboardService: LeaderboardService;

    @ConfigProperty(name = "c24tipping.adminPW")
    lateinit var adminPW: String;

    @Inject
    lateinit var executorService: ExecutorService;

    /**
     * Checks if a user can log in
     */
    fun canLogin(adminPW: String): Boolean {
        return this.adminPW.equals(adminPW);
    }

    /**
     * Updates a football game
     *
     * @param adminPW the admin password
     * @param gameId The ID of the game
     * @param homeGoals The home goals of a game
     * @param awayGoals The away goals of game
     */
    @Transactional
    fun updateFootballGame(adminPW: String, gameId: Long, homeGoals: Int, awayGoals: Int) {
        if (!this.adminPW.equals(adminPW)) {
            throw UnauthorizedException("Das Passwort war falsch!");
        }
        val game = this.gameRepository.findById(gameId);
        if (game.gameDone) {
            throw Exception("Das Spiel kann nicht bearbeitet werden");
        }
        game.goalsAway = awayGoals;
        game.goalsHome = homeGoals;
        this.entityManager.persist(game);
        this.entityManager.flush();
        //this.asyncBetsUpdate(game);
        this.executorService.execute { this.asyncBetsUpdate(game.id!!); }
    }

    /**
     * Ends a football game
     *
     * @param adminPW The admin password
     * @param gameId The ID of the game that should be ended
     */
    @Transactional
    fun endGame(adminPW: String, gameId: Long) {
        if (!this.adminPW.equals(adminPW)) {
            throw UnauthorizedException("Das Passwort war falsch!");
        }
        val game = this.gameRepository.findById(gameId);
        if (game.gameDone) {
            throw Exception("Das Spiel kann nicht bearbeitet werden");
        }
        game.gameDone = true;
        this.entityManager.persist(game);
        this.entityManager.flush();

        for (bet in game.bets) {
            bet.user!!.points = bet.user!!.preliminaryPoints;
            this.entityManager.persist(bet.user);
        }
        this.entityManager.flush();
    }

    /**
     * Renames a game
     *
     * @param adminPW The admin password for auth
     * @param gameId The ID of the game that should be renamed
     * @param awayTeam The away team name
     * @param homeTeam The home team name
     */
    @Transactional
    fun renameGame(adminPW: String, gameId: Long, homeTeam: String, awayTeam: String) {
        if (!this.adminPW.equals(adminPW)) {
            throw UnauthorizedException("Das Passwort war falsch!");
        }
        val game = this.gameRepository.findById(gameId);
        if (game.gameDone) {
            throw Exception("Das Spiel kann nicht bearbeitet werden");
        }
        game.teamHome = homeTeam;
        game.teamAway = awayTeam;
        this.entityManager.persist(game);
        this.entityManager.flush();
    }

    /**
     * Updates the bets async
     *
     * @param game The game that is updated
     */
    @Transactional
    @ActivateRequestContext
    fun asyncBetsUpdate(gameId: Long) {
        val game = this.gameRepository.findById(gameId);
        val users: MutableList<User> = mutableListOf();
        for (bet in game.bets) {
            bet.betPoints = this.calculateBetPoints(bet, game);
            try {
                entityManager.persist(bet);
            } catch (e: Throwable) {
                println(e.message);
            }

            if (!users.contains(bet.user!!)) {
                users.add(bet.user!!);
            }
        }
        entityManager.flush();

        for (user in users) {
            val currentBets = user.bets.filter { !it.bettingTransactionDone };
            val pointSum = currentBets.sumOf { it.betPoints!! };
            user.preliminaryPoints = user.points + pointSum;
            entityManager.persist(user);
        }
        entityManager.flush();
        this.leaderboardService.updateGlobalLeaderboard(users.map { it.id!! });

        val communities = this.communityRepository.listAll();
        for (community in communities) {
            this.leaderboardService.updateCommunityLeaderboard(community.id!!);
        }
    }

    /**
     * Calculates the bet points for a bet
     *
     * @param bet the bet
     * @param game the game
     */
    private fun calculateBetPoints(bet: Bet, game: Game): Int {
        if (bet.goalsAway == game.goalsAway && bet.goalsHome == game.goalsHome) {
            return 8;
        }
        if ((bet.goalsAway!! - bet.goalsHome!!) == (bet.game!!.goalsAway!! - bet.game!!.goalsHome!!) && bet.goalsHome!! != bet.goalsAway!!) {
            return 6;
        }
        if (bet.goalsAway!! > bet.goalsHome!! && game.goalsAway!! > game.goalsHome!!) {
            return 4;
        }
        if (bet.goalsAway!! < bet.goalsHome!! && game.goalsAway!! < game.goalsHome!!) {
            return 4;
        }
        return 0;
    }
}