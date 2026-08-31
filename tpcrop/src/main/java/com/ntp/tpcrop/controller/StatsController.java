package com.ntp.tpcrop.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.ntp.tpcrop.dto.response.SeasonProgressViewDto;
import com.ntp.tpcrop.dto.response.UserStatsViewDto;
import com.ntp.tpcrop.service.StatsService;

import lombok.RequiredArgsConstructor;

@Controller
@RequestMapping("/api/secure/manager/stats")
@RequiredArgsConstructor
public class StatsController {

    private final StatsService statsService;

    @GetMapping("/season-progress")
    public ResponseEntity<List<SeasonProgressViewDto>> getSeasonProgressStats(@RequestParam Long cropId,
            @RequestParam int year) {
        List<SeasonProgressViewDto> seasonProgressStats = statsService.getSeasonProgressStats(cropId, year);
        return ResponseEntity.ok(seasonProgressStats);
    }

    @GetMapping("/user-stats")
    public ResponseEntity<UserStatsViewDto> getUserStats(@RequestParam int year,
            @RequestParam(required = false) Long cropId) {
        UserStatsViewDto userStats = statsService.getUserStats(year, cropId);
        return ResponseEntity.ok(userStats);
    }

}
