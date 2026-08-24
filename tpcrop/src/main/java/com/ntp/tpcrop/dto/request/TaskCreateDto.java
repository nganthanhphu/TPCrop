package com.ntp.tpcrop.dto.request;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record TaskCreateDto(
    @NotBlank
    String description,
    @NotNull
    LocalDate startDate,
    @NotNull
    LocalDate endDate,
    @NotNull
    Long seasonId
) {

}
