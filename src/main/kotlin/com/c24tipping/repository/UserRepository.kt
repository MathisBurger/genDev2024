package com.c24tipping.repository

import com.c24tipping.entity.User
import io.quarkus.hibernate.orm.panache.PanacheRepository
import jakarta.enterprise.context.ApplicationScoped
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
}