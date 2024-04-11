package com.c24tipping.utils

import com.c24tipping.data.response.PersonalBetResponse
import com.c24tipping.entity.Bet

/**
 * Utils for bets
 */
class BetUtil {

    companion object {

        /**
         * Converts a bet into a personal bet
         */
        fun convertToPersonalBetResponse(bet: Bet): PersonalBetResponse {
            return PersonalBetResponse(
                bet.id!!,
                bet.goalsHome!!,
                bet.goalsAway!!,
                bet.betPoints,
                GameUtil.convertToMinified(bet.game!!)
            );
        }
    }
}