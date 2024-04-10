package com.c24tipping.data.response

import jakarta.json.bind.annotation.JsonbCreator

/**
 * Community response
 */
data class CommunityResponse @JsonbCreator constructor(
    /**
     * The ID of the community
     */
    val id: Long,
    /**
     * The name of the community
     */
    val name: String,
    /**
     * The member count
     */
    val memberCount: Int
)
