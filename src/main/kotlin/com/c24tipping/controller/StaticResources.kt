package com.c24tipping.controller

import io.vertx.ext.web.Router
import io.vertx.ext.web.handler.StaticHandler
import jakarta.enterprise.context.ApplicationScoped
import jakarta.enterprise.event.Observes
import java.io.File


/**
 * Static file handler
 */
@ApplicationScoped
class StaticResources {

    /**
     * Registers routes and static handlers
     */
    fun init(@Observes router: Router) {
        router.route()
            .path("/*")
            .handler(StaticHandler.create("static/"))
        router.errorHandler(404) { routingContext ->
            var file = File("static/" + routingContext.request().path() + ".html")
            if (!file.canRead()) {
                file = File("static/404.html");
            }
            routingContext.response().setStatusCode(200).end(file.readText())
        }
    }
}