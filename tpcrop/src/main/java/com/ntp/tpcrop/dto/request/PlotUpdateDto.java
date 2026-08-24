package com.ntp.tpcrop.dto.request;

import java.util.Set;

import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record PlotUpdateDto(
        @Positive
        Double size,
        @Size(min = 1, max = 255)
        String address,
        @Size(min = 1)
        Set<Long> cropIds
) {

}
