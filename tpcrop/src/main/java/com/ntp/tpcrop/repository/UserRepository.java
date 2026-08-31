package com.ntp.tpcrop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ntp.tpcrop.dto.response.UserStatsViewDto;
import com.ntp.tpcrop.entity.Users;

public interface UserRepository extends JpaRepository<Users, Long> {

    Users findByUsername(String username);

    @Query("""
            SELECT new com.ntp.tpcrop.dto.response.UserStatsViewDto(
                :year,
                COUNT(DISTINCT u.id),
                COUNT(DISTINCT p.id),
                COALESCE(SUM(p.size), 0.0)
            )
            FROM Users u
            LEFT JOIN Plots p on p.userId.id = u.id
            WHERE u.role = 'FARMER'
            AND YEAR(u.joinedDate) = :year
            AND (
                :cropId IS NULL
                OR EXISTS (
                    SELECT 1
                    FROM p.cropsSet c
                    WHERE c.id = :cropId
                )
            )
            """)
    UserStatsViewDto getUserStats(int year, Long cropId);

}
