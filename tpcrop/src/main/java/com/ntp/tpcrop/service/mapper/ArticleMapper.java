package com.ntp.tpcrop.service.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import com.ntp.tpcrop.dto.request.ArticleUpdateDto;
import com.ntp.tpcrop.dto.response.ArticleDetailViewDto;
import com.ntp.tpcrop.dto.response.ArticleViewDto;
import com.ntp.tpcrop.entity.Articles;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE, uses = {
        UserMapper.class }, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ArticleMapper {

    @Mapping(target = "user", source = "userId")
    ArticleViewDto toViewDto(Articles article);

    @Mapping(target = "user", source = "userId")
    ArticleDetailViewDto toDetailViewDto(Articles article);

    Articles toEntity(ArticleDetailViewDto articleDetailViewDto);

    void updateEntityFromDto(ArticleUpdateDto articleUpdateDto, @MappingTarget Articles article);

}
