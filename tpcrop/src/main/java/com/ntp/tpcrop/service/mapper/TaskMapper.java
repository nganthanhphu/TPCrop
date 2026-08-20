package com.ntp.tpcrop.service.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import com.ntp.tpcrop.dto.request.TaskUpdateDto;
import com.ntp.tpcrop.dto.response.TaskViewDto;
import com.ntp.tpcrop.entity.Tasks;

@Mapper(componentModel = "spring", uses = {SeasonMapper.class}, unmappedTargetPolicy = ReportingPolicy.IGNORE
    , nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface TaskMapper {

    @Mapping(source = "seasonId", target = "season")
    TaskViewDto toDto(Tasks task);

    @Mapping(source = "season", target = "seasonId")
    Tasks toEntity(TaskViewDto taskViewDto);

    void updateEntityFromDto(TaskUpdateDto taskUpdateDto, @MappingTarget Tasks task);
}
