package com.ntp.tpcrop.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ntp.tpcrop.dto.response.SeasonProgressViewDto;
import com.ntp.tpcrop.dto.response.UserStatsViewDto;
import com.ntp.tpcrop.repository.SeasonRepository;
import com.ntp.tpcrop.repository.UserRepository;
import com.ntp.tpcrop.service.StatsService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StatsServiceImpl implements StatsService {

    private final UserRepository userRepository;
    private final SeasonRepository seasonRepository;

    @Override
    public List<SeasonProgressViewDto> getSeasonProgressStats(Long cropId, int targetYear) {
        return seasonRepository.getSeasonProgressByYear(cropId, targetYear);
    }

    @Override
    public UserStatsViewDto getUserStats(int year, Long cropId) {
        return userRepository.getUserStats(year, cropId);
    }

}
