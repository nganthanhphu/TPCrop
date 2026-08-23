package com.ntp.tpcrop.service.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.ntp.tpcrop.entity.Plots;
import com.ntp.tpcrop.dto.request.PlotUpdateDto;
import com.ntp.tpcrop.dto.response.PlotViewDto;

@Mapper(componentModel = "spring", uses = {CropMapper.class, UserMapper.class}, unmappedTargetPolicy = org.mapstruct.ReportingPolicy.IGNORE,
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface PlotMapper {

    @Mapping(source = "cropsSet", target = "crops")
    @Mapping(source = "userId", target = "user")
    PlotViewDto toDto(Plots plot);

    @Mapping(source = "crops", target = "cropsSet")
    @Mapping(source = "user", target = "userId")
    Plots toEntity(PlotViewDto plotViewDto);

    @Mapping(target = "cropsSet", ignore = true)
    void updateEntityFromDto(PlotUpdateDto plotUpdateDto, @MappingTarget Plots plot);

}
