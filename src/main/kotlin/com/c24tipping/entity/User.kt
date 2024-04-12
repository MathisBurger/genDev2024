package com.c24tipping.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.ManyToMany
import jakarta.persistence.OneToMany

/**
 * User entity that is used for login
 */
@Entity(name = "c24_user")
class User : AbstractEntity() {

    /**
     * The username of the user
     * NOTE: The username is also used for login
     */
    var username: String? = null;

    /**
     * All communities a user is member in
     */
    @ManyToMany(mappedBy = "members")
    var communities: MutableList<Community> = mutableListOf();

    /**
     * All bets the user has made
     */
    @OneToMany
    var bets: MutableList<Bet> = mutableListOf();

    /**
     * Points of a user
     */
    var points: Int = 0;

    /**
     * Preliminary points
     */
    var preliminaryPoints: Int = 0;

    /**
     * All placements in leaderboards
     */
    @OneToMany(mappedBy = "user")
    var leaderboardPlacements: MutableList<LeaderboardEntry> = mutableListOf();
}