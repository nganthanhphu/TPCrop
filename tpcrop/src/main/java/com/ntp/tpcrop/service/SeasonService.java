package com.ntp.tpcrop.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.ntp.tpcrop.dto.request.season.SeasonCreateDto;
import com.ntp.tpcrop.dto.response.season.SeasonViewDto;

public interface SeasonService {
    SeasonViewDto addSeason(SeasonCreateDto s);
    Page<SeasonViewDto> getSeasons(Long cropId, Pageable pageable);
}
