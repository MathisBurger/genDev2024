package com.c24tipping.entity

import jakarta.persistence.GeneratedValue
import jakarta.persistence.Id
import jakarta.persistence.MappedSuperclass

/**
 * Abstract entity that provides general information to all
 */
@MappedSuperclass
abstract class AbstractEntity {

    /**
     * ID of the entity
     */
    @Id
    @GeneratedValue
    open var id: Long? = null;
}