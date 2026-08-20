package com.ntp.tpcrop.controller;

import java.io.IOException;
import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.nimbusds.jose.JOSEException;
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
    public ResponseEntity<?> login(@RequestBody UserLoginDto u) {
        Users user = userService.authenticate(u.username(), u.password());

        if (user != null) {
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
    public ResponseEntity<?> register(@ModelAttribute UserRegisterDto u) throws IOException {
        Users user = this.userService.addUser(u);
        try {
            String token = jwtUtil.generateToken(user);
            UserViewDto userViewDto = userMapper.toDto(user);
            UserLoginViewDto res = new UserLoginViewDto(userViewDto, token);
            return ResponseEntity.ok().body(res);
        } catch (JOSEException e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to generate token"));
        }
    }

    @GetMapping("/secure/profile")
    public ResponseEntity<UserViewDto> getMethodName() {
        UserViewDto currentUser = userService.getCurrentUser();

        return ResponseEntity.ok(currentUser);
    }

    @PatchMapping(path = "/secure/profile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UserViewDto> updateCurrentUser(@ModelAttribute UserUpdateDto u) throws IOException {
        UserViewDto updatedUser = userService.updateCurrentUser(u);
        return ResponseEntity.ok(updatedUser);
    }

}
