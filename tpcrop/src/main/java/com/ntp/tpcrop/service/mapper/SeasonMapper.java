package com.ntp.tpcrop.service.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import com.ntp.tpcrop.dto.response.season.SeasonViewDto;
import com.ntp.tpcrop.entity.Seasons;

@Mapper(componentModel = "spring", uses = {CropMapper.class}, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface SeasonMapper {

    @Mapping(source = "cropId", target = "crop")
    SeasonViewDto toDto(Seasons season);

    Seasons toEntity(SeasonViewDto seasonViewDto);

}
