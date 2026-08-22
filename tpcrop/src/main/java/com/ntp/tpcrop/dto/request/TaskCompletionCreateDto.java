package com.ntp.tpcrop.dto.request;

import jakarta.validation.constraints.NotNull;

public record TaskCompletionCreateDto(
    @NotNull
    Long plotId,
    @NotNull
    Long taskId
) {

}
