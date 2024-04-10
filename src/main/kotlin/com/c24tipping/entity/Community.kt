package com.c24tipping.entity

import jakarta.persistence.Entity
import jakarta.persistence.ManyToMany

/**
 * The entity that represents an community
 */
@Entity
class Community : AbstractEntity() {

    /**
     * The name of a community
     */
    var name: String? = null;

    /**
     * All members of a community
     */
    @ManyToMany(mappedBy = "communities")
    var members: MutableList<User> = mutableListOf();
}