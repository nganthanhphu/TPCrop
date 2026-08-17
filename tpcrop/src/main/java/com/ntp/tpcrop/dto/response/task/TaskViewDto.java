package com.ntp.tpcrop.dto.response.task;

import java.time.LocalDate;

import com.ntp.tpcrop.dto.response.season.SeasonViewDto;

public record TaskViewDto(
    Long id,
    String description,
    LocalDate startDate,
    LocalDate endDate,
    SeasonViewDto season
) {

}
