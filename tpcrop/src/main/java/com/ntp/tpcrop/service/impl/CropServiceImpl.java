package com.ntp.tpcrop.service.impl;

import org.springframework.stereotype.Service;

import com.ntp.tpcrop.dto.request.crop.CropCreateDto;
import com.ntp.tpcrop.dto.response.crop.CropViewDto;
import com.ntp.tpcrop.entity.Crops;
import com.ntp.tpcrop.repository.CropRepository;
import com.ntp.tpcrop.service.CropService;
import com.ntp.tpcrop.service.mapper.CropMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CropServiceImpl implements CropService {

    private final CropRepository cropRepository;
    private final CropMapper cropMapper;

    @Override
    public CropViewDto addCrop(CropCreateDto c) {
        Crops crop = new Crops();
        crop.setName(c.name());
        crop.setIsSupportChatbot(false);
        
        return cropMapper.toDto(cropRepository.save(crop));
    }

}
