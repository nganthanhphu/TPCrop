package com.ntp.tpcrop.dto.response;

import java.time.LocalDate;

/**
 * UserViewDto
 */
public record UserViewDto(
    Long id,
    String username,
    String email,
    String fullName,
    String avatar,
    String role,
    Boolean active,
    LocalDate joinedDate
) {

}
