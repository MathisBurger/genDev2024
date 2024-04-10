package com.c24tipping.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.ManyToMany

/**
 * User entity that is used for login
 */
@Entity(name = "c24_user")
class User : AbstractEntity() {

    /**
     * The username of the user
     * NOTE: The username is also used for login
     */
    var username: String? = null;

    /**
     * All communities a user is member in
     */
    @ManyToMany(mappedBy = "members")
    var communities: MutableList<Community> = mutableListOf();

}