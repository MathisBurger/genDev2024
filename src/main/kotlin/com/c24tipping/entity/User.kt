package com.c24tipping.entity

import jakarta.persistence.*

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

    /**
     * All users that this user has pinned
     */
    @OneToMany(mappedBy = "pinningUser")
    @JoinTable(name = "user_pinned",
        joinColumns = [JoinColumn(name = "user_id", referencedColumnName = "id")],
        inverseJoinColumns = [JoinColumn(name = "pinned_id", referencedColumnName = "id")])
    var pinnedUsers: MutableList<PinnedUser> = mutableListOf();

    /**
     * All entrys where the user is pinned in
     */
    @OneToMany(mappedBy = "pinnedUser")
    @JoinTable(name = "user_pinned_in",
        joinColumns = [JoinColumn(name = "user_id", referencedColumnName = "id")],
        inverseJoinColumns = [JoinColumn(name = "pinned_id", referencedColumnName = "id")])
    var pinnedIn: MutableList<PinnedUser> = mutableListOf();

    override fun toString(): String {
        return buildJSON(this, listOf("communities", "bets", "leaderboardPlacements", "pinnedUsers", "pinnedIn"))
    }
}