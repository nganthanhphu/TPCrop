package com.ntp.tpcrop.dto.response;

import java.time.LocalDateTime;

public record ArticleDetailViewDto(
        Long id,
        String title,
        String content,
        Integer likeCount,
        Integer commentCount,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        UserViewDto user) {

}
