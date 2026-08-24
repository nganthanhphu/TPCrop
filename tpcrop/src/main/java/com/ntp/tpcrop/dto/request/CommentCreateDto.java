package com.ntp.tpcrop.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CommentCreateDto(
    @NotBlank
    String content,
    @NotNull
    Long articleId,
    Long parentId
) {

}
