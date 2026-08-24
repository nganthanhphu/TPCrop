import type { PageResponse } from "@/types/common";
import { axiosClient } from "./axiosClient";
import endpoints from "./endpoints";
import type { AxiosPromise } from "axios";
import type { Plot, PlotCreate, PlotUpdate } from "@/types/plot";

export const getPlots = (params?: { cropId?: number; page?: number; size?: number; sort?: string }): AxiosPromise<PageResponse<Plot>> =>
    axiosClient.get(endpoints.plots, params);

export const addMyPlot = (data: PlotCreate): AxiosPromise<Plot> =>
    axiosClient.post(endpoints.plots, data);

export const updatePlot = (plotId: number | string, data: PlotUpdate): AxiosPromise<Plot> =>
    axiosClient.patch(endpoints.plotManagement(plotId), data);

export const deletePlot = (plotId: number | string): AxiosPromise<void> =>
    axiosClient.delete(endpoints.plotManagement(plotId));
