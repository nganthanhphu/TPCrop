package com.ntp.tpcrop.dto.request;

public record SeasonUpdateDto(
        String name,
        int startYear,
        int endYear
) {

}
