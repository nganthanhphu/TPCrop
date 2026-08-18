package com.ntp.tpcrop.service.mapper;

import org.mapstruct.Mapper;

import com.ntp.tpcrop.dto.response.UserViewDto;
import com.ntp.tpcrop.entity.Users;

@Mapper(componentModel = "spring", unmappedTargetPolicy = org.mapstruct.ReportingPolicy.IGNORE)
public interface UserMapper {

    UserViewDto toDto(Users user);

    Users toEntity(UserViewDto userViewDto);

}
