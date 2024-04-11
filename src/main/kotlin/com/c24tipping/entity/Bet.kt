package com.c24tipping.entity

import jakarta.persistence.Entity
import jakarta.persistence.ManyToOne

/**
 * A bet on a game
 */
@Entity
class Bet : AbstractEntity() {

    /**
     * The game the user bet on
     */
    @ManyToOne
    var game: Game? = null;

    /**
     * The user who bet on the game
     */
    @ManyToOne
    var user: User? = null;

    /**
     * Bet home goals
     */
    var goalsHome: Int? = null;

    /**
     * Bet away goals
     */
    var goalsAway: Int? = null;

    /**
     * How many points were appended to the users account after bet handling
     */
    var betPoints: Int? = null;

    /**
     * If the betting transaction on this bet is done
     */
    var bettingTransactionDone: Boolean = false;
}