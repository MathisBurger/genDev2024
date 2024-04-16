package com.c24tipping.scheduler

import com.c24tipping.entity.LeaderboardRank
import com.c24tipping.repository.LeaderboardRankRepository
import com.c24tipping.repository.LeaderboardRepository
import io.quarkus.scheduler.Scheduled
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.persistence.EntityManager
import jakarta.transaction.Transactional
import java.util.Optional

/**
 * Scheduler for previous ranks
 */
@ApplicationScoped
class PreviousRankScheduler {

    @Inject
    lateinit var leaderboardRepository: LeaderboardRepository;

    @Inject
    lateinit var leaderboardRankRepository: LeaderboardRankRepository;

    @Inject
    lateinit var entityManager: EntityManager;

    /**
     * Updates all previous ranks
     */
    @Scheduled(cron = "0 0 0 * * ? *")
    @Transactional
    fun updatePreviousRanks() {
        val leaderboardEntries = this.leaderboardRepository.listAll();
        for (entry in leaderboardEntries) {
            val rank = this.leaderboardRankRepository.findByUsernameAndCommunity(entry.user!!.username!!, entry.community);
            if (rank.isEmpty) {
                val newRank = LeaderboardRank()
                newRank.previousRank = entry.placement;
                newRank.user = entry.user;
                newRank.community = entry.community;
                this.entityManager.persist(newRank);
                entry.user!!.previousRanks.add(newRank);
                this.entityManager.persist(entry.user)
                if (entry.community != null) {
                    entry.community!!.leaderboardRanks.add(newRank);
                    this.entityManager.persist(entry.community);
                }
                this.entityManager.flush();
            } else {
                rank.get().previousRank = entry.placement;
                this.entityManager.persist(rank.get());
                this.entityManager.flush();
            }
        }
    }
}