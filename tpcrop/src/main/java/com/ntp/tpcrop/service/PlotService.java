package com.ntp.tpcrop.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.ntp.tpcrop.dto.request.PlotCreateDto;
import com.ntp.tpcrop.dto.response.PlotViewDto;

public interface PlotService {

    PlotViewDto addMyPlot(PlotCreateDto p);

    Page<PlotViewDto> getPlots(Long cropId, Pageable pageable);

}
