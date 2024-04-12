package com.c24tipping.websocket

import jakarta.enterprise.context.ApplicationScoped
import jakarta.websocket.OnClose
import jakarta.websocket.OnOpen
import jakarta.websocket.Session
import jakarta.websocket.server.PathParam
import jakarta.websocket.server.ServerEndpoint

@ApplicationScoped
@ServerEndpoint("/api/socket/leaderboard")
class LeaderboardSocket {

    var sessions: MutableList<Session> = mutableListOf();

    @OnOpen
    fun onOpen(session: Session, @PathParam("communityId") id: Long) {
        sessions.add(session);
        // TODO: Send global leaderboard
    }

    @OnClose
    fun onClose(session: Session?, @PathParam("communityId") id: Long) {
        sessions.remove(session);
    }
}