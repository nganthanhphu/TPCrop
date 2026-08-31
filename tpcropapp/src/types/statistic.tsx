export interface SeasonProgress {
    seasonId: number;
    season: string;
    crop: string;
    startYear: number;
    endYear: number;
    progress: number;
}

export interface UserStatistic {
    year: number;
    totalNewUsers: number;
    totalPlots: number;
    totalArea: number;
}