package com.ntp.tpcrop.dto.request;

import jakarta.validation.constraints.Size;

public record CropUpdateDto(
    @Size(min = 1, max = 100)
    String name,
    Boolean isSupportChatbot
) {

}
