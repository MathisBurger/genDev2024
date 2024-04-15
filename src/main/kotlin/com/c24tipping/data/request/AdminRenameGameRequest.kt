package com.c24tipping.data.request

import jakarta.json.bind.annotation.JsonbCreator

/**
 * Request to update game name
 */
data class AdminRenameGameRequest @JsonbCreator constructor(
    /**
     * The password of the admin UI
     */
    val password: String,
    /**
     * The ID of the game that should be ended
     */
    val gameId: Long,
    /**
     * The home team name
     */
    val teamHome: String,
    /**
     * The away team name
     */
    val teamAway: String
)