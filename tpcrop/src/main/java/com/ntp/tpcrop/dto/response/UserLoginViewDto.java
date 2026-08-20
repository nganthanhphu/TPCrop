package com.ntp.tpcrop.dto.response;

public record UserLoginViewDto(
    UserViewDto user,
    String token
) {
    
}
