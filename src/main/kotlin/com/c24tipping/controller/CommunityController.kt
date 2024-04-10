package com.c24tipping.controller

import com.c24tipping.data.request.CreateCommunityRequest
import com.c24tipping.data.request.JoinCommunityRequest
import com.c24tipping.entity.Community
import com.c24tipping.service.CommunityService
import jakarta.inject.Inject
import jakarta.ws.rs.*
import jakarta.ws.rs.core.MediaType
import jakarta.ws.rs.core.Response

/**
 * Handles community request
 */
@Path("/api/communities")
class CommunityController {

    @Inject
    lateinit var communityService: CommunityService;

    /**
     * Pages all communities
     */
    @GET
    fun getAllCommunities(@QueryParam("pageSize") pageSize: Int, @QueryParam("pageNr") pageNr: Int): Response {
        try {
            return Response.ok(this.communityService.getAllCommunities(pageSize, pageNr)).build();
        } catch (e: Exception) {
            return Response.status(400).entity(e.message).build();
        }
    }

    /**
     * Gets the amount of communities
     */
    @GET
    @Path("/count")
    fun getAmountOfCommunities(): Response {
        return Response.ok(this.communityService.getCommunityRowCount()).build();
    }

    /**
     * Creates a new community
     */
    @POST
    @Path("/create")
    @Consumes(MediaType.APPLICATION_JSON)
    fun createCommunity(data: CreateCommunityRequest): Response {
        try {
            return Response.ok(this.communityService.createNewCommunity(data)).build();
        } catch (e: Exception) {
            return Response.status(400).entity(e.message).build();
        }
    }

    /**
     * Joins a community
     */
    @POST
    @Path("/join")
    @Consumes(MediaType.APPLICATION_JSON)
    fun joinCommunity(data: JoinCommunityRequest): Response {
        try {
            return Response.ok(this.communityService.joinCommunity(data)).build();
        } catch (e: Exception) {
            return Response.status(400).entity(e.message).build();
        }
    }
}