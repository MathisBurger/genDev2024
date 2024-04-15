package com.c24tipping.entity

import jakarta.persistence.Entity
import jakarta.persistence.ManyToOne

/**
 * A pinned user in a community leaderboard
 */
@Entity
class PinnedUser : AbstractEntity() {

    /**
     * The pinned user
     */
    @ManyToOne
    var pinnedUser: User? = null;

    /**
     * The community the leaderboard is assigned to
     */
    @ManyToOne
    var community: Community? = null;

    /**
     * The user who is pinning the user.
     */
    @ManyToOne
    var pinningUser: User? =  null;
}