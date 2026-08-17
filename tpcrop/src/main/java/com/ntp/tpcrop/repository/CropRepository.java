package com.ntp.tpcrop.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ntp.tpcrop.entity.Crops;

public interface CropRepository extends JpaRepository<Crops, Long> {

}
