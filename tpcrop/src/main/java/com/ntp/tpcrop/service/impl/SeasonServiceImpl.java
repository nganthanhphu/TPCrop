package com.ntp.tpcrop.service.impl;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.ntp.tpcrop.dto.request.season.SeasonCreateDto;
import com.ntp.tpcrop.dto.response.season.SeasonViewDto;
import com.ntp.tpcrop.entity.Crops;
import com.ntp.tpcrop.entity.Seasons;
import com.ntp.tpcrop.repository.CropRepository;
import com.ntp.tpcrop.repository.SeasonRepository;
import com.ntp.tpcrop.service.SeasonService;
import com.ntp.tpcrop.service.mapper.SeasonMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SeasonServiceImpl implements SeasonService {

    private final SeasonRepository seasonRepository;
    private final CropRepository cropRepository;
    private final SeasonMapper seasonMapper;

    @Override
    public SeasonViewDto addSeason(SeasonCreateDto s) {
        Seasons season = new Seasons();
        season.setName(s.name());
        season.setStartYear(s.startYear());
        season.setEndYear(s.endYear());

        Crops crop = cropRepository.getReferenceById(s.cropId());
        season.setCropId(crop);

        return seasonMapper.toDto(seasonRepository.save(season));
    }

    @Override
    public Page<SeasonViewDto> getSeasons(Long cropId, Pageable pageable) {
        return seasonRepository.getSeasons(cropId, pageable)
                .map(seasonMapper::toDto);
    }

}
