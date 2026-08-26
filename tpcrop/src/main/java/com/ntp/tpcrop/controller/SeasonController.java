package com.ntp.tpcrop.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ntp.tpcrop.dto.request.SeasonCreateDto;
import com.ntp.tpcrop.dto.request.SeasonUpdateDto;
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
    public ResponseEntity<SeasonViewDto> addSeason(@RequestBody @Valid SeasonCreateDto s) {
        SeasonViewDto createdSeason = seasonService.addSeason(s);
        return ResponseEntity.status(201).body(createdSeason);
    }

    @PatchMapping("/secure/manager/seasons/{id}")
    public ResponseEntity<SeasonViewDto> updateSeason(@PathVariable Long id,
            @RequestBody @Valid SeasonUpdateDto seasonUpdateDto) {
        SeasonViewDto updatedSeason = seasonService.updateSeason(id, seasonUpdateDto);
        return ResponseEntity.ok(updatedSeason);
    }

    @DeleteMapping("/secure/manager/seasons/{id}")
    public ResponseEntity<?> deleteSeason(@PathVariable Long id) {
        boolean deleted = seasonService.deleteSeason(id);
        if (deleted) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/seasons")
    public ResponseEntity<Page<SeasonViewDto>> getSeasons(@RequestParam(required = true) Long cropId,
            Pageable pageable) {
        Page<SeasonViewDto> seasons = seasonService.getSeasons(cropId, pageable);
        return ResponseEntity.ok(seasons);
    }

    @GetMapping("/seasons/{id}")
    public ResponseEntity<SeasonViewDto> getSeasonById(@PathVariable Long id) {
        SeasonViewDto season = seasonService.getSeasonById(id);
        return ResponseEntity.ok(season);

    }

}
