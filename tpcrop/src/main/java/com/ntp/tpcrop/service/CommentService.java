package com.ntp.tpcrop.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.ntp.tpcrop.dto.request.CommentCreateDto;
import com.ntp.tpcrop.dto.request.CommentUpdateDto;
import com.ntp.tpcrop.dto.response.CommentViewDto;

public interface CommentService {

    Page<CommentViewDto> getCommentsByArticle(Long articleId, Long parentId, Pageable pageable);

    CommentViewDto createComment(CommentCreateDto commentCreateDto);

    CommentViewDto updateComment(Long commentId, CommentUpdateDto commentUpdateDto);

    boolean deleteComment(Long commentId);
}
