package com.c24tipping.websocket

import com.c24tipping.repository.LeaderboardRepository
import com.c24tipping.websocket.data.CommunityLeaderboardSessionEntry
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
 * Handles community leaderboard socket transactions
 */
@ApplicationScoped
@ServerEndpoint("/api/socket/community/{communityId}/{username}")
class CommunitySocket {

    @Inject
    lateinit var leaderboardRepository: LeaderboardRepository;

    @Inject
    lateinit var executor: ExecutorService;

    private var sessions: ConcurrentHashMap<String, CommunityLeaderboardSessionEntry> = ConcurrentHashMap();

    /**
     * Sends leaderboard broadcast to all users
     *
     * @param communityId The ID of the community
     */
    fun sendLeaderboardBroadcast(communityId: Long) {
        this.sessions.values.filter { it.communityId == communityId  }.forEach { this.executor.submit { this.sendLeaderboard(it) } }
    }

    @OnOpen
    fun onOpen(session: Session, @PathParam("communityId") id: Long, @PathParam("username") username: String) {
        this.sessions["$id-$username"] = CommunityLeaderboardSessionEntry(session, username, mutableListOf(1, -1), id);
        this.executor.submit { this.sendLeaderboard(this.sessions["$id-$username"]!!); }
    }

    @OnClose
    fun onClose(session: Session?, @PathParam("communityId") id: Long, @PathParam("username") username: String) {
        this.sessions.remove("$id-$username");
    }

    @OnMessage
    fun onMessage(message: String, @PathParam("communityId") id: Long, @PathParam("username") username: String) {
        val session = this.sessions["$id-$username"];
        if (session != null) {
            val spl = message.split(",");
            if (spl.size != 2) {
                return;
            }
            val newSession = CommunityLeaderboardSessionEntry(
                session.session,
                session.username,
                listOf(
                    session.pages.get(0)+spl.get(0).toInt(),
                    session.pages.get(1)+spl.get(1).toInt()
                ),
                session.communityId
            );
            this.sessions["$id-$username"] = newSession;
            this.executor.submit { this.sendLeaderboard(newSession); }
        }
    }

    /**
     * Gets the leaderboard of a user
     */
    @ActivateRequestContext
    fun sendLeaderboard(entry: CommunityLeaderboardSessionEntry) {
        val entries = this.leaderboardRepository.getLeaderboard(entry.username, entry.pages.get(0), entry.pages.get(1), entry.communityId);
        entry.session.asyncRemote.sendObject(entries.toString());
    }
}