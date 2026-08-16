package com.ntp.tpcrop.controller;

import java.security.Principal;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ntp.tpcrop.dto.request.user.UserLoginDto;
import com.ntp.tpcrop.entity.Users;
import com.ntp.tpcrop.service.UserService;
import com.ntp.tpcrop.util.JwtUtil;

import lombok.RequiredArgsConstructor;

@Controller
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    @PostMapping("/auth")
    public ResponseEntity<?> login(@RequestBody UserLoginDto u) {
        Users user = userService.authenticate(u.username(), u.password());

        if (user != null) {
            try {
                String token = jwtUtil.generateToken(user);
                return ResponseEntity.ok().body(Map.of("token", token));
            } catch (Exception e) {
                return ResponseEntity.status(500).body(Map.of("error", "Failed to generate token"));
            }
        } else {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        }
    }
    
}
