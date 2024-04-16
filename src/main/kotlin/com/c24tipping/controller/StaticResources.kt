package com.c24tipping.controller

import io.quarkus.runtime.StartupEvent
import io.vertx.ext.web.Router
import io.vertx.ext.web.handler.StaticHandler
import jakarta.enterprise.event.Observes

class StaticResources {

    fun installRoutes(@Observes startupEvent: StartupEvent, router: Router) {
        router.route()
            .path("/*")
            .handler(StaticHandler.create("static/"))
    }
}