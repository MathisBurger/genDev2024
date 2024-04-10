package com.c24tipping.data.request

/**
 * Requests that must be authenticated
 */
abstract class AuthenticatedRequest {
    /**
     * The username of the user
     */
    abstract val username: String;
}
