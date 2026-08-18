package com.ntp.tpcrop.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.ntp.tpcrop.dto.request.TaskCreateDto;
import com.ntp.tpcrop.dto.response.TaskViewDto;

public interface TaskService {
    TaskViewDto addTask(TaskCreateDto t);
    Page<TaskViewDto> getTasks(Long seasonId, Long cropId, Pageable pageable);
}
