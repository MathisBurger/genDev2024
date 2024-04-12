package com.c24tipping.startup

import com.c24tipping.entity.Bet
import com.c24tipping.entity.LeaderboardEntry
import com.c24tipping.entity.User
import com.c24tipping.repository.GameRepository
import com.c24tipping.repository.UserRepository
import io.quarkus.runtime.Startup
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.persistence.EntityManager
import jakarta.transaction.Transactional
import org.eclipse.microprofile.config.inject.ConfigProperty
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

    @Startup
    @Transactional
    fun loadFixtures() {
        val games = this.gameRepository.listAllGames();
        if (this.loadFixtures.equals("true") && games.isNotEmpty()) {
            for (i in 1..300) {
                val user = this.userRepository.findByUsername("user-$i");
                if (user.isEmpty) {

                    val usr = User()
                    usr.username = "user-$i";
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
                }
            }
        }

    }
}