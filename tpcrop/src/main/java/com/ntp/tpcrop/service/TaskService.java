package com.ntp.tpcrop.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.ntp.tpcrop.dto.request.task.TaskCreateDto;
import com.ntp.tpcrop.dto.response.task.TaskViewDto;

public interface TaskService {
    TaskViewDto addTask(TaskCreateDto t);
    Page<TaskViewDto> getTasks(Long seasonId, Long cropId, Pageable pageable);
}
