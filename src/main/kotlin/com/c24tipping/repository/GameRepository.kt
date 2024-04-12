package com.c24tipping.repository

import com.c24tipping.entity.Game
import io.quarkus.hibernate.orm.panache.PanacheRepository
import io.quarkus.panache.common.Sort
import jakarta.enterprise.context.ApplicationScoped
import java.util.Date
import java.util.Optional

/**
 * The repository that handles game transactions
 */
@ApplicationScoped
class GameRepository : PanacheRepository<Game> {

    /**
     * Finds by params
     *
     * @param homeTeam The home team
     * @param awayTeam The away team
     * @param startsAt When the game starts
     */
    fun findByParams(homeTeam: String, awayTeam: String, startsAt: Date): Optional<Game> {
        return find("teamHome = ?1 AND teamAway = ?2 AND startsAt = ?3", homeTeam, awayTeam, startsAt).firstResultOptional();
    }

    /**
     * Lists all games
     */
    fun listAllGames(): List<Game> {
        return find("", Sort.by("startsAt", Sort.Direction.Ascending)).list();
    }
}