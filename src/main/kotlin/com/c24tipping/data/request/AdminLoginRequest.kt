package com.c24tipping.data.request

import jakarta.json.bind.annotation.JsonbCreator

/**
 * The admin login request
 */
data class AdminLoginRequest @JsonbCreator constructor(
    /**
     * The password of the user
     */
    val password: String
)
