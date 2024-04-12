package com.c24tipping.service

import com.c24tipping.entity.User
import com.c24tipping.repository.LeaderboardRepository
import com.c24tipping.websocket.LeaderboardSocket
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.transaction.Transactional

@ApplicationScoped
class LeaderboardService : AbstractService() {

    @Inject
    lateinit var leaderboardSocket: LeaderboardSocket;

    @Inject
    lateinit var leaderboardRepository: LeaderboardRepository;

    @Transactional
    fun updateGlobalLeaderboard(users: List<User>) {
        val sortedUsers: List<User> = users.sortedBy { it.preliminaryPoints }.reversed();
        for (userIndex in sortedUsers.indices) {
            val hql = "UPDATE LeaderboardEntry as l SET l.user=:user WHERE l.placement=:placement";
            val query = this.entityManager.createQuery(hql);
            query.setParameter("user", sortedUsers.get(userIndex));
            query.setParameter("placement", userIndex+1);
            val res = query.executeUpdate();
        }
        this.leaderboardSocket.sendLeaderboardBroadcast();
    }
}