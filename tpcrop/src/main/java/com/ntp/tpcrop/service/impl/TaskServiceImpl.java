package com.ntp.tpcrop.service.impl;

import org.springframework.stereotype.Service;

import com.ntp.tpcrop.dto.request.task.TaskCreateDto;
import com.ntp.tpcrop.dto.response.task.TaskViewDto;
import com.ntp.tpcrop.entity.Seasons;
import com.ntp.tpcrop.entity.Tasks;
import com.ntp.tpcrop.repository.SeasonRepository;
import com.ntp.tpcrop.repository.TaskRepository;
import com.ntp.tpcrop.service.TaskService;
import com.ntp.tpcrop.service.mapper.TaskMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final SeasonRepository seasonRepository;
    private final TaskMapper taskMapper;

    @Override
    public TaskViewDto addTask(TaskCreateDto t) {
        Seasons season = seasonRepository.findById(t.seasonId()).get();

        // Check if task's start date is within the season's start year and end year
        if (t.startDate().getYear() < season.getStartYear() || t.startDate().getYear() > season.getEndYear()
                || t.endDate().getYear() < season.getStartYear() || t.endDate().getYear() > season.getEndYear()) {
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

}
