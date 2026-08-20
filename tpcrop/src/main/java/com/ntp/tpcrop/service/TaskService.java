package com.ntp.tpcrop.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.ntp.tpcrop.dto.request.TaskCompletionCreateDto;
import com.ntp.tpcrop.dto.request.TaskCreateDto;
import com.ntp.tpcrop.dto.request.TaskUpdateDto;
import com.ntp.tpcrop.dto.response.TaskViewDto;
import com.ntp.tpcrop.dto.response.TaskCompletionViewDto;
import com.ntp.tpcrop.dto.response.TaskDetailViewDto;

public interface TaskService {
    TaskViewDto addTask(TaskCreateDto t);
    Page<TaskViewDto> getTasksByManager(Long seasonId, Long cropId, Pageable pageable);
    Page<TaskDetailViewDto> getDetailedTasks(Long plotId, Boolean isCompleted, Pageable pageable);
    TaskCompletionViewDto addTaskCompletion(TaskCompletionCreateDto t);
    TaskViewDto updateTask(Long id, TaskUpdateDto taskUpdateDto);
    boolean deleteTask(Long id);
}
