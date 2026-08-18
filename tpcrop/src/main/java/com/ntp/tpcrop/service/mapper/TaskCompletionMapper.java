package com.ntp.tpcrop.service.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.ntp.tpcrop.dto.response.TaskCompletionViewDto;
import com.ntp.tpcrop.entity.TaskCompletions;

@Mapper(componentModel = "spring", uses = {TaskMapper.class, PlotMapper.class}, unmappedTargetPolicy = org.mapstruct.ReportingPolicy.IGNORE)
public interface TaskCompletionMapper {

    @Mapping(source = "taskId", target = "task")
    @Mapping(source = "plotId", target = "plot")
    TaskCompletionViewDto toDto(TaskCompletions taskCompletion);

    @Mapping(source = "task", target = "taskId")
    @Mapping(source = "plot", target = "plotId")
    TaskCompletions toEntity(TaskCompletionViewDto taskCompletionViewDto);

}
