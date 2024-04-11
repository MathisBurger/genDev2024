package com.c24tipping.entity

import jakarta.persistence.Entity
import jakarta.persistence.OneToMany
import java.util.Date

/**
 * A same that can be bet on
 */
@Entity
class Game : AbstractEntity() {

    /**
     * The home team
     */
    var teamHome: String? = null;

    /**
     * The away team
     */
    var teamAway: String? = null;

    /**
     * The start time of the game
     */
    var startsAt: Date? = null;

    /**
     * Goals for home team
     */
    var goalsHome: Int? = null;

    /**
     * Goals for away team
     */
    var goalsAway: Int? = null;

    /**
     * All bets on this game
     */
    @OneToMany
    var bets: MutableList<Bet> = mutableListOf();

    /**
     * If all bets on this game have been evaluated
     */
    var bettingTransactionsDone: Boolean = false;
}