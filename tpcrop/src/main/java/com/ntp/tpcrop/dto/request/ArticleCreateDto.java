package com.ntp.tpcrop.dto.request;

public record ArticleCreateDto(
        String title,
        String content,
        Long userId) {

}
