package com.c24tipping.controller

import com.c24tipping.data.request.AdminEndGameRequest
import com.c24tipping.data.request.AdminLoginRequest
import com.c24tipping.data.request.AdminRenameGameRequest
import com.c24tipping.data.request.AdminUpdateGameRequest
import com.c24tipping.service.AdminService
import jakarta.inject.Inject
import jakarta.ws.rs.Consumes
import jakarta.ws.rs.POST
import jakarta.ws.rs.Path
import jakarta.ws.rs.core.MediaType
import jakarta.ws.rs.core.Response

/**
 * Controller handling admin requests
 */
@Path("/api/admin")
class AdminController {

    @Inject
    lateinit var adminService: AdminService;

    /**
     * Logs in an admin
     */
    @POST
    @Path("/login")
    @Consumes(MediaType.APPLICATION_JSON)
    fun login(data: AdminLoginRequest): Response {
        if (this.adminService.canLogin(data.password)) {
            return Response.ok().build();
        }
        return Response.status(401).build();
    }

    /**
     * Updates a game
     */
    @POST
    @Path("/updateGame")
    @Consumes(MediaType.APPLICATION_JSON)
    fun updateGame(data: AdminUpdateGameRequest): Response {
        try {
            this.adminService.updateFootballGame(data.password, data.gameId, data.goalsHome, data.goalsAway);
            return Response.ok().build();
        } catch (e: Exception) {
            return Response.status(401).entity(e.message).build();
        }
    }

    /**
     * Ends a game
     */
    @POST
    @Path("/endGame")
    @Consumes(MediaType.APPLICATION_JSON)
    fun endGame(data: AdminEndGameRequest): Response {
        try {
            this.adminService.endGame(data.password, data.gameId);
            return Response.ok().build();
        } catch (e: Exception) {
            return Response.status(401).entity(e.message).build();
        }
    }

    /**
     * Renames a game
     */
    @POST
    @Path("/renameGame")
    @Consumes(MediaType.APPLICATION_JSON)
    fun renameGame(data: AdminRenameGameRequest): Response {
        try {
            this.adminService.renameGame(data.password, data.gameId, data.teamHome, data.teamAway);
            return Response.ok().build();
        } catch (e: Exception) {
            return Response.status(401).entity(e.message).build();
        }
    }


}