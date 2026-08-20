package com.ntp.tpcrop.dto.request;

public record PlotUpdateDto(
        Double size,
        String address,
        Long cropId
) {

}
