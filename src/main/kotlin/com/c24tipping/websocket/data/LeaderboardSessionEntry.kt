package com.c24tipping.websocket.data

import jakarta.websocket.Session

data class LeaderboardSessionEntry(
    val session: Session,
    val username: String,
    val pages: List<Int>
)