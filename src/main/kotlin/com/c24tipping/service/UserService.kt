package com.c24tipping.service

import com.c24tipping.entity.LeaderboardEntry
import com.c24tipping.entity.User
import com.c24tipping.exception.UserExistsException
import com.c24tipping.repository.UserRepository
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.transaction.Transactional
import java.util.*

/**
 * User service that handles user interactions
 */
@ApplicationScoped
class UserService : AbstractService() {

    @Inject
    lateinit var userRepository: UserRepository;

    /**
     * Registers a new user
     */
    @Transactional
    fun registerUser(username: String): User {
        val userExists = this.userRepository.findByUsername(username).isPresent;
        if (userExists) {
            throw UserExistsException("Der Nutzername ist bereits vergeben")
        }
        val newUser = User()
        newUser.username = username;
        newUser.createdAt = Date();
        this.entityManager.persist(newUser);
        val lbe = LeaderboardEntry()
        lbe.user = newUser;
        lbe.placement = (this.userRepository.count()).toInt();
        this.entityManager.persist(lbe);
        this.entityManager.persist(newUser);
        this.entityManager.flush();
        return newUser;
    }

    /**
     * Checks if the user can login
     *
     * @param username The username of the user
     */
    fun loginUser(username: String): Boolean {
        return this.userRepository.findByUsername(username).isPresent;
    }
}