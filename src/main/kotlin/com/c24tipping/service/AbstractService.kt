package com.c24tipping.service

import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.persistence.EntityManager

/**
 * The abstract service
 */
@ApplicationScoped
abstract class AbstractService {

    /**
     * The entity manager
     */
    @Inject
    lateinit var entityManager: EntityManager;
}