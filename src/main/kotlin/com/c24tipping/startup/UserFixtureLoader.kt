package com.c24tipping.startup

import com.c24tipping.data.request.JoinCommunityRequest
import com.c24tipping.entity.Bet
import com.c24tipping.entity.Community
import com.c24tipping.entity.LeaderboardEntry
import com.c24tipping.entity.User
import com.c24tipping.repository.CommunityRepository
import com.c24tipping.repository.GameRepository
import com.c24tipping.repository.UserRepository
import com.c24tipping.service.CommunityService
import io.quarkus.runtime.Startup
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.persistence.EntityManager
import jakarta.transaction.Transactional
import org.eclipse.microprofile.config.inject.ConfigProperty
import java.util.*
import kotlin.random.Random

@ApplicationScoped
class UserFixtureLoader {

    @ConfigProperty(name = "c24tipping.loadFixtures")
    lateinit var loadFixtures: String;

    @Inject
    lateinit var userRepository: UserRepository;

    @Inject
    lateinit var entityManager: EntityManager;

    @Inject
    lateinit var gameRepository: GameRepository;

    @Inject
    lateinit var communityRepository: CommunityRepository;

    @Inject
    lateinit var communityService: CommunityService;

    @Startup
    @Transactional
    fun loadFixtures() {
        val games = this.gameRepository.listAllGames();
        if (this.loadFixtures.equals("true") && games.isNotEmpty()) {
            if (this.communityRepository.find("name", "oddComm").firstResultOptional<Community>().isEmpty) {
                val oddComm = Community();
                oddComm.name = "oddComm";
                val evenComm = Community();
                evenComm.name = "evenComm";
                this.entityManager.persist(oddComm);
                this.entityManager.persist(evenComm);
                this.entityManager.flush();
            }
            val oddComm = this.communityRepository.find("name", "oddComm").firstResult<Community>();
            val evenComm = this.communityRepository.find("name", "evenComm").firstResult<Community>();
            for (i in 1..180) {
                val user = this.userRepository.findByUsername("user-$i");
                if (user.isEmpty) {

                    val usr = User()
                    usr.username = "user-$i";
                    usr.createdAt = Date()
                    this.entityManager.persist(usr);
                    this.entityManager.flush();

                    val placement = LeaderboardEntry()
                    placement.user = usr;
                    placement.placement = this.userRepository.count().toInt();
                    this.entityManager.persist(placement);
                    usr.leaderboardPlacements.add(placement);
                    this.entityManager.persist(usr);
                    this.entityManager.flush();

                    val bet = Bet()
                    bet.user = usr;
                    bet.game = games.get(0);
                    bet.goalsHome = Random.nextInt(0,5)
                    bet.goalsAway = Random.nextInt(0,5)
                    this.entityManager.persist(bet);
                    games.get(0).bets.add(bet);
                    usr.bets.add(bet);
                    this.entityManager.persist(usr);
                    this.entityManager.persist(games.get(0));
                    this.entityManager.flush();
                    println(i);
                    if (i % 2 == 0) {
                        this.communityService.joinCommunity(JoinCommunityRequest(usr.username!!, evenComm.id!!));
                    } else {
                        this.communityService.joinCommunity(JoinCommunityRequest(usr.username!!, oddComm.id!!));
                    }

                }
            }
        }

    }
}