package com.c24tipping.repository

import com.c24tipping.entity.Community
import com.c24tipping.entity.PinnedUser
import com.c24tipping.entity.User
import io.quarkus.hibernate.orm.panache.PanacheRepository
import jakarta.enterprise.context.ApplicationScoped
import jakarta.persistence.NoResultException
import java.util.Optional

/**
 * Handles pinned user transactions
 */
@ApplicationScoped
class PinnedUserRepository : PanacheRepository<PinnedUser> {

    /**
     * Finds all pinned users for specific user and community
     *
     * @param communityId The ID of the community
     * @param username The username of the user
     */
    fun findPinnedUsers(communityId: Long, username: String): List<User> {
        val cb = this.entityManager.criteriaBuilder;
        val cq = cb.createQuery(User::class.java);
        val root = cq.from(PinnedUser::class.java);
        val community = root.join<PinnedUser, Community>("community");
        val pinnedUser = root.join<PinnedUser, User>("pinnedUser");
        val pinningUser = root.join<PinnedUser, User>("pinningUser");
        val communityCondition = cb.equal(community.get<Long>("id"), communityId);
        val userCondition = cb.equal(pinningUser.get<String>("username"), username);
        val condition = cb.and(communityCondition, userCondition);
        cq.select(pinnedUser).where(condition);

        return this.entityManager.createQuery(cq).resultList;
    }

    /**
     * Finds a specific pinned user
     *
     * @param communityId The ID of the community this is assigned to
     * @param username The username of the pinning user
     * @param userToPin The username of the user that is pinned
     */
    fun findSpecificPinnedUser(communityId: Long, username: String, userToPin: String): Optional<PinnedUser> {
        try {
            val cb = this.entityManager.criteriaBuilder;
            val cq = cb.createQuery(PinnedUser::class.java);
            val root = cq.from(PinnedUser::class.java);
            val community = root.join<PinnedUser, Community>("community");
            val pinnedUser = root.join<PinnedUser, User>("pinnedUser");
            val pinningUser = root.join<PinnedUser, User>("pinningUser");
            val communityCondition = cb.equal(community.get<Long>("id"), communityId);
            val userCondition = cb.equal(pinningUser.get<String>("username"), username);
            val pinnedCondition = cb.equal(pinnedUser.get<String>("username"), userToPin);
            val condition = cb.and(communityCondition, userCondition, pinnedCondition);
            cq.select(root).where(condition);

            return Optional.of(this.entityManager.createQuery(cq).singleResult);
        } catch (e: NoResultException) {
            return Optional.empty();
        }
    }
}