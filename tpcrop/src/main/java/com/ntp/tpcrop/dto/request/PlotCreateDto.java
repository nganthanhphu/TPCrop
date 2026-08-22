package com.ntp.tpcrop.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record PlotCreateDto(
        @NotNull @Positive
        Double size,
        @NotBlank @Size(max = 255)
        String address,
        @NotNull
        Long cropId) {
}
