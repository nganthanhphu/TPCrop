package com.ntp.tpcrop.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import jakarta.validation.Valid;
import com.ntp.tpcrop.dto.request.TaskCompletionCreateDto;
import com.ntp.tpcrop.dto.request.TaskCreateDto;
import com.ntp.tpcrop.dto.request.TaskUpdateDto;
import com.ntp.tpcrop.dto.response.TaskViewDto;
import com.ntp.tpcrop.dto.response.TaskCompletionViewDto;
import com.ntp.tpcrop.dto.response.TaskDetailViewDto;
import com.ntp.tpcrop.service.TaskService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequiredArgsConstructor
@RequestMapping("/api")
public class TaskController {

    private final TaskService taskService;

    @PostMapping("/secure/manager/tasks")
    public ResponseEntity<TaskViewDto> addTask(@RequestBody @Valid TaskCreateDto t) {
        TaskViewDto createdTask = taskService.addTask(t);

        return ResponseEntity.status(201).body(createdTask);
    }

    @GetMapping("/secure/manager/tasks")
    public ResponseEntity<Page<TaskViewDto>> getTasks(@RequestParam(required = false) Long seasonId,
            @RequestParam(required = true) Long cropId, Pageable pageable) {
        Page<TaskViewDto> tasks = taskService.getTasksByManager(seasonId, cropId, pageable);
        return ResponseEntity.ok(tasks);
    }

    @PatchMapping("/secure/manager/tasks/{id}")
    public ResponseEntity<TaskViewDto> updateTask(@PathVariable Long id,
            @RequestBody @Valid TaskUpdateDto taskUpdateDto) {
        TaskViewDto updatedTask = taskService.updateTask(id, taskUpdateDto);
        return ResponseEntity.ok(updatedTask);
    }

    @DeleteMapping("/secure/manager/tasks/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Long id) {
        boolean deleted = taskService.deleteTask(id);
        if (deleted) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/secure/tasks")
    public ResponseEntity<Page<TaskDetailViewDto>> getDetailedTasks(@RequestParam(required = true) Long plotId,
            @RequestParam(required = false) Long cropId, @RequestParam(required = false) Boolean isCompleted,
            Pageable pageable) {
        Page<TaskDetailViewDto> tasks = taskService.getDetailedTasks(plotId, cropId, isCompleted, pageable);
        return ResponseEntity.ok(tasks);
    }

    @PostMapping("/secure/task-completions")
    public ResponseEntity<TaskCompletionViewDto> completeTask(@RequestBody @Valid TaskCompletionCreateDto t) {
        TaskCompletionViewDto createdTaskCompletion = taskService.addTaskCompletion(t);

        return ResponseEntity.status(201).body(createdTaskCompletion);
    }

    @DeleteMapping("/secure/task-completions/{id}")
    public ResponseEntity<?> deleteTaskCompletion(@PathVariable Long id) {
        boolean deleted = taskService.deleteTaskCompletion(id);
        if (deleted) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

}
