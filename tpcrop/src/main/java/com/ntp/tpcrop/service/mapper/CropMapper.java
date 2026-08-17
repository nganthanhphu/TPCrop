package com.ntp.tpcrop.service.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import com.ntp.tpcrop.dto.response.crop.CropViewDto;
import com.ntp.tpcrop.entity.Crops;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CropMapper {

    CropViewDto toDto(Crops crop);

    Crops toEntity(CropViewDto cropViewDto);

}
