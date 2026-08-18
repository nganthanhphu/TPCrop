package com.ntp.tpcrop.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ntp.tpcrop.dto.request.TaskCreateDto;
import com.ntp.tpcrop.dto.response.TaskViewDto;
import com.ntp.tpcrop.service.TaskService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequiredArgsConstructor
@RequestMapping("/api")
public class TaskController {

    private final TaskService taskService;

    @PostMapping("/secure/manager/tasks")
    public ResponseEntity<TaskViewDto> addTask(@RequestBody TaskCreateDto t) {
        TaskViewDto createdTask = taskService.addTask(t);

        return ResponseEntity.status(201).body(createdTask);
    }

    @GetMapping("/secure/manager/tasks")
    public ResponseEntity<Page<TaskViewDto>> getTasks(@RequestParam(required = false) Long seasonId,
            @RequestParam(required = true) Long cropId, Pageable pageable) {
        Page<TaskViewDto> tasks = taskService.getTasksByManager(seasonId, cropId, pageable);
        return ResponseEntity.ok(tasks);
    }

}
