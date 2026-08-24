package com.ntp.tpcrop.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ntp.tpcrop.dto.request.PlotCreateDto;
import com.ntp.tpcrop.dto.request.PlotUpdateDto;
import com.ntp.tpcrop.dto.response.PlotViewDto;
import com.ntp.tpcrop.service.PlotService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Controller
@RequiredArgsConstructor
@RequestMapping("/api")
public class PlotController {

    private final PlotService plotService;

    @GetMapping("/secure/plots")
    public ResponseEntity<Page<PlotViewDto>> getPlotsEntity(@RequestParam(required = false) Long cropId,
            Pageable pageable) {
        Page<PlotViewDto> plots = plotService.getPlots(cropId, pageable);
        return ResponseEntity.ok(plots);
    }

    @PostMapping("/secure/plots")
    public ResponseEntity<PlotViewDto> addMyPlot(@RequestBody @Valid PlotCreateDto plotCreateDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(plotService.addMyPlot(plotCreateDto));
    }

    @PatchMapping("/secure/plots/{id}")
    public ResponseEntity<PlotViewDto> updatePlot(@PathVariable Long id, @RequestBody @Valid PlotUpdateDto plotUpdateDto) {
        return ResponseEntity.ok(plotService.updatePlot(id, plotUpdateDto));
    }

    @DeleteMapping("/secure/plots/{id}")
    public ResponseEntity<?> deletePlot(@PathVariable Long id) {
        boolean deleted = plotService.deletePlot(id);
        if (deleted) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

}
