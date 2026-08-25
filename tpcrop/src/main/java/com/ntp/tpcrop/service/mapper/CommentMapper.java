package com.ntp.tpcrop.service.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import com.ntp.tpcrop.dto.request.CommentUpdateDto;
import com.ntp.tpcrop.dto.response.CommentViewDto;
import com.ntp.tpcrop.entity.Comments;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE, uses = {
        UserMapper.class }, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface CommentMapper {

    @Mapping(target = "articleId", source = "articleId.id")
    @Mapping(target = "parentId", source = "parentId.id")
    @Mapping(target = "user", source = "userId")
    CommentViewDto toViewDto(Comments comment);

    @Mapping(target = "articleId", ignore = true)
    @Mapping(target = "parentId", ignore = true)
    @Mapping(target = "userId", ignore = true)
    Comments toEntity(CommentViewDto commentViewDto);

    void updateEntityFromDto(CommentUpdateDto commentUpdateDto, @MappingTarget Comments comment);

}
