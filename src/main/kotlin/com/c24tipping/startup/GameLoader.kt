package com.c24tipping.startup

import com.c24tipping.entity.Game
import com.c24tipping.repository.GameRepository
import io.quarkus.runtime.Startup
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.persistence.EntityManager
import jakarta.transaction.Transactional
import java.io.File
import java.time.LocalDateTime
import java.time.ZoneOffset
import java.time.format.DateTimeFormatter
import java.util.Date

@ApplicationScoped
class GameLoader {

    @Inject
    lateinit var entityManager: EntityManager;

    @Inject
    lateinit var gameRepository: GameRepository;

    /**
     * LOAD function that is executed on init
     */
    @Startup
    fun load()  {
        val file = File("game_schedule.csv");
        if (!file.exists()) {
            println("Game file does not exist");
            return;
        }
        file.forEachLine {this.loadGame(it)}
    }

    /**
     * Loads a game from csv line
     */
    @Transactional
    fun loadGame(line: String) {
        val split = line.split(";");
        val pattern = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")
        val date = Date.from(LocalDateTime.parse(split[2], pattern).toInstant(ZoneOffset.ofHours(2)));
        val exists = this.gameRepository.findByParams(split[0], split[1], date).isPresent;
        if (!exists) {
            val game = Game();
            game.teamHome = split[0];
            game.teamAway = split[1];
            game.startsAt = date;
            this.entityManager.persist(game);
            this.entityManager.flush();
        }
    }
}