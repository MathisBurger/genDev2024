package com.c24tipping.service

import com.c24tipping.entity.Bet
import com.c24tipping.entity.Game
import com.c24tipping.entity.User
import com.c24tipping.exception.UnauthorizedException
import com.c24tipping.repository.GameRepository
import com.c24tipping.websocket.CommunitySocket
import com.c24tipping.websocket.LeaderboardSocket
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.transaction.Transactional
import org.eclipse.microprofile.config.inject.ConfigProperty

@ApplicationScoped
class AdminService : AbstractService() {

    @Inject
    lateinit var gameRepository: GameRepository;

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

        // Maybe entity manager must be refreshed here
        for (user in users) {
            val currentBets = user.bets.filter { !it.bettingTransactionDone };
            val pointSum = currentBets.sumOf { it.betPoints!! };
            user.preliminaryPoints = user.points + pointSum;
            this.entityManager.persist(user);
        }
        this.entityManager.flush();

        this.leaderboardService.updateGlobalLeaderboard(users);
        // TODO: Update leaderboards
        // Every leaderboard stores the leaderboard itself in the socket class, so the data is persisted after updating within the socket


        // game -> bets -> users -> communities
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