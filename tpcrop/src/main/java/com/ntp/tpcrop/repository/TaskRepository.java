package com.ntp.tpcrop.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ntp.tpcrop.entity.Tasks;

public interface TaskRepository extends JpaRepository<Tasks, Long> {

}
