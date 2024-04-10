package com.c24tipping.data.request

import jakarta.json.bind.annotation.JsonbCreator

/**
 * Used to join a community
 */
data class JoinCommunityRequest @JsonbCreator constructor(
    /**
     * The username of the user
     */
    override val username: String,
    /**
     * The ID of the community
     */
    val communityId: Long
) : AuthenticatedRequest()
