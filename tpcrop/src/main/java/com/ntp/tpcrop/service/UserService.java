package com.ntp.tpcrop.service;

import java.io.IOException;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetailsService;

import com.ntp.tpcrop.dto.request.ManagerUserUpdateDto;
import com.ntp.tpcrop.dto.request.UserRegisterDto;
import com.ntp.tpcrop.dto.request.UserUpdateDto;
import com.ntp.tpcrop.dto.response.UserViewDto;
import com.ntp.tpcrop.entity.Users;

public interface UserService extends UserDetailsService {
    Users authenticate(String username, String password);

    Users addUser(UserRegisterDto u) throws IOException;

    UserViewDto getCurrentUser();

    UserViewDto updateCurrentUser(UserUpdateDto u) throws IOException;

    Page<UserViewDto> getAllUsers(Pageable pageable);

    UserViewDto updateUserByManager(Long userId, ManagerUserUpdateDto u);
}
