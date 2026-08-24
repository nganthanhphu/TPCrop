package com.ntp.tpcrop.repository;

import java.time.LocalDate;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.ntp.tpcrop.dto.response.TaskDetailViewDto;
import com.ntp.tpcrop.entity.Tasks;
import org.springframework.data.jpa.repository.Query;

public interface TaskRepository extends JpaRepository<Tasks, Long> {

    @Query("SELECT t FROM Tasks t INNER JOIN t.seasonId s WHERE (t.seasonId.id = :seasonId OR :seasonId IS NULL) AND (s.cropId.id = :cropId OR :cropId IS NULL) ORDER BY t.startDate asc")
    Page<Tasks> getTasks(Long seasonId, Long cropId,
            Pageable pageable);

    @Query("""
                SELECT new com.ntp.tpcrop.dto.response.TaskDetailViewDto(t.id, t.description, t.startDate, t.endDate,
                new com.ntp.tpcrop.dto.response.SeasonViewDto(s.id, s.name, s.startYear, s.endYear,
                new com.ntp.tpcrop.dto.response.CropViewDto(c.id, c.name, c.isSupportChatbot)),
                CASE WHEN tc IS NOT NULL THEN true ELSE false END)
                FROM Tasks t
                LEFT JOIN t.taskCompletionsSet tc ON tc.plotId.id = :plotId
                INNER JOIN t.seasonId s
                INNER JOIN s.cropId c
                INNER JOIN c.plotsSet p
                WHERE p.id = :plotId
                AND (:isCompleted IS NULL OR (CASE WHEN tc IS NOT NULL THEN true ELSE false END) = :isCompleted)
                AND (:cropId IS NULL OR c.id = :cropId)
                AND (:targetDate IS NULL OR t.startDate <= :targetDate AND t.endDate >= :targetDate)
                ORDER BY t.startDate asc
            """)
    Page<TaskDetailViewDto> getDetailedTasks(Long plotId, Long cropId, LocalDate targetDate, Boolean isCompleted, Pageable pageable);

}