package com.ntp.tpcrop.service.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.ntp.tpcrop.entity.Plots;

import com.ntp.tpcrop.dto.response.PlotViewDto;

@Mapper(componentModel = "spring", uses = {CropMapper.class, UserMapper.class}, unmappedTargetPolicy = org.mapstruct.ReportingPolicy.IGNORE)
public interface PlotMapper {

    @Mapping(source = "cropId", target = "crop")
    @Mapping(source = "userId", target = "user")
    PlotViewDto toDto(Plots plot);

    @Mapping(source = "crop", target = "cropId")
    @Mapping(source = "user", target = "userId")
    Plots toEntity(PlotViewDto plotViewDto);

}
