package com.c24tipping.data.response

import jakarta.json.bind.annotation.JsonbCreator

/**
 * Extended community
 */
data class ExtendedCommunityResponse @JsonbCreator constructor(
    /**
     * The ID of the community
     */
    val id: Long,
    /**
     * The name of the community
     */
    val name: String,
    /**
     * The members
     */
    val members: List<CommunityMember>
)
