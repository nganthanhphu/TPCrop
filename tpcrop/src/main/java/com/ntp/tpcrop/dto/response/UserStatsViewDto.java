package com.ntp.tpcrop.dto.response;

public record UserStatsViewDto(
   Integer year,
   Long totalNewUsers,
   Long totalPlots,
   Double totalArea 
) {

}
