import type { Crop } from "./crop";
import type { User } from "./user";

export interface Plot {
    id: number;
    size: number;
    address: string;
    crop?: Crop;
    user?: User;
}

export interface PlotCreate {
    size: number;
    address: string;
    cropId: number;
}

export interface PlotUpdate {
    size?: number;
    address?: string;
    cropId?: number;
}
