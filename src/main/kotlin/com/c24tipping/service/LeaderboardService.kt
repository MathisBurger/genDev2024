package com.c24tipping.service

import com.c24tipping.entity.Community
import com.c24tipping.entity.LeaderboardEntry
import com.c24tipping.entity.User
import com.c24tipping.repository.CommunityRepository
import com.c24tipping.repository.LeaderboardRepository
import com.c24tipping.repository.UserRepository
import com.c24tipping.websocket.CommunitySocket
import com.c24tipping.websocket.LeaderboardSocket
import io.quarkus.narayana.jta.QuarkusTransaction
import jakarta.enterprise.context.ApplicationScoped
import jakarta.enterprise.context.control.ActivateRequestContext
import jakarta.inject.Inject
import jakarta.transaction.Synchronization
import jakarta.transaction.Transaction
import jakarta.transaction.TransactionManager
import jakarta.transaction.Transactional


/**
 * Handles leaderboard transactions
 */
@ApplicationScoped
class LeaderboardService : AbstractService() {

    @Inject
    lateinit var leaderboardSocket: LeaderboardSocket;

    @Inject
    lateinit var communitySocket: CommunitySocket;

    @Inject
    lateinit var userRepository: UserRepository;

    @Inject
    lateinit var communityRepository: CommunityRepository;

    @Inject
    lateinit var transactionManager: TransactionManager;

    @Inject
    lateinit var leaderboardRepository: LeaderboardRepository;

    /**
     * Gets the dashboard for a user
     *
     * @param communityId The ID of the community
     * @param username The users username
     */
    fun getDashboardLeaderboard(communityId: Long?, username: String): List<LeaderboardEntry> {
        return this.leaderboardRepository.getDashboardLeaderboard(communityId, username);
    }

    /**
     * Updates the global leaderboard
     *
     * @param users A list of users
     */
    fun updateGlobalLeaderboard(userIds: List<Long>) {
        val users = this.userRepository.findByUserIds(userIds);
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

    /**
     * Updates a specific community leaderboard
     *
     * @param community The community that should be updated
     */
    fun updateCommunityLeaderboard(communityId: Long) {
        val community = this.communityRepository.findByIdOptional(communityId).get();
        val sorted = community.members.sortedBy { it.preliminaryPoints }.reversed();
        this.databaseUpdate(sorted, community);
        val transaction: Transaction = transactionManager.transaction
        transaction.registerSynchronization(object : Synchronization {
            override fun beforeCompletion() {
                //nothing here
            }

            override fun afterCompletion(status: Int) {
                print(3)
                communitySocket.sendLeaderboardBroadcast(community.id!!);
            }
        })
    }

    /**
     * Updates the database entries
     *
     * @param users All users sorted
     * @param community The community if given
     */
    fun databaseUpdate(users: List<User>, community: Community? = null) {
        for (userIndex in users.indices) {
                var hql = "UPDATE LeaderboardEntry as l SET l.user=:user WHERE l.placement=:placement";
                hql += if (community != null) {
                    " AND l.community=:community";
                } else {
                    " AND l.community IS NULL";
                }
                val query = this.entityManager.createQuery(hql);
                query.setParameter("user", users.get(userIndex));
                query.setParameter("placement", userIndex+1);
                if (community != null) {
                    query.setParameter("community", community);
                }
                query.executeUpdate();
        }
    }
}