package com.ntp.tpcrop.dto.response;

public record SeasonProgressViewDto(
    Long seasonId,
    String season,
    String crop,
    int startYear,
    int endYear,
    Double progress

) {

}
