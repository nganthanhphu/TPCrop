import type { Crop } from "./crop";
import type { User } from "./user";

export interface Plot {
    id: number;
    size: number;
    address: string;
    crops?: Crop[];
    user?: User;
}

export interface PlotCreate {
    size: number;
    address: string;
    cropIds: number[];
}

export interface PlotUpdate {
    size?: number;
    address?: string;
    cropIds?: number[];
}
