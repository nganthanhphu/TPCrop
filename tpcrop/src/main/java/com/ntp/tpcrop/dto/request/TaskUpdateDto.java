package com.ntp.tpcrop.dto.request;

import java.time.LocalDate;

public record TaskUpdateDto(
    String description,
    LocalDate startDate,
    LocalDate endDate
) {

}
