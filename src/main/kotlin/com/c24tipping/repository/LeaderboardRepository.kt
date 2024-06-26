package com.c24tipping.repository

import com.c24tipping.entity.Community
import com.c24tipping.entity.LeaderboardEntry
import com.c24tipping.entity.PinnedUser
import com.c24tipping.entity.User
import com.c24tipping.websocket.data.SocketDataResponse
import io.quarkus.hibernate.orm.panache.PanacheRepository
import io.quarkus.panache.common.Sort
import jakarta.enterprise.context.ApplicationScoped
import jakarta.persistence.criteria.*
import kotlin.math.ceil

/**
 * Handles leaderboard transactions
 */
@ApplicationScoped
class LeaderboardRepository : PanacheRepository<LeaderboardEntry> {

    @Deprecated(message = "This method is not used anymore", replaceWith = ReplaceWith("Nothing"))
    fun listSorted(): MutableList<LeaderboardEntry> {
        return find("", Sort.by("placement", Sort.Direction.Ascending)).list();
    }

    /**
     * Gets a dashboard leaderboard
     *
     * @param communityId The ID of a community
     * @param username The username of the current user
     */
    fun getDashboardLeaderboard(communityId: Long?, username: String): List<LeaderboardEntry> {
        var cb = this.entityManager.criteriaBuilder;
        val cq = cb.createQuery(LeaderboardEntry::class.java);
        val root = cq.from(LeaderboardEntry::class.java);
        val userJoin: Join<LeaderboardEntry, User> = root.join("user");
        val count = this.countQuery(communityId);
        if (count < 7) {
            cq.select(root).where(this.getCommunityPredicate(cb, root, communityId))
            return this.entityManager.createQuery(cq).resultList;
        }
        var selfConditions = cb.and(
            this.getCommunityPredicate(cb, root, communityId),
            cb.equal(userJoin.get<String>("username"), username)
        );
        cq.select(root).where(selfConditions)
        val self = this.entityManager.createQuery(cq).singleResult;

        cb = this.entityManager.criteriaBuilder;
        val topThreeCondition = cb.and(
            this.getCommunityPredicate(cb, root, communityId),
            cb.lessThanOrEqualTo(root.get<Int>("placement"), 3)
        );

        var afterCondition = cb.equal(root.get<Int>("placement"), self.placement+1);
        var beforeCondition = cb.equal(root.get<Int>("placement"), self.placement-1);

        // Define specific rules to make sure always 7 entries are returned
        if (self.placement < 5) {
            afterCondition = cb.lessThanOrEqualTo(root.get<Int>("placement"), self.placement+5-self.placement);
        }
        if (count - self.placement < 2) {
            var sub: Int;
            if ((count-self.placement).toInt() == 1) {
                sub = 2;
            } else {
                sub = 3;
            }
            beforeCondition = cb.greaterThanOrEqualTo(root.get<Int>("placement"), self.placement-sub);
        }

        // Applying community dependency to rules
        afterCondition = cb.and(
            afterCondition,
            this.getCommunityPredicate(cb, root, communityId)
        );
        beforeCondition = cb.and(
            beforeCondition,
            this.getCommunityPredicate(cb, root, communityId)
        )

        val lastCondition = cb.and(
            cb.equal(root.get<Int>("placement"), count),
            this.getCommunityPredicate(cb, root, communityId)
        )

        val allConditions = cb.or(
            selfConditions,
            topThreeCondition,
            beforeCondition,
            afterCondition,
            lastCondition
        );
        cq.select(root).where(allConditions).orderBy(cb.asc(root.get<Int>("placement")));
        return this.entityManager.createQuery(cq).resultList;
    }

