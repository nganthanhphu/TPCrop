package com.ntp.tpcrop.dto.request;

public record PlotCreateDto(
        double size,
        String address,
        Long cropId) {
}
