package com.c24tipping.repository

import com.c24tipping.entity.Community
import com.c24tipping.exception.PagingException
import io.quarkus.hibernate.orm.panache.PanacheRepository
import io.quarkus.panache.common.Page
import io.quarkus.panache.common.Sort
import jakarta.enterprise.context.ApplicationScoped

/**
 * Community Repository
 */
@ApplicationScoped
class CommunityRepository : PanacheRepository<Community> {

    /**
     * Gets the element count
     */
    fun getElementCount(): Int {
        return listAll().count();
    }

    /**
     * Pages all communities by the given value
     *
     * @param pageSize The size of a page
     * @param pageNr The number of a page
     */
    fun pageCommunities(pageSize: Int, pageNr: Int): List<Community> {
        val fd = find("").page<Community>(Page.ofSize(pageSize));
        if (fd.pageCount() < pageNr) {
            throw PagingException("Invalid pageNr");
        }
        return find("", Sort.by("name", Sort.Direction.Descending)).page<Community>(Page.of(pageNr, pageSize)).list();
    }
}