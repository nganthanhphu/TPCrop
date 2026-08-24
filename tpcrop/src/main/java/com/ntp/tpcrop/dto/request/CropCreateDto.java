package com.ntp.tpcrop.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CropCreateDto(
    @NotBlank @Size(max = 100)
    String name
) {

}
