package com.c24tipping.data.response

import jakarta.json.bind.annotation.JsonbCreator
import java.util.Date

/**
 * A minified game for response
 */
data class MinifiedGame @JsonbCreator constructor(
    /**
     * The ID of the game
     */
    val id: Long,
    /**
     * The home team
     */
    val teamHome: String,
    /**
     * The away team
     */
    val teamAway: String,
    /**
     * When the game starts
     */
    val startsAt: Date,
    /**
     * All home goals
     */
    var goalsHome: Int?,
    /**
     * All away goals
     */
    var goalsAway: Int?
)
