package com.ntp.tpcrop.dto.response;

import java.time.LocalDateTime;

public record ArticleViewDto(
    Long id,
    String title,
    Integer likeCount,
    Integer commentCount,
    LocalDateTime createdAt,
    UserViewDto user
) {

}
