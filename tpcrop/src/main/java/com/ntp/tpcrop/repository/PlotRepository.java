package com.ntp.tpcrop.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.ntp.tpcrop.entity.Plots;
import org.springframework.data.jpa.repository.Query;

public interface PlotRepository extends JpaRepository<Plots, Long> {
    
    @Query("SELECT p FROM Plots p WHERE (p.cropId.id = :cropId OR :cropId IS NULL) AND (p.userId.id = :userId OR :userId IS NULL)")
    Page<Plots> findByCropId_IdAndUserId_Id(Long cropId, Long userId, Pageable pageable);

    boolean existsByIdAndUserId_Id(Long plotId, Long userId);
    
}
