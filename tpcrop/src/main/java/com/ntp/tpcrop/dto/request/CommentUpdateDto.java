package com.ntp.tpcrop.dto.request;

import jakarta.validation.constraints.Size;

public record CommentUpdateDto(
    @Size(min = 1)
    String content
) {

}
