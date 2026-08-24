package com.ntp.tpcrop.security;

import org.springframework.stereotype.Component;

import com.ntp.tpcrop.repository.CommentRepository;
import com.ntp.tpcrop.util.UserUtil;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class CommentSecurity {

    private final CommentRepository commentRepository;
    private final UserUtil userUtil;

    public boolean isCommentOwner(Long commentId) {
        Long currentUserId = userUtil.getCurrentUser().getId();
        return commentRepository.existsByIdAndUserId_Id(commentId, currentUserId);
    }

}
