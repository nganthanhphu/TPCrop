package com.ntp.tpcrop.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ntp.tpcrop.entity.Seasons;

public interface SeasonRepository extends JpaRepository<Seasons, Long> {
    
}
