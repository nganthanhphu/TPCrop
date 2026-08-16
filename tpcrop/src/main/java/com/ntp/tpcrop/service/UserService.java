package com.ntp.tpcrop.service;

import org.springframework.security.core.userdetails.UserDetailsService;

import com.ntp.tpcrop.entity.Users;

public interface UserService extends UserDetailsService{
    Users authenticate(String username, String password);
}
