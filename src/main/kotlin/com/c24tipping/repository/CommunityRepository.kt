package com.c24tipping.repository

import com.c24tipping.entity.Community
import com.c24tipping.exception.PagingException
import io.quarkus.hibernate.orm.panache.PanacheQuery
import io.quarkus.hibernate.orm.panache.PanacheRepository
import io.quarkus.panache.common.Page
import io.quarkus.panache.common.Sort
import jakarta.enterprise.context.ApplicationScoped
import java.util.Optional

/**
 * Community Repository
 */
@ApplicationScoped
class CommunityRepository : PanacheRepository<Community> {

    /**
     * Gets the element count
     */
    fun getElementCount(search: Optional<String>): Long {
        if (search.isPresent) {
            return find("name LIKE ?1", "%" + search.get() + "%").count();
        } else {
            return listAll().count().toLong();
        }
    }

    /**
     * Pages all communities by the given value
     *
     * @param pageSize The size of a page
     * @param pageNr The number of a page
     */
    fun pageCommunities(pageSize: Int, pageNr: Int, search: Optional<String>): List<Community> {
        var fd: PanacheQuery<Community>;
        if (search.isPresent) {
            fd = find("name LIKE ?1", "%" + search.get() + "%").page<Community>(Page.ofSize(pageSize));
        } else {
            fd = find("").page<Community>(Page.ofSize(pageSize));
        }
        if (fd.pageCount() < pageNr) {
            throw PagingException("Invalid pageNr");
        }
        if (search.isPresent){
            return find("name LIKE ?1", Sort.by("name", Sort.Direction.Descending), "%" + search.get() + "%").page<Community>(Page.of(pageNr, pageSize)).list();
        } else {
            return find("", Sort.by("name", Sort.Direction.Descending)).page<Community>(Page.of(pageNr, pageSize)).list();
        }
    }
}