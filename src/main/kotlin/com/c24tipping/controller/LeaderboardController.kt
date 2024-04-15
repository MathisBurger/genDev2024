package com.c24tipping.controller

import com.c24tipping.service.LeaderboardService
import jakarta.inject.Inject
import jakarta.ws.rs.GET
import jakarta.ws.rs.Path
import jakarta.ws.rs.QueryParam
import jakarta.ws.rs.core.Response

/**
 * Handles leaderboard requests
 */
@Path("/api/leaderboard/dashboard")
class LeaderboardController {

    @Inject
    lateinit var leaderboardService: LeaderboardService;

    /**
     * Gets the dashboard leaderboard
     */
    @GET
    fun getDashboardLeaderboard(@QueryParam("communityId") communityId: Long, @QueryParam("username") username: String): Response {
        var id: Long? = communityId;
        if (communityId == -1L) {
            id = null;
        }
        return Response.ok(this.leaderboardService.getDashboardLeaderboard(id, username).toString()).build();
    }
}