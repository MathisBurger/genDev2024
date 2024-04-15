package com.c24tipping.service

import com.c24tipping.data.request.CreateCommunityRequest
import com.c24tipping.data.request.JoinCommunityRequest
import com.c24tipping.data.response.CommunityMember
import com.c24tipping.data.response.CommunityResponse
import com.c24tipping.data.response.ExtendedCommunityResponse
import com.c24tipping.entity.Community
import com.c24tipping.entity.LeaderboardEntry
import com.c24tipping.exception.TooManyCommunitiesException
import com.c24tipping.exception.UnknownCommunityException
import com.c24tipping.exception.UnknownUserException
import com.c24tipping.repository.CommunityRepository
import com.c24tipping.repository.UserRepository
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.transaction.Transactional
import java.util.Optional

/**
 * The service that handles all community actions.
 */
@ApplicationScoped
class CommunityService : AbstractService() {

    @Inject
    lateinit var communityRepository: CommunityRepository;

    @Inject
    lateinit var userRepository: UserRepository;

    @Inject
    lateinit var leaderboardService: LeaderboardService;

    /**
     * Gets all communities
     *
     * @param pageSize The size of a page
     * @param pageNr The number of the page
     */
    fun getAllCommunities(pageSize: Int, pageNr: Int, search: Optional<String>): List<CommunityResponse> {
        return this.communityRepository.pageCommunities(pageSize, pageNr, search).map { this.convertToList(it) };
    }

    /**
     * Gets the count of rows
     */
    fun getCommunityRowCount(search: Optional<String>): Long {
        return this.communityRepository.getElementCount(search);
    }

    /**
     * Creates a new community
     *
     * @param data The data on which the community is created
     */
    @Transactional
    fun createNewCommunity(data: CreateCommunityRequest): ExtendedCommunityResponse {
        val user = this.userRepository.findByUsername(data.username);
        if (user.isEmpty) {
            throw UnknownUserException("Der Nutzer existiert nicht");
        }
        if (user.get().communities.size >= 5) {
            throw TooManyCommunitiesException("Die maximale Anzahl an Communities ist 5.");
        }
        val community = Community()
        community.name = data.communityName;
        community.members.add(user.get());
        this.entityManager.persist(community);
        user.get().communities.add(community);
        this.entityManager.persist(user.get());
        this.entityManager.flush();

        val firstLBE = LeaderboardEntry()
        firstLBE.placement = 1;
        firstLBE.community = community;
        firstLBE.user = user.get();
        this.entityManager.persist(firstLBE);
        user.get().leaderboardPlacements.add(firstLBE);
        this.entityManager.persist(user.get());
        community.leaderboard.add(firstLBE);
        this.entityManager.persist(community);
        this.entityManager.flush();
        return this.convertToExtended(community);
    }

    /**
     * Joins a user into a community
     *
     * @param data The data to join.
     */
    @Transactional
    fun joinCommunity(data: JoinCommunityRequest): ExtendedCommunityResponse {
        val user = this.userRepository.findByUsername(data.username);
        if (user.isEmpty) {
            throw UnknownUserException("Der Nutzer existiert nicht");
        }
        if (user.get().communities.size >= 5) {
            throw TooManyCommunitiesException("Die maximale Anzahl an Communities ist 5.");
        }
        val community = this.communityRepository.findByIdOptional(data.communityId);
        if (community.isEmpty) {
            throw UnknownCommunityException("Die Community existiert nicht");
        }
        community.get().members.add(user.get());
        user.get().communities.add(community.get());
        this.entityManager.persist(community.get());
        this.entityManager.persist(user.get());
        this.entityManager.flush();
        val lbe = LeaderboardEntry()
        lbe.community = community.get();
        lbe.placement = community.get().members.size;
        lbe.user = user.get();
        this.entityManager.persist(lbe);
        community.get().leaderboard.add(lbe);
        user.get().leaderboardPlacements.add(lbe);
        this.entityManager.persist(user.get());
        this.entityManager.persist(community.get());
        this.entityManager.flush();
        this.leaderboardService.updateCommunityLeaderboard(community.get());
        return this.convertToExtended(community.get());
    }

    /**
     * Gets a community by ID
     *
     * @param id The ID
     */
    fun getCommunity(id: Long): ExtendedCommunityResponse {
        val community = this.communityRepository.findByIdOptional(id);
        if (community.isEmpty) {
            throw UnknownCommunityException("Diese Community existiert nicht");
        }
        return this.convertToExtended(community.get());
    }

    /**
     * Gets personal communities by username
     *
     * @param username The username of the user
     */
    fun getPersonalCommunities(username: String): List<CommunityResponse> {
        return this.communityRepository.findPersonalCommunities(username).map { this.convertToList(it) }
    }

    /**
     * Converts to extended community response
     *
     * @param community The community
     */
    private fun convertToExtended(community: Community): ExtendedCommunityResponse {
        return ExtendedCommunityResponse(
            community.id!!,
            community.name!!,
            community.members.map { CommunityMember(it.id!!, it.username!!) }
        )
    }

    /**
     * Converts to community response
     *
     * @param community The community
     */
    private fun convertToList(community: Community): CommunityResponse {
        return CommunityResponse(
            community.id!!,
            community.name!!,
            community.members.size
        );
    }
}