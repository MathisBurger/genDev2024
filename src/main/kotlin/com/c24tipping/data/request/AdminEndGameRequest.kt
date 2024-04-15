package com.c24tipping.data.request

import jakarta.json.bind.annotation.JsonbCreator

/**
 * Request body to end a game
 */
data class AdminEndGameRequest @JsonbCreator constructor(
    /**
     * The password of the admin UI
     */
    val password: String,
    /**
     * The ID of the game that should be ended
     */
    val gameId: Long
)