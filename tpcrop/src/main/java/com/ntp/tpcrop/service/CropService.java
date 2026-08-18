package com.ntp.tpcrop.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.ntp.tpcrop.dto.request.CropCreateDto;
import com.ntp.tpcrop.dto.response.CropViewDto;

public interface CropService {
    CropViewDto addCrop(CropCreateDto c);

    Page<CropViewDto> getCrops(String name, Pageable pageable);
}
