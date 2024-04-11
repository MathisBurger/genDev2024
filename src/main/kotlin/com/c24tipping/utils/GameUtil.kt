package com.c24tipping.utils

import com.c24tipping.data.response.MinifiedGame
import com.c24tipping.entity.Game

/**
 * The util for games
 */
class GameUtil {

    companion object {

        /**
         * Converts game to the minified version
         */
        fun convertToMinified(game: Game): MinifiedGame {
            return MinifiedGame(
                game.id!!,
                game.teamHome!!,
                game.teamAway!!,
                game.startsAt!!,
                game.goalsHome,
                game.goalsAway
            );
        }
    }
}