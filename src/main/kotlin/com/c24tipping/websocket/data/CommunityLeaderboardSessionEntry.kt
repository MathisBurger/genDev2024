package com.c24tipping.websocket.data

import jakarta.websocket.Session

/**
 * Session entry for community leaderboards
 */
data class CommunityLeaderboardSessionEntry(
    /**
     * The websocket session
     */
    val session: Session,
    /**
     * The username of the session user
     */
    val username: String,
    /**
     * The pagination pages of the user
     */
    val pages: List<Int>,
    /**
     * The requested community id
     */
    val communityId: Long
)