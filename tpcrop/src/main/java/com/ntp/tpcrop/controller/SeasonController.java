package com.ntp.tpcrop.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ntp.tpcrop.dto.request.SeasonCreateDto;
import com.ntp.tpcrop.dto.response.SeasonViewDto;
import com.ntp.tpcrop.service.SeasonService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestParam;


@Controller
@RequiredArgsConstructor
@RequestMapping("/api")
public class SeasonController {

    private final SeasonService seasonService;

    @PostMapping("/secure/manager/seasons")
    public ResponseEntity<SeasonViewDto> addSeason(@RequestBody SeasonCreateDto s) {
        SeasonViewDto createdSeason = seasonService.addSeason(s);
        return ResponseEntity.status(201).body(createdSeason);
    }

    @GetMapping("/seasons")
    public ResponseEntity<Page<SeasonViewDto>> getSeasons(@RequestParam(required = true) Long cropId, Pageable pageable) {
        Page<SeasonViewDto> seasons = seasonService.getSeasons(cropId, pageable);
        return ResponseEntity.ok(seasons);
    }
    

}
