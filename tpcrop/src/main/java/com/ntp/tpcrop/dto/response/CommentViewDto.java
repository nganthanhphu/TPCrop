package com.ntp.tpcrop.dto.response;

import java.time.LocalDateTime;

public record CommentViewDto(
    Long id,
    String content,
    LocalDateTime createdAt,
    LocalDateTime updatedAt,
    Long articleId,
    Long parentId,
    UserViewDto user
) {

}
