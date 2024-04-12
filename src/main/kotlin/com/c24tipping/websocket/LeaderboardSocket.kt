package com.c24tipping.websocket

import com.c24tipping.entity.LeaderboardEntry
import com.c24tipping.repository.LeaderboardRepository
import com.c24tipping.websocket.data.LeaderboardSessionEntry
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.websocket.OnClose
import jakarta.websocket.OnMessage
import jakarta.websocket.OnOpen
import jakarta.websocket.Session
import jakarta.websocket.server.PathParam
import jakarta.websocket.server.ServerEndpoint
import java.util.concurrent.ConcurrentHashMap


@ApplicationScoped
@ServerEndpoint("/api/socket/leaderboard/{username}")
class LeaderboardSocket {

    @Inject
    lateinit var leaderboardRepository: LeaderboardRepository;

    var sessions: ConcurrentHashMap<String, LeaderboardSessionEntry> = ConcurrentHashMap();

    var leaderboard: MutableList<LeaderboardEntry>? = null;

    var usernameLeaderboardMap: ConcurrentHashMap<String, Int> = ConcurrentHashMap();

    fun setLeaderboard(list: MutableList<LeaderboardEntry>) {
        this.leaderboard = list;
        this.usernameLeaderboardMap = ConcurrentHashMap();
        for (index in 0..<list.size) {
            this.usernameLeaderboardMap.put(list.get(index).user!!.username!!, index);
        }
    }

    /**
     * Sends leaderboard broadcast to all users
     */
    fun setLeaderboardBroadcast(list: MutableList<LeaderboardEntry>) {
        this.setLeaderboard(list);
        this.sessions.values.forEach { it.session.asyncRemote.sendObject(this.getLeaderboard(it)) }
    }

    @OnOpen
    fun onOpen(session: Session, @PathParam("username") username: String) {
        this.sessions[username] = LeaderboardSessionEntry(session, username, mutableListOf(1, this.getLastPageNr()-1));
        session.asyncRemote.sendObject(this.getLeaderboard(this.sessions[username]!!));
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
                listOf(spl.get(0).toInt(), spl.get(1).toInt())
            );
            this.sessions[username] = newSession;
            newSession.session.asyncRemote.sendObject(this.getLeaderboard(newSession));
        }
    }

    /**
     * Gets the last leaderboard page
     */
    private fun getLastPageNr(): Int {
        if (this.leaderboard == null) {
            this.setLeaderboard(this.leaderboardRepository.listAll().sortedBy { it.placement }.toMutableList());
        }
        return (this.leaderboard?.size ?: 0) / 10;
    }

    /**
     * Gets the leaderboard of a user
     */
    private fun getLeaderboard(entry: LeaderboardSessionEntry): List<LeaderboardEntry> {
        val list: MutableList<LeaderboardEntry> = mutableListOf();
        list.addAll(this.leaderboard!!.subList(0, entry.pages.get(0)));
        val usernameIndex = this.usernameLeaderboardMap.get(entry.username);
        if (usernameIndex !== null && usernameIndex > (entry.pages.get(0) * 10)) {
            list.add(this.leaderboard!!.get(usernameIndex));
        }
        list.addAll(this.leaderboard!!.subList(entry.pages.get(1)*10, this.getLastPageNr()*10));
        return list;
    }
}