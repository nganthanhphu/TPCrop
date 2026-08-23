package com.ntp.tpcrop.service.impl;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import com.ntp.tpcrop.dto.request.PlotCreateDto;
import com.ntp.tpcrop.dto.request.PlotUpdateDto;
import com.ntp.tpcrop.dto.response.PlotViewDto;
import com.ntp.tpcrop.entity.Crops;
import com.ntp.tpcrop.entity.Plots;
import com.ntp.tpcrop.entity.Users;
import com.ntp.tpcrop.repository.CropRepository;
import com.ntp.tpcrop.repository.PlotRepository;
import com.ntp.tpcrop.repository.UserRepository;
import com.ntp.tpcrop.service.PlotService;
import com.ntp.tpcrop.service.mapper.PlotMapper;
import com.ntp.tpcrop.util.UserUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PlotServiceImpl implements PlotService {

    private final PlotRepository plotRepository;
    private final CropRepository cropRepository;
    private final UserRepository userRepository;
    private final PlotMapper plotMapper;
    private final UserUtil userUtil;

    @Override
    public PlotViewDto addMyPlot(PlotCreateDto p) {
        Plots plot = new Plots();
        plot.setSize(p.size());
        plot.setAddress(p.address());

        Set<Crops> crops = new HashSet<>();

        cropRepository.findAllById(p.cropIds()).forEach(crop -> crops.add(crop));
        plot.setCropsSet(crops);

        Users user = userRepository.getReferenceById(userUtil.getCurrentUser().getId());
        plot.setUserId(user);

        return plotMapper.toDto(plotRepository.save(plot));

    }

    @Override
    public Page<PlotViewDto> getPlots(Long cropId, Pageable pageable) {
        return plotRepository.findByCropId_IdAndUserId_Id(cropId, userUtil.getCurrentUser().getId(), pageable)
                .map(plotMapper::toDto);
    }

    @Override
    @PreAuthorize("plotSecurity.isPlotOwner(#id)")
    public PlotViewDto updatePlot(Long id, PlotUpdateDto plotUpdateDto) {
        Plots plot = plotRepository.findById(id).get();
        plotMapper.updateEntityFromDto(plotUpdateDto, plot);

        if (plotUpdateDto.cropIds() != null && !plotUpdateDto.cropIds().isEmpty()) {
            Set<Crops> existingCrops = plot.getCropsSet();
            if (existingCrops == null) {
                existingCrops = new HashSet<>();
                plot.setCropsSet(existingCrops);
            }
            
            existingCrops.removeIf(crop -> !plotUpdateDto.cropIds().contains(crop.getId()));

            Set<Long> existingCropIds = existingCrops.stream().map(Crops::getId).collect(Collectors.toSet());
            Set<Long> newCropIds = plotUpdateDto.cropIds().stream()
                    .filter(newCropId -> !existingCropIds.contains(newCropId))
                    .collect(Collectors.toSet());

            if (!newCropIds.isEmpty()) {
                cropRepository.findAllById(newCropIds).forEach(plot.getCropsSet()::add);
            }
        }

        return plotMapper.toDto(plotRepository.save(plot));
    }

    @Override
    @PreAuthorize("plotSecurity.isPlotOwner(#id)")
    public boolean deletePlot(Long id) {
        if (plotRepository.existsById(id)) {
            plotRepository.deleteById(id);
            return true;
        }
        return false;
    }

}
