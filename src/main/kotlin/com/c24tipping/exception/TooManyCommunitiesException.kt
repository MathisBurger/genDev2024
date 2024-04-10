package com.c24tipping.exception

/**
 * Thrown if user is member in too many communities
 */
class TooManyCommunitiesException(string: String) : Exception(string) {
}