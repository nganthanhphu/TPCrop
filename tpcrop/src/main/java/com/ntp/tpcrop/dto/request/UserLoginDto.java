package com.ntp.tpcrop.dto.request;

import jakarta.validation.constraints.NotBlank;

public record UserLoginDto(
    @NotBlank
    String username,
    @NotBlank
    String password
) {

}

