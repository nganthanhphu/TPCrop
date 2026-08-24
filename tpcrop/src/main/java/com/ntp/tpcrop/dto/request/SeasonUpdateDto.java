package com.ntp.tpcrop.dto.request;

import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record SeasonUpdateDto(
        @Size(min = 1, max = 100)
        String name,
        @Positive
        Integer startYear,
        @Positive
        Integer endYear
) {

}
