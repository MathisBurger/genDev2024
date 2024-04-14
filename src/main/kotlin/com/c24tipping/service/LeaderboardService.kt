package com.c24tipping.service

import com.c24tipping.entity.User
import com.c24tipping.repository.LeaderboardRepository
import com.c24tipping.websocket.LeaderboardSocket
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.transaction.Synchronization
import jakarta.transaction.Transaction
import jakarta.transaction.TransactionManager
import jakarta.transaction.Transactional


@ApplicationScoped
class LeaderboardService : AbstractService() {

    @Inject
    lateinit var leaderboardSocket: LeaderboardSocket;

    @Inject
    lateinit var leaderboardRepository: LeaderboardRepository;

    @Inject
    lateinit var transactionManager: TransactionManager;

    fun updateGlobalLeaderboard(users: List<User>) {
        val sortedUsers: List<User> = users.sortedBy { it.preliminaryPoints }.reversed();
        this.databaseUpdate(sortedUsers);
        val transaction: Transaction = transactionManager.transaction
        transaction.registerSynchronization(object : Synchronization {
            override fun beforeCompletion() {
                //nothing here
            }

            override fun afterCompletion(status: Int) {
                leaderboardSocket.sendLeaderboardBroadcast();
            }
        })

    }

    @Transactional
    fun databaseUpdate(users: List<User>) {
        for (userIndex in users.indices) {
            val hql = "UPDATE LeaderboardEntry as l SET l.user=:user WHERE l.placement=:placement";
            val query = this.entityManager.createQuery(hql);
            query.setParameter("user", users.get(userIndex));
            query.setParameter("placement", userIndex+1);
            query.executeUpdate();
        }
    }
}