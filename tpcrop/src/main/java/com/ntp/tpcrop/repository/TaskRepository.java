package com.ntp.tpcrop.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.ntp.tpcrop.entity.Tasks;
import org.springframework.data.jpa.repository.Query;

public interface TaskRepository extends JpaRepository<Tasks, Long> {

    @Query("SELECT t FROM Tasks t INNER JOIN t.seasonId s WHERE (t.seasonId.id = :seasonId OR :seasonId IS NULL) AND (s.cropId.id = :cropId OR :cropId IS NULL) ORDER BY t.startDate asc")
    Page<Tasks> getTasks(Long seasonId, Long cropId,
            Pageable pageable);

}
