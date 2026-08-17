package com.ntp.tpcrop.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ntp.tpcrop.dto.request.task.TaskCreateDto;
import com.ntp.tpcrop.dto.response.task.TaskViewDto;
import com.ntp.tpcrop.service.TaskService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@Controller
@RequiredArgsConstructor
@RequestMapping("/api")
public class TaskController {

    private final TaskService taskService;

    @PostMapping("/tasks")
    public ResponseEntity<TaskViewDto> addTask(@RequestBody TaskCreateDto t) {
        TaskViewDto createdTask = taskService.addTask(t);

        return ResponseEntity.status(201).body(createdTask);
    }
    

}
