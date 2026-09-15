package com.ntp.tpcrop.service;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.ntp.tpcrop.dto.request.ChatRequestDto;
import com.ntp.tpcrop.dto.response.ChatResponseDto;
import com.ntp.tpcrop.util.UserUtil;

import lombok.RequiredArgsConstructor;

@Service
public class ChatbotService {

    private final RestClient restClient;
    private final UserUtil userUtil;

    public ChatbotService(@Value("${chatbot.api.url}") String baseUrl, UserUtil userUtil) {
        this.restClient = RestClient.builder()
                .baseUrl(baseUrl)
                .build();
        this.userUtil = userUtil;
    }

    public ChatResponseDto ask(ChatRequestDto request) {
        Long userId = userUtil.getCurrentUser().getId();
        Map<String, ?> requestBody = Map.of(
                "user_id", userId,
                "question", request.question()
        );

        try {
            ChatResponseDto response = restClient.post()
            .uri("/api/chat")
            .body(requestBody)
            .retrieve()
            .body(ChatResponseDto.class);
            return response;
        } catch (Exception e) {
            throw new RuntimeException("Error occurred while fetching chat response", e);
        }

    }

}
