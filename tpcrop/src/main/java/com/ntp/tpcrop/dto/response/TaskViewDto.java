package com.ntp.tpcrop.dto.response;

import java.time.LocalDate;

public record TaskViewDto(
    Long id,
    String description,
    LocalDate startDate,
    LocalDate endDate,
    SeasonViewDto season
) {

}
