package com.ntp.tpcrop.dto.response;

public record SeasonViewDto(
    Long id,
    String name,
    int startYear,
    int endYear,
    CropViewDto crop
) {

}
