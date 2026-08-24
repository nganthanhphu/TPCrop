package com.ntp.tpcrop.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.ntp.tpcrop.entity.Comments;
import org.springframework.data.jpa.repository.Query;

public interface CommentRepository extends JpaRepository<Comments, Long> {
    @Query("""
            SELECT c FROM Comments c
            WHERE c.articleId.id = :articleId 
            AND ((:parentId IS NULL AND c.parentId.id IS NULL) OR (c.parentId.id = :parentId))
    """)
    Page<Comments> getCommentsByArticle(Long articleId, Long parentId, Pageable pageable);

    boolean existsByIdAndUserId_Id(Long commentId, Long userId);

}
    