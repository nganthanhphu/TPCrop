package com.ntp.tpcrop.controller;

import java.io.IOException;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.nimbusds.jose.JOSEException;
import com.ntp.tpcrop.dto.request.ManagerUserUpdateDto;
import com.ntp.tpcrop.dto.request.UserLoginDto;
import com.ntp.tpcrop.dto.request.UserRegisterDto;
import com.ntp.tpcrop.dto.request.UserUpdateDto;
import com.ntp.tpcrop.dto.response.UserLoginViewDto;
import com.ntp.tpcrop.dto.response.UserViewDto;
import com.ntp.tpcrop.entity.Users;
import com.ntp.tpcrop.service.UserService;
import com.ntp.tpcrop.service.mapper.UserMapper;
import com.ntp.tpcrop.util.JwtUtil;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final UserMapper userMapper;

    @PostMapping("/auth")
    public ResponseEntity<?> login(@RequestBody @Valid UserLoginDto u) {
        Users user = userService.authenticate(u.username(), u.password());

        if (user != null) {
            if (!user.getActive()) {
                return ResponseEntity.status(403).body(Map.of("error", "User account is inactive"));
            }

            try {
                String token = jwtUtil.generateToken(user);
                UserViewDto userViewDto = userMapper.toDto(user);
                UserLoginViewDto res = new UserLoginViewDto(userViewDto, token);
                return ResponseEntity.ok().body(res);
            } catch (JOSEException e) {
                return ResponseEntity.status(500).body(Map.of("error", "Failed to generate token"));
            }
        } else {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        }
    }

    @PostMapping(path = "/users", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> register(@ModelAttribute @Valid UserRegisterDto u) throws IOException {
        Users user = this.userService.addUser(u);
        try {
            String token = jwtUtil.generateToken(user);
            UserViewDto userViewDto = userMapper.toDto(user);
            UserLoginViewDto res = new UserLoginViewDto(userViewDto, token);
            return ResponseEntity.status(201).body(res);
        } catch (JOSEException e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to generate token"));
        }
    }

    @GetMapping("/secure/profile")
    public ResponseEntity<UserViewDto> getMethodName() {
        UserViewDto currentUser = userService.getCurrentUser();

        return ResponseEntity.ok(currentUser);
    }

    @PostMapping(path = "/secure/profile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UserViewDto> updateCurrentUser(@ModelAttribute @Valid UserUpdateDto u) throws IOException {
        UserViewDto updatedUser = userService.updateCurrentUser(u);
        return ResponseEntity.ok(updatedUser);
    }

    @GetMapping("/secure/manager/users")
    public ResponseEntity<Page<UserViewDto>> getAllUsers(Pageable pageable) {
        Page<UserViewDto> users = userService.getAllUsers(pageable);
        return ResponseEntity.ok(users);
    }

    @PatchMapping("/secure/manager/users/{userId}")
    public ResponseEntity<UserViewDto> updateUserByManager(@PathVariable Long userId, @RequestBody @Valid ManagerUserUpdateDto u) {
        UserViewDto updatedUser = userService.updateUserByManager(userId, u);
        return ResponseEntity.ok(updatedUser);
    }

}
