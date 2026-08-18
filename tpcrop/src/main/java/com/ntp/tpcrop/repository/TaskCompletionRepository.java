package com.ntp.tpcrop.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ntp.tpcrop.entity.TaskCompletions;

public interface TaskCompletionRepository extends JpaRepository<TaskCompletions, Long> {

}
