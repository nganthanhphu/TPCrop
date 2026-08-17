package com.ntp.tpcrop.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ntp.tpcrop.dto.request.season.SeasonCreateDto;
import com.ntp.tpcrop.dto.response.season.SeasonViewDto;
import com.ntp.tpcrop.service.SeasonService;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
@RequestMapping("/api")
public class SeasonController {

    private final SeasonService seasonService;

    @PostMapping("/seasons")
    public ResponseEntity<SeasonViewDto> addSeason(@RequestBody SeasonCreateDto s) {
        SeasonViewDto createdSeason = seasonService.addSeason(s);
        return ResponseEntity.status(201).body(createdSeason);
    }

}
