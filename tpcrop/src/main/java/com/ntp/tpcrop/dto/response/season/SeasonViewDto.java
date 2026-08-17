package com.ntp.tpcrop.dto.response.season;

import com.ntp.tpcrop.dto.response.crop.CropViewDto;

public record SeasonViewDto(
    Long id,
    String name,
    int startYear,
    int endYear,
    CropViewDto crop
) {

}
