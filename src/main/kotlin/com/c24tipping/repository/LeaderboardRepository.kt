package com.c24tipping.repository

import com.c24tipping.entity.LeaderboardEntry
import io.quarkus.hibernate.orm.panache.PanacheRepository
import io.quarkus.panache.common.Sort
import jakarta.enterprise.context.ApplicationScoped
import jakarta.persistence.LockModeType

@ApplicationScoped
class LeaderboardRepository : PanacheRepository<LeaderboardEntry> {

    fun listSorted(): MutableList<LeaderboardEntry> {
        return find("", Sort.by("placement", Sort.Direction.Ascending)).list();
    }

    /**
     * Query for global leaderboard
     */
    fun getGlobalLeaderboard(username: String, upperPage: Int, lowerPage: Int): List<LeaderboardEntry> {
        val count = find("").count();
        var lp = lowerPage;
        if (lowerPage == -1) {
            lp = (count / 10).toInt()-1;
        }
        val locked =  find(
            "FROM LeaderboardEntry e JOIN e.user u WHERE u.username = ?1 OR e.placement < ?2 OR e.placement > ?3",
            Sort.by("placement", Sort.Direction.Ascending),
            username,
            this.getPageLimit(upperPage, count, 1),
            this.getPageLimit(lp, count, 0)
        );
        return locked.list();
    }

    /**
     * Gets the page limit from function
     *
     * @param pageNr The page Nr
     * @param count The element count
     * @param pageType The type of page (1 for upper, 0 for lower)
     */
    private fun getPageLimit(pageNr: Int, count: Long, pageType: Int): Int {
        if (pageNr == (count / 10).toInt()-1) {
            return (pageNr+1) *10 -3;
        }
        if (pageNr == 1) {
            return 4;
        }
        if (pageType == 1) {
            return (pageNr-1)*10+4;
        }
        return (count-3+(pageNr+1)*10).toInt();
    }
}