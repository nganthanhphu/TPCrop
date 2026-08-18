package com.ntp.tpcrop.dto.response;

import java.time.LocalDate;

public record TaskDetailViewDto(
        Long id,
        String description,
        LocalDate startDate,
        LocalDate endDate,
        SeasonViewDto season,
        Boolean isCompleted) {

}
