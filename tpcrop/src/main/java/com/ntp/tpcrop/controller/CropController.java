package com.ntp.tpcrop.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ntp.tpcrop.dto.request.CropCreateDto;
import com.ntp.tpcrop.dto.request.CropUpdateDto;
import com.ntp.tpcrop.dto.response.CropViewDto;
import com.ntp.tpcrop.service.CropService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("/api")
@RequiredArgsConstructor
public class CropController {

    private final CropService cropService;

    @PostMapping("/secure/manager/crops")
    public ResponseEntity<CropViewDto> addCrop(@RequestBody CropCreateDto c) {
        CropViewDto createdCrop = cropService.addCrop(c);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCrop);
    }

    @PatchMapping("/secure/manager/crops/{id}")
    public ResponseEntity<CropViewDto> updateCrop(@PathVariable Long id, @RequestBody CropUpdateDto cropUpdateDto) {
        CropViewDto updatedCrop = cropService.updateCrop(id, cropUpdateDto);
        return ResponseEntity.ok(updatedCrop);
    }

    @DeleteMapping("/secure/manager/crops/{id}")
    public ResponseEntity<?> deleteCrop(@PathVariable Long id) {
        boolean deleted = cropService.deleteCrop(id);
        if (deleted) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/crops")
    public ResponseEntity<Page<CropViewDto>> getCrops(@RequestParam(required = false, defaultValue = "") String name,
            Pageable pageable) {
        Page<CropViewDto> crops = cropService.getCrops(name, pageable);
        return ResponseEntity.ok(crops);
    }

}
