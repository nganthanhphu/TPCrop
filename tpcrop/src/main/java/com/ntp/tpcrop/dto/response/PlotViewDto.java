package com.ntp.tpcrop.dto.response;

public record PlotViewDto(
    Long id,
    double size,
    String address,
    CropViewDto crop,
    UserViewDto user
) {

}
