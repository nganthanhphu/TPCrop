package com.ntp.tpcrop.service.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import com.ntp.tpcrop.dto.request.CropUpdateDto;
import com.ntp.tpcrop.dto.response.CropViewDto;
import com.ntp.tpcrop.entity.Crops;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface CropMapper {

    CropViewDto toDto(Crops crop);

    Crops toEntity(CropViewDto cropViewDto);

    void updateEntityFromDto(CropUpdateDto cropUpdateDto, @MappingTarget Crops crop);
}
