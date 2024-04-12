package com.c24tipping.entity

import jakarta.persistence.Entity
import jakarta.persistence.ManyToOne

/**
 * An entry into the leaderboard
 */
@Entity
class LeaderboardEntry : AbstractEntity() {

    /**
     * The placement of the user in the leaderboard
     */
    var placement: Int = 0;

    /**
     * The user that is placed on this place
     */
    @ManyToOne
    var user: User? = null;


    override fun toString(): String {
        return buildJSON(this, listOf());
    }
}