package com.ntp.tpcrop.dto.request;

import jakarta.validation.constraints.Size;

public record ArticleUpdateDto(
        @Size(min = 1, max = 255)
        String title,
        @Size(min = 1)
        String content) {

}
