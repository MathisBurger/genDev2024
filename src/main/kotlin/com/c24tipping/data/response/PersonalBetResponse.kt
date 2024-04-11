package com.c24tipping.data.response

import jakarta.json.bind.annotation.JsonbCreator

/**
 * Personal bet response
 */
data class PersonalBetResponse @JsonbCreator constructor(
    /**
     * ID of the bet
     */
    val id: Long,
    /**
     * Home goals of the bet
     */
    val goalsHome: Int,
    /**
     * Away goals of the bet
     */
    val goalsAway: Int,
    /**
     * All bet points
     */
    val betPoints: Int?,
    /**
     * The game of the bet
     */
    val game: MinifiedGame
)
