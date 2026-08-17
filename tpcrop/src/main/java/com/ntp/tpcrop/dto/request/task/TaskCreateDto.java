package com.ntp.tpcrop.dto.request.task;

import java.time.LocalDate;

public record TaskCreateDto(
    String description,
    LocalDate startDate,
    LocalDate endDate,
    Long seasonId
) {

}
