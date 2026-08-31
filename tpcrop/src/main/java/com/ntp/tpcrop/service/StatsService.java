package com.ntp.tpcrop.service;

import java.util.List;

import com.ntp.tpcrop.dto.response.SeasonProgressViewDto;
import com.ntp.tpcrop.dto.response.UserStatsViewDto;

public interface StatsService {
    List<SeasonProgressViewDto> getSeasonProgressStats(Long cropId, int targetYear);
    UserStatsViewDto getUserStats(int year, Long cropId);
}
