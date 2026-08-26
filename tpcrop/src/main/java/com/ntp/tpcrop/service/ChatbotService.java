package com.ntp.tpcrop.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.ntp.tpcrop.dto.request.ChatRequestDto;
import com.ntp.tpcrop.dto.response.ChatResponseDto;

@Service
public class ChatbotService {

    private final RestClient restClient;

    public ChatbotService(@Value("${chatbot.api.url}") String baseUrl) {
        this.restClient = RestClient.builder()
                .baseUrl(baseUrl)
                .build();
    }

    public ChatResponseDto ask(ChatRequestDto request) {
        try {
            ChatResponseDto response = restClient.post()
            .uri("/api/chat")
            .body(request)
            .retrieve()
            .body(ChatResponseDto.class);
            return response;
        } catch (Exception e) {
            throw new RuntimeException("Error occurred while fetching chat response", e);
        }

    }

}
