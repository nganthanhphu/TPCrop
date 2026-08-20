package com.ntp.tpcrop.security;

import org.springframework.stereotype.Component;

import com.ntp.tpcrop.repository.TaskCompletionRepository;
import com.ntp.tpcrop.util.UserUtil;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class TaskCompletionSecurity {

    private final TaskCompletionRepository taskCompletionRepository;
    private final UserUtil userUtil;

    public boolean isTaskCompletionOwner(Long id) {
        Long currentUserId = userUtil.getCurrentUser().getId();
        return taskCompletionRepository.existsByIdAndPlotId_UserId_id(id, currentUserId);
    }

}
