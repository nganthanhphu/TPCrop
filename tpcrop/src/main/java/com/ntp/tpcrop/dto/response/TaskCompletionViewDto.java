package com.ntp.tpcrop.dto.response;

import java.time.LocalDateTime;

public record TaskCompletionViewDto(
    long id,
    TaskViewDto task,
    PlotViewDto plot,
    LocalDateTime timeCompleted
) {

}
