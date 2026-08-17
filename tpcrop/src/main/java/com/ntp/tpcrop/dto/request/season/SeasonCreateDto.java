package com.ntp.tpcrop.dto.request.season;

public record SeasonCreateDto(
    String name,
    int startYear,
    int endYear,
    Long cropId
) {

}
