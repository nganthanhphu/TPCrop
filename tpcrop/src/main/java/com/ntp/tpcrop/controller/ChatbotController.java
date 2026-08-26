package com.ntp.tpcrop.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ntp.tpcrop.dto.request.ChatRequestDto;
import com.ntp.tpcrop.dto.response.ChatResponseDto;
import com.ntp.tpcrop.service.ChatbotService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@Controller
@RequiredArgsConstructor
@RequestMapping("/api")
public class ChatbotController {

    private final ChatbotService chatbotService;

    @PostMapping("/secure/ask")
    public ResponseEntity<ChatResponseDto> ask(@RequestBody ChatRequestDto request) {
        ChatResponseDto response = chatbotService.ask(request);
        
        return ResponseEntity.ok(response);
    }
    

}
