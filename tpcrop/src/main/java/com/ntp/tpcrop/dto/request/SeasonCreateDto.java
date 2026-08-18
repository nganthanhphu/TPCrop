package com.ntp.tpcrop.dto.request;

public record SeasonCreateDto(
    String name,
    int startYear,
    int endYear,
    Long cropId
) {

}
