package com.ntp.tpcrop.service;

import java.io.IOException;

import org.springframework.security.core.userdetails.UserDetailsService;

import com.ntp.tpcrop.dto.request.user.UserRegisterDto;
import com.ntp.tpcrop.entity.Users;

public interface UserService extends UserDetailsService {
    Users authenticate(String username, String password);

    Users addUser(UserRegisterDto u) throws IOException;
}
