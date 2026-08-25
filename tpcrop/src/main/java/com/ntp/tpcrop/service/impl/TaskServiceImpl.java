package com.ntp.tpcrop.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import com.ntp.tpcrop.dto.request.TaskCompletionCreateDto;
import com.ntp.tpcrop.dto.request.TaskCreateDto;
import com.ntp.tpcrop.dto.request.TaskUpdateDto;
import com.ntp.tpcrop.dto.response.TaskViewDto;
import com.ntp.tpcrop.dto.response.TaskCompletionViewDto;
import com.ntp.tpcrop.dto.response.TaskDetailViewDto;
import com.ntp.tpcrop.entity.Plots;
import com.ntp.tpcrop.entity.Seasons;
import com.ntp.tpcrop.entity.TaskCompletions;
import com.ntp.tpcrop.entity.Tasks;
import com.ntp.tpcrop.repository.PlotRepository;
import com.ntp.tpcrop.repository.SeasonRepository;
import com.ntp.tpcrop.repository.TaskCompletionRepository;
import com.ntp.tpcrop.repository.TaskRepository;
import com.ntp.tpcrop.service.TaskService;
import com.ntp.tpcrop.service.mapper.TaskCompletionMapper;
import com.ntp.tpcrop.service.mapper.TaskMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final PlotRepository plotRepository;
    private final SeasonRepository seasonRepository;
    private final TaskCompletionRepository taskCompletionRepository;
    private final TaskMapper taskMapper;
    private final TaskCompletionMapper taskCompletionMapper;

    @Override
    public TaskViewDto addTask(TaskCreateDto t) {
        Seasons season = seasonRepository.findById(t.seasonId()).get();

        if (!validateTaskDates(t.startDate(), t.endDate(), season)) {
            throw new IllegalArgumentException(
                    "Task's start date and end date must be within the season's start year and end year.");
        }

        Tasks task = new Tasks();
        task.setDescription(t.description());
        task.setStartDate(t.startDate());
        task.setEndDate(t.endDate());
        task.setSeasonId(season);

        return taskMapper.toDto(taskRepository.save(task));
    }

    @Override
    public Page<TaskViewDto> getTasksByManager(Long seasonId, Pageable pageable) {
        return taskRepository.getTasks(seasonId, pageable)
                .map(taskMapper::toDto);
    }

    @Override
    @PreAuthorize("@plotSecurity.isPlotOwner(#plotId)")
    public Page<TaskDetailViewDto> getDetailedTasks(Long plotId, Long cropId, LocalDate targetDate, Boolean isCompleted, Pageable pageable) {
        return taskRepository.getDetailedTasks(plotId, cropId, targetDate, isCompleted, pageable);
    }

    @Override
    @PreAuthorize("@plotSecurity.isPlotOwner(#t.plotId())")
    public TaskCompletionViewDto addTaskCompletion(TaskCompletionCreateDto t) {
        Tasks task = taskRepository.findById(t.taskId()).get();
        if (task.getStartDate().isAfter(LocalDate.now())) {
            throw new IllegalArgumentException("Task cannot be completed before its start date.");
        }

        Plots plot = plotRepository.findById(t.plotId()).get();

        if (!plot.getCropsSet().contains(task.getSeasonId().getCropId()))
            throw new IllegalArgumentException("Plot's crops do not match the task's season crop.");

        TaskCompletions taskCompletion = new TaskCompletions();
        taskCompletion.setTaskId(taskRepository.getReferenceById(t.taskId()));
        taskCompletion.setPlotId(plotRepository.getReferenceById(t.plotId()));
        taskCompletion.setTimeCompleted(LocalDateTime.now());
        return taskCompletionMapper.toDto(taskCompletionRepository.save(taskCompletion));
    }

    @Override
    public TaskViewDto updateTask(Long id, TaskUpdateDto taskUpdateDto) {
        Tasks task = taskRepository.findById(id).get();
        Seasons season = task.getSeasonId();

        if (taskUpdateDto.startDate() != null) {
            if (!validateTaskDates(taskUpdateDto.startDate(), task.getEndDate(), season)) {
                throw new IllegalArgumentException(
                        "Task's start date must be within the season's start year and end year.");
            }
        }

        if (taskUpdateDto.endDate() != null) {
            if (!validateTaskDates(task.getStartDate(), taskUpdateDto.endDate(), season)) {
                throw new IllegalArgumentException(
                        "Task's end date must be within the season's start year and end year.");
            }
        }

        taskMapper.updateEntityFromDto(taskUpdateDto, task);

        return taskMapper.toDto(taskRepository.save(task));
    }

    @Override
    public boolean deleteTask(Long id) {
        if (taskRepository.existsById(id)) {
            taskRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private boolean validateTaskDates(LocalDate startDate, LocalDate endDate, Seasons season) {
        return !(startDate.getYear() < season.getStartYear() || startDate.getYear() > season.getEndYear()
                || endDate.getYear() < season.getStartYear() || endDate.getYear() > season.getEndYear());
    }

    @Override
    @PreAuthorize("@taskCompletionSecurity.isTaskCompletionOwner(#id)")
    public boolean deleteTaskCompletion(Long id) {
        if (taskCompletionRepository.existsById(id)) {
            taskCompletionRepository.deleteById(id);
            return true;
        }
        return false;
    }

}
