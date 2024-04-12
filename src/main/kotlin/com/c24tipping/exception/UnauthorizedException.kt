package com.c24tipping.exception

/**
 * Thrown if a user is unauthorized for admin access
 */
class UnauthorizedException(string: String) : Exception(string) {
}