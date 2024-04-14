package com.c24tipping.websocket.data

import com.c24tipping.entity.AbstractEntity
import com.c24tipping.entity.LeaderboardEntry

/**
 * Response that is sent as socket data
 */
class SocketDataResponse(public var count: Long, public var data: List<LeaderboardEntry>) {

    override fun toString(): String {
        return AbstractEntity.buildJSON(this);
    }
}