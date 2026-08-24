package com.ntp.tpcrop.dto.response;

import java.util.Set;

public record PlotViewDto(
    Long id,
    double size,
    String address,
    Set<CropViewDto> crops,
    UserViewDto user
) {

}
