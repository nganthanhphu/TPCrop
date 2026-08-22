package com.ntp.tpcrop.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ArticleCreateDto(
        @NotBlank @Size(max = 255)
        String title,
        @NotBlank
        String content,
        @NotNull
        Long userId) {

}
