package com.ntp.tpcrop.service.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.ntp.tpcrop.dto.request.SeasonUpdateDto;
import com.ntp.tpcrop.dto.response.SeasonViewDto;
import com.ntp.tpcrop.entity.Seasons;

@Mapper(componentModel = "spring", uses = {
        CropMapper.class }, unmappedTargetPolicy = ReportingPolicy.IGNORE, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface SeasonMapper {

    @Mapping(source = "cropId", target = "crop")
    SeasonViewDto toDto(Seasons season);

    @Mapping(source = "crop", target = "cropId")
    Seasons toEntity(SeasonViewDto seasonViewDto);

    void updateEntityFromDto(SeasonUpdateDto seasonUpdateDto, @MappingTarget Seasons season);

}
