package com.c24tipping.controller

import com.c24tipping.data.request.RegisterLoginUserBody
import com.c24tipping.exception.UserExistsException
import com.c24tipping.service.UserService
import jakarta.inject.Inject
import jakarta.ws.rs.Consumes
import jakarta.ws.rs.POST
import jakarta.ws.rs.Path
import jakarta.ws.rs.core.MediaType
import jakarta.ws.rs.core.Response

/**
 * User controller to handle requests
 */
@Path("/api/user")
class UserController {

    @Inject
    lateinit var userService: UserService;

    /**
     * Register endpoint
     */
    @POST
    @Path("/register")
    @Consumes(MediaType.APPLICATION_JSON)
    fun register(body: RegisterLoginUserBody): Response {
        try {
            this.userService.registerUser(body.username);
            return Response.ok().build();
        } catch (e: UserExistsException) {
            return Response.status(400, e.message!!).build();
        }
    }

    /**
     * Login endpoint
     */
    @POST
    @Path("/login")
    @Consumes(MediaType.APPLICATION_JSON)
    fun login(body: RegisterLoginUserBody): Response {
        if (this.userService.loginUser(body.username)) {
            return Response.ok().build();
        }
        return Response.status(401).build();
    }
}