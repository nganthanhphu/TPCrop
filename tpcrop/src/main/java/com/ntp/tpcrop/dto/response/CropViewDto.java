package com.ntp.tpcrop.dto.response;

public record CropViewDto(
    Long id,
    String name,
    Boolean isSupportChatbot
) {

}
