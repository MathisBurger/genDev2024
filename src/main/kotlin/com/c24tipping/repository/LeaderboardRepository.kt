package com.c24tipping.repository

import com.c24tipping.entity.LeaderboardEntry
import io.quarkus.hibernate.orm.panache.PanacheRepository
import io.quarkus.panache.common.Sort
import jakarta.enterprise.context.ApplicationScoped

@ApplicationScoped
class LeaderboardRepository : PanacheRepository<LeaderboardEntry> {

    fun listSorted(): MutableList<LeaderboardEntry> {
        return find("", Sort.by("placement", Sort.Direction.Ascending)).list();
    }

    /**
     * Query for global leaderboard
     */
    fun getGlobalLeaderboard(username: String, lowerPage: Int, upperPage: Int): List<LeaderboardEntry> {
        val count = find("").count();
        var lp = lowerPage;
        if (lowerPage == -1) {
            lp = (count / 10).toInt()-1;
        }
        return find(
            "FROM LeaderboardEntry e JOIN e.user u WHERE u.username = ?1 OR e.placement < ?2 OR e.placement > ?3",
            Sort.by("placement", Sort.Direction.Ascending),
            username,
            upperPage*10,
            lowerPage*10
        ).list();
    }
}