package com.ntp.tpcrop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ntp.tpcrop.entity.TaskCompletions;

public interface TaskCompletionRepository extends JpaRepository<TaskCompletions, Long> {

    boolean existsByIdAndPlotId_UserId_id(Long id, Long userId);

        @Modifying
        @Query(value = """
                        INSERT INTO task_completions (plot_id, task_id, time_completed)
                        SELECT DISTINCT pc.plot_id, t.id, CURRENT_TIMESTAMP
                        FROM plot_crops pc
                        INNER JOIN seasons s ON s.crop_id = pc.crop_id
                        INNER JOIN tasks t ON t.season_id = s.id
                        WHERE pc.plot_id = :plotId
                            AND s.end_year < EXTRACT(YEAR FROM CURRENT_DATE)
                        ON CONFLICT (plot_id, task_id) DO NOTHING
                        """, nativeQuery = true)
        int completeTasksFromOldSeasons(@Param("plotId") Long plotId);

}
