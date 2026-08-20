package com.ntp.tpcrop.security;

import org.springframework.stereotype.Component;

import com.ntp.tpcrop.repository.PlotRepository;
import com.ntp.tpcrop.util.UserUtil;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class PlotSecurity {

    private final PlotRepository plotRepository;
    private final UserUtil userUtil;

    public boolean isPlotOwner(Long plotId) {
        Long currentUserId = userUtil.getCurrentUser().getId();
        return plotRepository.existsByIdAndUserId_Id(plotId, currentUserId);
    }

}
