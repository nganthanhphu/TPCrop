package com.ntp.tpcrop.dto.request;

import java.time.LocalDate;

import jakarta.validation.constraints.Size;

public record TaskUpdateDto(
    @Size(min = 1)
    String description,
    LocalDate startDate,
    LocalDate endDate
) {

}
