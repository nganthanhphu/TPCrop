package com.ntp.tpcrop.dto.request;

import java.time.LocalDate;

public record TaskCreateDto(
    String description,
    LocalDate startDate,
    LocalDate endDate,
    Long seasonId
) {

}
