package com.c24tipping.entity

import jakarta.persistence.Entity
import jakarta.persistence.ManyToOne
import jakarta.persistence.OneToMany

/**
 * A previous leaderboard rank of the user
 */
@Entity
class LeaderboardRank : AbstractEntity() {

    /**
     * The user that is assigend to rank
     */
    @ManyToOne
    var user: User? = null;

    /**
     * The community the rank is assigned to
     */
    @ManyToOne
    var community: Community? = null;

    /**
     * The previous rank of the user
     */
    var previousRank: Int? = null;

    override fun toString(): String {
        return AbstractEntity.buildJSON(this, listOf("user"))
    }
}