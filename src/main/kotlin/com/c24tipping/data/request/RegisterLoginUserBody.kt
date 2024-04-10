package com.c24tipping.data.request

import jakarta.json.bind.annotation.JsonbCreator

/**
 * Request body for user creation request
 */
data class RegisterLoginUserBody @JsonbCreator constructor(
    /**
     * The username of the user
     */
    val username: String
)