    /**
     * Query for global leaderboard
     */
    fun getLeaderboard(username: String, upperPage: Int, lowerPage: Int, communityId: Long? = null): SocketDataResponse {
        val count = this.countQuery(communityId);
        var lp = lowerPage;
        if (lowerPage == -1) {
            lp = (count / 10).toInt()-1;
        }
        val qb: CriteriaBuilder = this.entityManager.criteriaBuilder;
        val cq: CriteriaQuery<LeaderboardEntry> = qb.createQuery(LeaderboardEntry::class.java);
        val root: Root<LeaderboardEntry> = cq.from(LeaderboardEntry::class.java);
        val user: Join<LeaderboardEntry, User> = root.join<LeaderboardEntry, User>("user");
        val conditions = qb.or(
            qb.greaterThan(root.get("placement"), this.getPageLimit(lp, count, 0)),
            qb.lessThan(root.get("placement"), this.getPageLimit(upperPage, count, 1)),
            qb.equal(user.get<String>("username"), username),
            this.getPinnedUserPredicate(qb, root, communityId, username)
        );


        val allCriteria = qb.and(
            this.getCommunityPredicate(qb, root, communityId),
            conditions
        );
        cq.select(root).where(allCriteria).orderBy(qb.asc(root.get<Int>("placement")))

        return SocketDataResponse(count, this.entityManager.createQuery(cq).resultList);
    }

    /**
     * Gets the page limit from function
     *
     * @param pageNr The page Nr
     * @param count The element count
     * @param pageType The type of page (1 for upper, 0 for lower)
     */
    private fun getPageLimit(pageNr: Int, count: Long, pageType: Int): Int {
        val countDiv = (count % 10);
        if (pageNr == (count / 10).toInt()-1) {
            return (pageNr+1) *10 -1+countDiv.toInt();
        }
        if (pageNr == 1) {
            return 4;
        }
        if (pageType == 1) {
            return (pageNr-1)*10+4;
        }
        return (count-1+(pageNr+1)*10).toInt();
    }

    /**
     * Builds the community predicate for query
     *
     * @param qb The criteria builder
     * @param root The root entity
     * @param communityId The ID of the community
     */
    private fun getCommunityPredicate(qb: CriteriaBuilder, root: Root<LeaderboardEntry>, communityId: Long?): Predicate {
        if (communityId == null) {
            return qb.isNull(root.get<Community?>("community"));
        }
        val community: Join<LeaderboardEntry, Community> = root.join("community");
        return qb.equal(community.get<Long>("id"), communityId);
    }

    /**
     * Gets the predicate of pinned users
     *
     * @param cb The criteria builder
     * @param userJoin The user join
     * @param communityId The ID of the community
     * @param username The username of the current user
     */
    private fun getPinnedUserPredicate(cb: CriteriaBuilder, root: Root<LeaderboardEntry>, communityId: Long?, username: String): Predicate {

        // entry => user => pinnedIn => (pinningUser, community)

        val userJoin: Join<LeaderboardEntry, User> = root.join("user", JoinType.LEFT);
        val pinnedInJoin: Join<User, PinnedUser> = userJoin.join("pinnedIn", JoinType.LEFT);
        val pinnedBy: Join<PinnedUser, User> = pinnedInJoin.join("pinningUser", JoinType.LEFT);
        val communityJoin: Join<PinnedUser, Community> = pinnedInJoin.join("community", JoinType.LEFT);

        val pinnedByCondition = cb.equal(pinnedBy.get<String>("username"), username);
        val communityCondition = cb.equal(communityJoin.get<Long>("id"), communityId);
        return cb.and(pinnedByCondition, communityCondition);
    }

    /**
     * Counts the communities as query
     *
     * @param communityId the ID of the community;
     */
    private fun countQuery(communityId: Long?): Long {
        val cb: CriteriaBuilder = this.entityManager.criteriaBuilder;
        val cq = cb.createQuery(Long::class.java)
        val from = cq.from(LeaderboardEntry::class.java);
        val communityCriteria: Predicate = if (communityId == null) {
            cb.isNull(from.get<Community?>("community"));
        } else {
            cb.equal(from.join<LeaderboardEntry, Community>("community").get<Long>("id"), communityId);
        }
        cq.select(cb.count(from)).where(communityCriteria);

        return this.entityManager.createQuery(cq).singleResult;
    }
}