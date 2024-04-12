package com.c24tipping.service

import com.c24tipping.entity.User
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.transaction.Transactional

@ApplicationScoped
class LeaderboardService : AbstractService() {
    @Transactional
    fun updateGlobalLeaderboard(users: List<User>) {
        val sortedUsers: List<User> = users.sortedBy { it.preliminaryPoints };
        for (userIndex in sortedUsers.indices) {
            val hql = "UPDATE LeaderboardEntry as l SET l.user=:user WHERE l.placement=:placement";
            val query = this.entityManager.createQuery(hql);
            query.setParameter("user", sortedUsers.get(userIndex));
            query.setParameter("placement", userIndex);
            val res = query.executeUpdate();
            println(res);
        }
    }
}