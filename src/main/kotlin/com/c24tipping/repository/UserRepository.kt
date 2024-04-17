package com.c24tipping.repository

import com.c24tipping.entity.LeaderboardEntry
import com.c24tipping.entity.User
import io.quarkus.hibernate.orm.panache.PanacheRepository
import jakarta.enterprise.context.ApplicationScoped
import jakarta.persistence.criteria.CriteriaBuilder
import jakarta.persistence.criteria.CriteriaQuery
import jakarta.persistence.criteria.Order
import jakarta.persistence.criteria.Root
import java.util.Optional
import javax.swing.text.html.Option

/**
 * Repository for user transactions
 */
@ApplicationScoped
class UserRepository : PanacheRepository<User> {

    /**
     * Finds a user by username
     *
     * @param username The username
     */
    fun findByUsername(username: String): Optional<User> {
        return this.find("username", username).firstResultOptional();
    }

    /**
     * Finds all users with IDs
     *
     * @param ids The IDs of the users
     */
    fun findByUserIds(ids: List<Long>): List<User> {
        val cb: CriteriaBuilder = this.entityManager.criteriaBuilder;
        val cq: CriteriaQuery<User> = cb.createQuery(User::class.java);
        val root: Root<User> = cq.from(User::class.java);
        val id = root.get<Long>("id");
        val idCriteria = id.`in`(ids);
        val preliminaryPoints = root.get<Int>("preliminaryPoints");
        cq.select(root).where(idCriteria).orderBy(cb.asc(preliminaryPoints));
        return this.entityManager.createQuery(cq).resultList;
    }
}