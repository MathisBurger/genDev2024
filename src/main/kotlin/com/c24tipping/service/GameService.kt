package com.c24tipping.service

import com.c24tipping.data.response.MinifiedGame
import com.c24tipping.repository.GameRepository
import com.c24tipping.utils.GameUtil
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject

@ApplicationScoped
class GameService : AbstractService() {

    @Inject
    lateinit var gameRepository: GameRepository;

    /**
     * Gets all games
     */
    fun getAllGames(): List<MinifiedGame> {
        return this.gameRepository.listAllGames().map { GameUtil.convertToMinified(it) };
    }


}