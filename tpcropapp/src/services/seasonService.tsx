import type { PageResponse } from "@/types/common";
import { axiosClient } from "./axiosClient";
import endpoints from "./endpoints";
import type { AxiosPromise } from "axios";
import type { Season, SeasonCreate, SeasonUpdate } from "@/types/season";

export const getSeasons = (params: { cropId: number; page?: number; size?: number; sort?: string }): AxiosPromise<PageResponse<Season>> =>
    axiosClient.get(endpoints.seasons, params);

export const addSeason = (data: SeasonCreate): AxiosPromise<Season> =>
    axiosClient.post(endpoints.seasonsManagement, data);

export const updateSeason = (seasonId: number | string, data: SeasonUpdate): AxiosPromise<Season> =>
    axiosClient.patch(endpoints.seasonManagement(seasonId), data);

export const deleteSeason = (seasonId: number | string): AxiosPromise<void> =>
    axiosClient.delete(endpoints.seasonManagement(seasonId));
