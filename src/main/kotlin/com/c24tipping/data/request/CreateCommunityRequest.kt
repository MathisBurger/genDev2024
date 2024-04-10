package com.c24tipping.data.request

import jakarta.json.bind.annotation.JsonbCreator

/**
 * Request used to create a community
 */
data class CreateCommunityRequest @JsonbCreator constructor(
    /**
     * The username
     */
    override val username: String,
    /**
     * The name of the community
     */
    val communityName: String
) : AuthenticatedRequest()
