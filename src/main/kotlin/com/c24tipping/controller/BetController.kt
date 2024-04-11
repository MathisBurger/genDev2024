package com.c24tipping.controller

import com.c24tipping.data.request.PlaceBetRequest
import com.c24tipping.service.BetService
import jakarta.inject.Inject
import jakarta.ws.rs.*
import jakarta.ws.rs.core.MediaType
import jakarta.ws.rs.core.Response

/**
 * Controller handling bet requests
 */
@Path("/api/bets")
class BetController {

    @Inject
    lateinit var betService: BetService;

    /**
     * Gets all personal bets
     */
    @GET
    @Path("/personal")
    fun getPersonalBets(@QueryParam("username") username: String): Response {
        return Response.ok(this.betService.getPersonalBets(username)).build();
    }

    /**
     * Places a bet
     */
    @POST
    @Path("/place")
    @Consumes(MediaType.APPLICATION_JSON)
    fun placeBet(data: PlaceBetRequest): Response {
        try {
            val resp = this.betService.placeBet(data.gameId, data.username, data.homeGoals, data.awayGoals);
            return Response.ok(resp).build();
        } catch (e: Exception) {
            return Response.status(400).entity(e.message).build();
        }
    }
}