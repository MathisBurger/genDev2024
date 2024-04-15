package com.c24tipping.service

import com.c24tipping.data.response.CommunityMember
import com.c24tipping.entity.PinnedUser
import com.c24tipping.exception.UnknownCommunityException
import com.c24tipping.exception.UnknownUserException
import com.c24tipping.repository.CommunityRepository
import com.c24tipping.repository.PinnedUserRepository
import com.c24tipping.repository.UserRepository
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject

/**
 * Handles pinned user actions
 */
@ApplicationScoped
class PinnedUserService : AbstractService() {

    @Inject
    lateinit var pinnedUserRepository: PinnedUserRepository;

    @Inject
    lateinit var communityRepository: CommunityRepository;

    @Inject
    lateinit var userRepository: UserRepository;

    /**
     * Gets the pinned users of a user and community
     *
     * @param communityId The ID of the community
     * @param username The username of the user
     */
    fun getPinnedUsers(communityId: Long, username: String): List<CommunityMember> {
        return this.pinnedUserRepository.findPinnedUsers(communityId, username)
            .map { CommunityMember(it.id!!, it.username!!) };
    }

    /**
     * Pins a specific user
     *
     * @param communityId The ID of the community
     * @param username The username of the user
     * @param userToPin The username of the user that is pinned
     */
    fun pinUser(communityId: Long, username: String, userToPin: String): List<CommunityMember> {
        val community = this.communityRepository.findByIdOptional(communityId);
        if (community.isEmpty) {
            throw UnknownCommunityException("Community existiert nicht");
        }
        val pinningUser = this.userRepository.findByUsername(username);
        if (pinningUser.isEmpty) {
            throw UnknownUserException("Dieser Nutzer existiert nicht");
        }
        val userToPinInstance = this.userRepository.findByUsername(userToPin);
        if (userToPinInstance.isEmpty) {
            throw UnknownUserException("Dieser Nutzer existiert nicht");
        }
        val pinnedUser = PinnedUser();
        pinnedUser.community = community.get();
        pinnedUser.pinnedUser = userToPinInstance.get();
        pinnedUser.pinningUser = pinningUser.get();
        this.entityManager.persist(pinningUser);
        this.entityManager.flush();
        community.get().pinnedUsers.add(pinnedUser);
        this.entityManager.persist(community.get());
        userToPinInstance.get().pinnedIn.add(pinnedUser);
        this.entityManager.persist(userToPinInstance.get());
        pinningUser.get().pinnedUsers.add(pinnedUser);
        this.entityManager.persist(pinningUser.get());
        this.entityManager.flush();
        return this.getPinnedUsers(communityId, username);
    }

    /**
     * Unpins a specific user
     *
     * @param communityId The ID of the community
     * @param username The username of the user
     * @param userToPin The username of the user that is pinned
     */
    fun unpinUser(communityId: Long, username: String, userToPin: String): List<CommunityMember> {
        val instance = this.pinnedUserRepository.findSpecificPinnedUser(communityId, username, userToPin);
        if (instance.isEmpty) {
            throw UnknownUserException("Angepinnter Nutzer existert nicht");
        }
        val pinnedUser = instance.get();
        pinnedUser.community!!.pinnedUsers.remove(pinnedUser);
        this.entityManager.persist(pinnedUser.community);
        pinnedUser.pinningUser!!.pinnedUsers.remove(pinnedUser);
        this.entityManager.persist(pinnedUser.pinningUser);
        pinnedUser.pinnedUser!!.pinnedIn.remove(pinnedUser);
        this.entityManager.persist(pinnedUser.pinnedUser);
        this.entityManager.remove(pinnedUser);
        this.entityManager.flush();
        return this.getPinnedUsers(communityId, username);
    }
}