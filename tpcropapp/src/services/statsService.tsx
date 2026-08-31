import type { SeasonProgress, UserStatistic } from "@/types/statistic";
import type { AxiosPromise } from "axios";
import { axiosClient } from "./axiosClient";
import endpoints from "./endpoints";

export const getSeasonProgress = (params: { cropId: number; year: number }): AxiosPromise<SeasonProgress[]> =>
    axiosClient.get(endpoints.seasonProgress, params);

export const getUserStats = (params: { year: number, cropId: number }): AxiosPromise<UserStatistic> =>
    axiosClient.get(endpoints.userStats, params);