package com.c24tipping.repository

import com.c24tipping.entity.LeaderboardEntry
import io.quarkus.hibernate.orm.panache.PanacheRepository
import io.quarkus.panache.common.Sort
import jakarta.enterprise.context.ApplicationScoped

@ApplicationScoped
class LeaderboardRepository : PanacheRepository<LeaderboardEntry> {

    fun listSorted(): MutableList<LeaderboardEntry> {
        return find("", Sort.by("placement", Sort.Direction.Ascending)).list();
    }
}