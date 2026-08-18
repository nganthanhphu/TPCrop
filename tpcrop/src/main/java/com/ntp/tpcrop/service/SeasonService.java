package com.ntp.tpcrop.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.ntp.tpcrop.dto.request.SeasonCreateDto;
import com.ntp.tpcrop.dto.response.SeasonViewDto;

public interface SeasonService {
    SeasonViewDto addSeason(SeasonCreateDto s);
    Page<SeasonViewDto> getSeasons(Long cropId, Pageable pageable);
}
