package com.c24tipping.repository

import com.c24tipping.entity.Community
import com.c24tipping.entity.LeaderboardRank
import com.c24tipping.entity.User
import io.quarkus.hibernate.orm.panache.PanacheRepository
import jakarta.enterprise.context.ApplicationScoped
import jakarta.persistence.NoResultException
import jakarta.persistence.criteria.Join
import java.util.Optional

/**
 * The leaderboard rank repository handling previous leaderboard ranks
 */
@ApplicationScoped
class LeaderboardRankRepository : PanacheRepository<LeaderboardRank> {

    /**
     * Finds a rank by username and community
     *
     * @param username The username
     * @param community The community
     */
    fun findByUsernameAndCommunity(username: String, community: Community?): Optional<LeaderboardRank> {
        try {
            val cb = this.entityManager.criteriaBuilder;
            val cq = cb.createQuery(LeaderboardRank::class.java);
            val root = cq.from(LeaderboardRank::class.java)
            val userJoin: Join<LeaderboardRank, User> = root.join("user");
            val communityJoin: Join<LeaderboardRank, User> = root.join("community");
            var communityCondition = cb.isNull(root.get<Community?>("comunity"));
            if (community != null) {
                communityCondition = cb.equal(communityJoin.get<Long>("id"), community.id!!);
            }
            val criteria = cb.and(
                cb.equal(userJoin.get<String>("username"), username),
                communityCondition
            );
            cq.select(root).where(criteria);
            val results = this.entityManager.createQuery(cq).resultList;
            return Optional.of(results.get(0));
        } catch (e: Throwable) {
            return Optional.empty();
        }
    }
}