package com.ntp.tpcrop.service.impl;

import java.time.LocalDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import com.ntp.tpcrop.dto.request.CommentCreateDto;
import com.ntp.tpcrop.dto.request.CommentUpdateDto;
import com.ntp.tpcrop.dto.response.CommentViewDto;
import com.ntp.tpcrop.entity.Comments;
import com.ntp.tpcrop.repository.ArticleRepository;
import com.ntp.tpcrop.repository.CommentRepository;
import com.ntp.tpcrop.repository.UserRepository;
import com.ntp.tpcrop.service.CommentService;
import com.ntp.tpcrop.service.mapper.CommentMapper;
import com.ntp.tpcrop.util.UserUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final ArticleRepository articleRepository;
    private final UserRepository userRepository;
    private final CommentMapper commentMapper;
    private final UserUtil userUtil;

    @Override
    public Page<CommentViewDto> getCommentsByArticle(Long articleId, Long parentId, Pageable pageable) {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
        if (parentId != null)
            sort = Sort.by(Sort.Direction.ASC, "createdAt");

        Pageable sortedPageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort);

        return commentRepository.getCommentsByArticle(articleId, parentId, sortedPageable)
                .map(commentMapper::toViewDto);
    }

    @Override
    public CommentViewDto createComment(CommentCreateDto commentCreateDto) {
        Comments comment = new Comments();
        comment.setContent(commentCreateDto.content());
        comment.setArticleId(articleRepository.getReferenceById(commentCreateDto.articleId()));
        comment.setParentId(commentRepository.findById(commentCreateDto.parentId()).orElse(null));
        comment.setCreatedAt(LocalDateTime.now());
        comment.setUserId(userRepository.getReferenceById(userUtil.getCurrentUser().getId()));

        return commentMapper.toViewDto(commentRepository.save(comment));
    }

    @Override
    @PreAuthorize("@commentSecurity.isCommentOwner(#commentId)")
    public CommentViewDto updateComment(Long commentId, CommentUpdateDto commentUpdateDto) {
        Comments comment = commentRepository.findById(commentId).get();
        commentMapper.updateEntityFromDto(commentUpdateDto, comment);

        return commentMapper.toViewDto(commentRepository.save(comment));
    }

    @Override
    @PreAuthorize("@commentSecurity.isCommentOwner(#commentId)")
    public boolean deleteComment(Long commentId) {
        if (commentRepository.existsById(commentId)) {
            commentRepository.deleteById(commentId);
            return true;
        } else {
            return false;
        }
    }

}
