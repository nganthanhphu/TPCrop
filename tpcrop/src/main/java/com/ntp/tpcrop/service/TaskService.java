package com.ntp.tpcrop.service;

import com.ntp.tpcrop.dto.request.task.TaskCreateDto;
import com.ntp.tpcrop.dto.response.task.TaskViewDto;

public interface TaskService {
    TaskViewDto addTask(TaskCreateDto t);
}
