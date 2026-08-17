package com.ntp.tpcrop.service;

import com.ntp.tpcrop.dto.request.crop.CropCreateDto;
import com.ntp.tpcrop.dto.response.crop.CropViewDto;

public interface CropService {
    CropViewDto addCrop(CropCreateDto c);
}
