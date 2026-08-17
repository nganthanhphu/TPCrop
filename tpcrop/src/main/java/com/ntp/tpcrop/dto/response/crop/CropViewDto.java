package com.ntp.tpcrop.dto.response.crop;

public record CropViewDto(
    Long id,
    String name,
    Boolean isSupportChatbot
) {

}
