package com.ntp.tpcrop.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import org.springframework.web.multipart.MultipartFile;

public record UserUpdateDto(
    @Size(min = 8)
    String oldPassword,
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$")
    String password,
    @Email @Size(max = 100)
    String email,
    @Size(min = 1, max = 100)
    String fullName,
    MultipartFile avatar
) {

}
