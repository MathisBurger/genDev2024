package com.c24tipping.data.request

import jakarta.json.bind.annotation.JsonbCreator

/**
 * Request object for placing a bet
 */
data class PlaceBetRequest @JsonbCreator constructor(
    /**
     * The users username
     */
    override val username: String,
    /**
     * The ID of the game
     */
    val gameId: Long,
    /**
     * All home goals
     */
    val homeGoals: Int,
    /**
     * All away goals
     */
    val awayGoals: Int
) : AuthenticatedRequest()
