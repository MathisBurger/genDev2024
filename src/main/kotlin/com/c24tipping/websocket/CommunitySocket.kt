package com.c24tipping.websocket

import jakarta.enterprise.context.ApplicationScoped
import jakarta.websocket.OnClose
import jakarta.websocket.OnMessage
import jakarta.websocket.OnOpen
import jakarta.websocket.Session
import jakarta.websocket.server.PathParam
import jakarta.websocket.server.ServerEndpoint
import java.util.concurrent.ConcurrentHashMap


@ApplicationScoped
@ServerEndpoint("/api/socket/community/{communityId}")
class CommunitySocket {

    var sessions: MutableList<Session> = mutableListOf();

    @OnOpen
    fun onOpen(session: Session, @PathParam("communityId") id: Long) {
        sessions.add(session);
    }

    @OnClose
    fun onClose(session: Session?, @PathParam("communityId") id: Long) {
        sessions.remove(session);
    }
}