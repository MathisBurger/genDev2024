package com.c24tipping.controller

import com.c24tipping.data.request.AdminLoginRequest
import com.c24tipping.data.request.AdminUpdateGameRequest
import com.c24tipping.service.AdminService
import jakarta.inject.Inject
import jakarta.ws.rs.Consumes
import jakarta.ws.rs.POST
import jakarta.ws.rs.Path
import jakarta.ws.rs.core.MediaType
import jakarta.ws.rs.core.Response

@Path("/api/admin")
class AdminController {

    @Inject
    lateinit var adminService: AdminService;

    @POST
    @Path("/login")
    @Consumes(MediaType.APPLICATION_JSON)
    fun login(data: AdminLoginRequest): Response {
        if (this.adminService.canLogin(data.password)) {
            return Response.ok().build();
        }
        return Response.status(401).build();
    }

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
}