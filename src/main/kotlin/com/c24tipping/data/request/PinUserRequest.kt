package com.c24tipping.data.request

import jakarta.json.bind.annotation.JsonbCreator

/**
 * User to pin / unpin request
 */
data class PinUserRequest @JsonbCreator constructor(
    /**
     * The ID of the community
     */
    val communityId: Long,
    /**
     * The username of the current session user
     */
    val username: String,
    /**
     * The user that should be pinned
     */
    val userToPin: String
)
