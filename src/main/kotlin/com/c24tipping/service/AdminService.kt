package com.c24tipping.service

import com.c24tipping.entity.Bet
import com.c24tipping.entity.Community
import com.c24tipping.entity.Game
import com.c24tipping.entity.User
import com.c24tipping.exception.UnauthorizedException
import com.c24tipping.repository.CommunityRepository
import com.c24tipping.repository.GameRepository
import com.c24tipping.websocket.CommunitySocket
import com.c24tipping.websocket.LeaderboardSocket
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.transaction.Transactional
import org.eclipse.microprofile.config.inject.ConfigProperty

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
        game.goalsAway = awayGoals;
        game.goalsHome = homeGoals;
        this.entityManager.persist(game);
        this.entityManager.flush();

        val users: MutableList<User> = mutableListOf();
        for (bet in game.bets) {
            bet.betPoints = this.calculateBetPoints(bet, game);
            this.entityManager.persist(bet);

            if (!users.contains(bet.user!!)) {
                users.add(bet.user!!);
            }
        }
        this.entityManager.flush();

        for (user in users) {
            val currentBets = user.bets.filter { !it.bettingTransactionDone };
            val pointSum = currentBets.sumOf { it.betPoints!! };
            user.preliminaryPoints = user.points + pointSum;
            this.entityManager.persist(user);
        }
        this.entityManager.flush();

        this.leaderboardService.updateGlobalLeaderboard(users);

        val communities = this.communityRepository.listAll();
        for (community in communities) {
            this.leaderboardService.updateCommunityLeaderboard(community);
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