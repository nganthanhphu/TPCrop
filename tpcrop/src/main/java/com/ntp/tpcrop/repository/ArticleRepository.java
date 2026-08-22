package com.ntp.tpcrop.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ntp.tpcrop.entity.Articles;

public interface ArticleRepository extends JpaRepository<Articles, Long> {

    @Query("""
                SELECT a FROM Articles a
                WHERE (:cropId IS NULL OR a.cropId.id = :cropId)
                AND (:userId IS NULL OR a.userId.id = :userId)
                AND (:keyword IS NULL OR LOWER(a.title) LIKE LOWER(CONCAT('%', :keyword, '%')))
            """)
    Page<Articles> getArticles(Long cropId, Long userId, String keyword, Sort sortBy, Pageable pageable);

    boolean existsByIdAndUserId_Id(Long id, Long userId);
}
