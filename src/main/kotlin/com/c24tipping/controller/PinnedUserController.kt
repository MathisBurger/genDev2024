package com.c24tipping.controller

import com.c24tipping.data.request.PinUserRequest
import com.c24tipping.service.PinnedUserService
import jakarta.inject.Inject
import jakarta.ws.rs.*
import jakarta.ws.rs.core.MediaType
import jakarta.ws.rs.core.Response

/**
 * Handles pinned user requests
 */
@Path("/api/pinned")
class PinnedUserController {

    @Inject
    lateinit var pinnedUserService: PinnedUserService;

    /**
     * Gets all pinned users
     */
    @GET
    fun getPinnedUsers(
        @QueryParam("communityId") communityId: Long,
        @QueryParam("username") username: String
    ): Response {
        return Response.ok(this.pinnedUserService.getPinnedUsers(communityId, username)).build();
    }

    /**
     * Pins a user
     */
    @POST
    @Path("/pin")
    @Consumes(MediaType.APPLICATION_JSON)
    fun pinUser(data: PinUserRequest): Response {
        try {
            return Response.ok(this.pinnedUserService.pinUser(data.communityId, data.username, data.userToPin)).build();
        } catch (e: Exception) {
            return Response.status(400).entity(e.message).build();
        }
    }

    /**
     * Unpins a user
     */
    @POST
    @Path("/unpin")
    @Consumes(MediaType.APPLICATION_JSON)
    fun unpinUser(data: PinUserRequest): Response {
        try {
            return Response.ok(this.pinnedUserService.unpinUser(data.communityId, data.username, data.userToPin)).build();
        } catch (e: Exception) {
            return Response.status(400).entity(e.message).build();
        }
    }
}