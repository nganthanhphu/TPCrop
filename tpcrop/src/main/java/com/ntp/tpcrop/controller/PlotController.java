package com.ntp.tpcrop.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ntp.tpcrop.dto.request.PlotCreateDto;
import com.ntp.tpcrop.dto.response.PlotViewDto;
import com.ntp.tpcrop.service.PlotService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
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
    public ResponseEntity<PlotViewDto> addPlot(@RequestBody PlotCreateDto plotCreateDto) {
        return ResponseEntity.ok(plotService.addPlot(plotCreateDto));
    }
    

}
