package com.ntp.tpcrop.dto.request;

import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record PlotUpdateDto(
        @Positive
        Double size,
        @Size(min = 1, max = 255)
        String address,
        Long cropId
) {

}
