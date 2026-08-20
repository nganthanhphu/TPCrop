package com.ntp.tpcrop.service.impl;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.ntp.tpcrop.dto.request.CropCreateDto;
import com.ntp.tpcrop.dto.request.CropUpdateDto;
import com.ntp.tpcrop.dto.response.CropViewDto;
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

    @Override
    public Page<CropViewDto> getCrops(String name, Pageable pageable) {
        return cropRepository.findByNameIgnoreCaseContaining(name, pageable).map(cropMapper::toDto);
    }

    @Override
    public CropViewDto updateCrop(Long id, CropUpdateDto cropUpdateDto) {
        Crops crop = cropRepository.findById(id).get();
        cropMapper.updateEntityFromDto(cropUpdateDto, crop);
        return cropMapper.toDto(cropRepository.save(crop));
    }

    @Override
    public boolean deleteCrop(Long id) {
        if (cropRepository.existsById(id)) {
            cropRepository.deleteById(id);
            return true;
        }
        return false;
    }

}
