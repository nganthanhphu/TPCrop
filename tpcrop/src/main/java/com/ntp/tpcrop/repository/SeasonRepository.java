package com.ntp.tpcrop.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ntp.tpcrop.dto.response.SeasonProgressViewDto;
import com.ntp.tpcrop.entity.Seasons;

public interface SeasonRepository extends JpaRepository<Seasons, Long> {

    @Query("SELECT s FROM Seasons s WHERE (s.cropId.id = :cropId OR :cropId IS NULL) ORDER BY s.startYear desc")
    Page<Seasons> getSeasons(Long cropId, Pageable pageable);

    @Query("""
                SELECT new com.ntp.tpcrop.dto.response.SeasonProgressViewDto(
                    s.id,
                    s.name,
                    c.name,
                    s.startYear,
                    s.endYear,
                    CASE 
                        WHEN (SIZE(s.tasksSet) * SIZE(c.plotsSet)) = 0 THEN 0.0
                        ELSE (COUNT(DISTINCT tc.id) * 100.0 / (SIZE(s.tasksSet) * SIZE(c.plotsSet)))
                    END
                )
                FROM Seasons s
                JOIN s.cropId c
                LEFT JOIN s.tasksSet t
                LEFT JOIN t.taskCompletionsSet tc
                WHERE s.startYear <= :targetYear AND s.endYear >= :targetYear AND (s.cropId.id = :cropId OR :cropId IS NULL)
                GROUP BY s.id, s.name, c.id, c.name, s.startYear, s.endYear
                ORDER BY s.name ASC
            """)
    List<SeasonProgressViewDto> getSeasonProgressByYear(Long cropId, int targetYear);

}
