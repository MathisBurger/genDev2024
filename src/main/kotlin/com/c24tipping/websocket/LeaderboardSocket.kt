package com.c24tipping.websocket

import com.c24tipping.repository.LeaderboardRepository
import com.c24tipping.websocket.data.LeaderboardSessionEntry
import jakarta.enterprise.context.ApplicationScoped
import jakarta.enterprise.context.control.ActivateRequestContext
import jakarta.inject.Inject
import jakarta.websocket.OnClose
import jakarta.websocket.OnMessage
import jakarta.websocket.OnOpen
import jakarta.websocket.Session
import jakarta.websocket.server.PathParam
import jakarta.websocket.server.ServerEndpoint
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.ExecutorService


/**
 * Socket that handles global leaderboard
 */
@ApplicationScoped
@ServerEndpoint("/api/socket/leaderboard/{username}")
class LeaderboardSocket {

    @Inject
    lateinit var leaderboardRepository: LeaderboardRepository;

    @Inject
    lateinit var executor: ExecutorService;

    private var sessions: ConcurrentHashMap<String, LeaderboardSessionEntry> = ConcurrentHashMap();

    /**
     * Sends leaderboard broadcast to all users
     */
    fun sendLeaderboardBroadcast() {
        this.sessions.values.forEach { this.executor.submit { this.sendLeaderboard(it) } }
    }

    @OnOpen
    fun onOpen(session: Session, @PathParam("username") username: String) {
            this.sessions[username] = LeaderboardSessionEntry(session, username, mutableListOf(1, -1));
            this.executor.submit { this.sendLeaderboard(this.sessions[username]!!); }
    }

    @OnClose
    fun onClose(session: Session?, @PathParam("username") username: String) {
        this.sessions.remove(username);
    }

    @OnMessage
    fun onMessage(message: String, @PathParam("username") username: String) {
        val session = this.sessions[username];
        if (session != null) {
            val spl = message.split(",");
            if (spl.size != 2) {
                return;
            }
            val newSession = LeaderboardSessionEntry(
                session.session,
                session.username,
                listOf(
                    session.pages.get(0)+spl.get(0).toInt(),
                    session.pages.get(1)+spl.get(1).toInt()
                )
            );
            this.sessions[username] = newSession;
            this.executor.submit { this.sendLeaderboard(newSession); }
        }
    }

    /**
     * Gets the leaderboard of a user
     */
    @ActivateRequestContext
    fun sendLeaderboard(entry: LeaderboardSessionEntry) {
        val entries = this.leaderboardRepository.getLeaderboard(entry.username, entry.pages.get(0), entry.pages.get(1));
        entry.session.asyncRemote.sendObject(entries.toString());
    }
}