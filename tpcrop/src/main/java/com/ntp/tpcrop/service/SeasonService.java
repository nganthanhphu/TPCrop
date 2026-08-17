package com.ntp.tpcrop.service;

import com.ntp.tpcrop.dto.request.season.SeasonCreateDto;
import com.ntp.tpcrop.dto.response.season.SeasonViewDto;

public interface SeasonService {
    SeasonViewDto addSeason(SeasonCreateDto s);
}
