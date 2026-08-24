package com.ntp.tpcrop.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.ntp.tpcrop.entity.Plots;
import org.springframework.data.jpa.repository.Query;

public interface PlotRepository extends JpaRepository<Plots, Long> {

    @Query("""
                SELECT DISTINCT p
                FROM Plots p
                LEFT JOIN p.cropsSet cs
                WHERE (:cropId IS NULL OR cs.id = :cropId)
                AND (:userId IS NULL OR p.userId.id = :userId)
            """)
    Page<Plots> findByCropId_IdAndUserId_Id(Long cropId, Long userId, Pageable pageable);

    boolean existsByIdAndUserId_Id(Long plotId, Long userId);

}
