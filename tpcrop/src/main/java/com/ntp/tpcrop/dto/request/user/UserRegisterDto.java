package com.ntp.tpcrop.dto.request.user;

import org.springframework.web.multipart.MultipartFile;

public record UserRegisterDto(
    String username,
    String password,
    String email,
    String fullName,
    MultipartFile avatar,
    String role
) {
}
