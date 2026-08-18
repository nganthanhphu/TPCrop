package com.ntp.tpcrop.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ntp.tpcrop.entity.Seasons;

public interface SeasonRepository extends JpaRepository<Seasons, Long> {

    @Query("SELECT s FROM Seasons s WHERE (s.cropId.id = :cropId OR :cropId IS NULL) ORDER BY s.startYear desc")
    Page<Seasons> getSeasons(Long cropId, Pageable pageable);

}
