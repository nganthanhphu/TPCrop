package com.ntp.tpcrop.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record SeasonCreateDto(
    @NotBlank @Size(max = 100)
    String name,
    @NotNull @Positive
    Integer startYear,
    @NotNull @Positive
    Integer endYear,
    @NotNull
    Long cropId
) {

}
