package com.c24tipping.data.response

import jakarta.json.bind.annotation.JsonbCreator

/**
 * A community member
 */
data class CommunityMember @JsonbCreator constructor(
    /**
     * The ID of the community member
     */
    val id: Long,
    /**
     * The username of the member
     */
    val username: String
)
