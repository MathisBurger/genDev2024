package com.c24tipping.repository

import com.c24tipping.entity.Bet
import io.quarkus.hibernate.orm.panache.PanacheRepository
import jakarta.enterprise.context.ApplicationScoped
import java.util.Optional

@ApplicationScoped
class BetRepository : PanacheRepository<Bet> {

    /**
     * Gets all personal bets
     *
     * @param username The username
     */
    fun getPersonalBets(username: String): List<Bet> {
        return find("FROM Bet b JOIN b.user u WHERE u.username = ?1", username).list();
    }

    /**
     * Finds personal bets on game
     *
     * @param username The username
     * @param gameId The ID of the game
     */
    fun findPersonalBetOnGame(username: String, gameId: Long): Optional<Bet> {
        return find("FROM Bet b JOIN b.user u JOIN b.game g WHERE u.username = ?1 AND g.id = ?2", username, gameId).firstResultOptional();
    }
}