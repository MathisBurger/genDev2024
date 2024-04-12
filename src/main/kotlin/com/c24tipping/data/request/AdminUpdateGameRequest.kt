package com.c24tipping.data.request

import jakarta.json.bind.annotation.JsonbCreator

/**
 * The admin update game request
 */
data class AdminUpdateGameRequest @JsonbCreator constructor(
    /**
     * The password of the admin UI
     */
    val password: String,
    /**
     * The ID of the game that should be updated
     */
    val gameId: Long,
    /**
     * The goals of the away team
     */
    val goalsAway: Int,
    /**
     * The goals of the home team
     */
    val goalsHome: Int
)
