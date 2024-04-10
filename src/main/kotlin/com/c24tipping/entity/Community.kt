package com.c24tipping.entity

import jakarta.persistence.Entity
import jakarta.persistence.JoinColumn
import jakarta.persistence.JoinTable
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
    @ManyToMany
    @JoinTable(name = "community_user",
        joinColumns = [JoinColumn(name = "community_id", referencedColumnName = "id")],
        inverseJoinColumns = [JoinColumn(name = "user_id", referencedColumnName = "id")])
    var members: MutableList<User> = mutableListOf();
}