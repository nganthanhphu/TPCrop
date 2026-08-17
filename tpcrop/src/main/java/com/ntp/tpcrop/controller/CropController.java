package com.ntp.tpcrop.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ntp.tpcrop.dto.request.crop.CropCreateDto;
import com.ntp.tpcrop.dto.response.crop.CropViewDto;
import com.ntp.tpcrop.service.CropService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@Controller
@RequestMapping("/api")
@RequiredArgsConstructor
public class CropController {

    private final CropService cropService;

    @PostMapping("/crops")
    public ResponseEntity<CropViewDto> addCrop(@RequestBody CropCreateDto c) {
        CropViewDto createdCrop = cropService.addCrop(c);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCrop);
    }
    

}
