package com.ntp.tpcrop.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import org.springframework.web.multipart.MultipartFile;

public record UserRegisterDto(
    @NotBlank @Size(max = 50)
    String username,
    @NotBlank @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$")
    String password,
    @NotBlank @Email @Size(max = 100)
    String email,
    @NotBlank @Size(max = 100)
    String fullName,
    @NotNull
    MultipartFile avatar,
    @NotBlank
    String role
) {
}
