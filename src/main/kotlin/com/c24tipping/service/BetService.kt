package com.c24tipping.service

import com.c24tipping.data.response.PersonalBetResponse
import com.c24tipping.entity.Bet
import com.c24tipping.exception.BetException
import com.c24tipping.exception.UnknownGameException
import com.c24tipping.exception.UnknownUserException
import com.c24tipping.repository.BetRepository
import com.c24tipping.repository.GameRepository
import com.c24tipping.repository.UserRepository
import com.c24tipping.utils.BetUtil
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.persistence.PersistenceException
import jakarta.transaction.Transactional
import java.util.Date

/**
 * The service for handling all bet transactions
 */
@ApplicationScoped
class BetService : AbstractService() {

    @Inject
    lateinit var betRepository: BetRepository;

    @Inject
    lateinit var gameRepository: GameRepository;

    @Inject
    lateinit var userRepository: UserRepository;

    /**
     * Gets all personal bets
     *
     * @param username The username
     */
    fun getPersonalBets(username: String): List<PersonalBetResponse> {
        return this.betRepository.getPersonalBets(username).map { BetUtil.convertToPersonalBetResponse(it) };
    }

    /**
     * Places a bet
     *
     * @param gameId The ID of the game
     * @param username The username of the betting user
     * @param homeGoals Betted home goals
     * @param awayGoals Betted away goals
     */
    @Transactional
    fun placeBet(gameId: Long, username: String, homeGoals: Int, awayGoals: Int): String {
        val exists = this.betRepository.findPersonalBetOnGame(username, gameId).isPresent;
        if (exists) {
            throw BetException("Sie haben bereits auf dieses Spiel gewettet");
        }
        val game = this.gameRepository.findByIdOptional(gameId);
        if (game.isEmpty) {
            throw UnknownGameException("Das Spiel existiert nicht");
        }
        val user = this.userRepository.findByUsername(username);
        if (user.isEmpty) {
            throw UnknownUserException("Der Nutzer existiert nicht")
        }
        if (Date().time > game.get().startsAt!!.time) {
            throw BetException("Sie können nur bis zu Beginn des Spiels wetten");
        }
        val bet = Bet();
        bet.goalsHome = homeGoals;
        bet.goalsAway = awayGoals;
        bet.user = user.get();
        bet.game = game.get();
        this.entityManager.persist(bet);
        game.get().bets.add(bet);
        this.entityManager.persist(game.get());
        user.get().bets.add(bet);
        this.entityManager.persist(user.get());
        this.entityManager.flush();
        return "Wette erfolgreich platziert";
    }
}