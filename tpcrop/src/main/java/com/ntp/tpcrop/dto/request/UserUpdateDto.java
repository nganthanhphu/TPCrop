package com.ntp.tpcrop.dto.request;

import org.springframework.web.multipart.MultipartFile;

public record UserUpdateDto(
    String oldPassword,
    String password,
    String email,
    String fullName,
    MultipartFile avatar
) {

}
