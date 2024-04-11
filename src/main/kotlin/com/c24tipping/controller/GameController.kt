package com.c24tipping.controller

import com.c24tipping.service.GameService
import jakarta.inject.Inject
import jakarta.ws.rs.GET
import jakarta.ws.rs.Path
import jakarta.ws.rs.core.Response

@Path("/api/games")
class GameController {

    @Inject
    lateinit var gameService: GameService;

    /**
     * Gets all games
     */
    @GET
    fun getAllGames(): Response {
        return Response.ok(this.gameService.getAllGames()).build();
    }
}