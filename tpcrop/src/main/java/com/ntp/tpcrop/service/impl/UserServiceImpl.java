package com.ntp.tpcrop.service.impl;

import java.io.IOException;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.ntp.tpcrop.dto.request.ManagerUserUpdateDto;
import com.ntp.tpcrop.dto.request.UserRegisterDto;
import com.ntp.tpcrop.dto.request.UserUpdateDto;
import com.ntp.tpcrop.dto.response.UserViewDto;
import com.ntp.tpcrop.entity.Users;
import com.ntp.tpcrop.repository.UserRepository;
import com.ntp.tpcrop.security.CustomUserDetails;
import com.ntp.tpcrop.service.UserService;
import com.ntp.tpcrop.service.mapper.UserMapper;
import com.ntp.tpcrop.util.CloudinaryUtil;
import com.ntp.tpcrop.util.UserUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder;

    private final CloudinaryUtil cloudinaryUtil;

    private final UserMapper userMapper;

    private final UserUtil userUtil;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Users user = this.userRepository.findByUsername(username);

        if (user == null) {
            throw new UsernameNotFoundException("User not found with username: " + username);
        }

        Set<GrantedAuthority> authorities = new HashSet<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_" + user.getRole()));

        return new CustomUserDetails(user.getId(), user.getUsername(), user.getPassword(), user.getActive(), true, true,
                true, authorities);
    }

    @Override
    public Users authenticate(String username, String password) {
        Users user = this.userRepository.findByUsername(username);

        if (user == null || !passwordEncoder.matches(password, user.getPassword())) {
            return null;
        }

        return user;
    }

    @Override
    public Users addUser(UserRegisterDto u) throws IOException {
        String avatarUrl = null;
        if (u.avatar() != null && !u.avatar().isEmpty()) {
            avatarUrl = cloudinaryUtil.uploadFile(u.avatar().getBytes());
        }

        Users user = new Users();
        user.setUsername(u.username());
        user.setPassword(passwordEncoder.encode(u.password()));
        user.setEmail(u.email());
        user.setFullName(u.fullName());
        user.setRole(u.role());
        user.setAvatar(avatarUrl);
        user.setJoinedDate(LocalDate.now());

        if (u.role() != null && u.role().equals("MANAGER"))
            user.setActive(false);
        else
            user.setActive(true);

        return this.userRepository.save(user);
    }

    @Override
    public UserViewDto getCurrentUser() {
        Long currentUserId = userUtil.getCurrentUser().getId();
        Users user = userRepository.findById(currentUserId).get();

        return userMapper.toDto(user);

    }

    @Override
    public UserViewDto updateCurrentUser(UserUpdateDto u) throws IOException {
        Long currentUserId = userUtil.getCurrentUser().getId();
        Users user = userRepository.findById(currentUserId).get();

        if (u.oldPassword() != null && !u.oldPassword().isEmpty()) {
            if (!passwordEncoder.matches(u.oldPassword(), user.getPassword())) {
                throw new IllegalArgumentException("Old password is incorrect.");
            }
            if (u.password() != null && !u.password().isEmpty()) {
                user.setPassword(passwordEncoder.encode(u.password()));
            }
        }

        if (u.email() != null) {
            user.setEmail(u.email());
        }

        if (u.fullName() != null) {
            user.setFullName(u.fullName());
        }

        if (u.avatar() != null && !u.avatar().isEmpty()) {
            String avatarUrl = cloudinaryUtil.uploadFile(u.avatar().getBytes());
            user.setAvatar(avatarUrl);
        }

        return userMapper.toDto(userRepository.save(user));
    }

    @Override
    public Page<UserViewDto> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(userMapper::toDto);
    }

    @Override
    public UserViewDto updateUserByManager(Long userId, ManagerUserUpdateDto u) {
        Users user = userRepository.findById(userId).get();
        user.setActive(u.active());
        return userMapper.toDto(userRepository.save(user));
    }

}
