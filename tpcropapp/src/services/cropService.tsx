import type { PageResponse } from "@/types/common";
import type { Crop, CropCreate, CropUpdate } from "@/types/crop";
import { axiosClient } from "./axiosClient";
import endpoints from "./endpoints";
import type { AxiosPromise } from "axios";

export const getCrops = (params?: { name?: string; page?: number; size?: number; sort?: string }): AxiosPromise<PageResponse<Crop>> =>
    axiosClient.get(endpoints.crops, params);

export const addCrop = (data: CropCreate): AxiosPromise<Crop> =>
    axiosClient.post(endpoints.cropsManagement, data);

export const updateCrop = (cropId: number | string, data: CropUpdate): AxiosPromise<Crop> =>
    axiosClient.patch(endpoints.cropManagement(cropId), data);

export const deleteCrop = (cropId: number | string): AxiosPromise<void> =>
    axiosClient.delete(endpoints.cropManagement(cropId));
