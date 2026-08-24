import type { Crop } from "./crop";

export interface Season {
    id: number;
    name: string;
    startYear: number;
    endYear: number;
    crop?: Crop;
}

export interface SeasonCreate {
    name: string;
    startYear: number;
    endYear: number;
    cropId: number;
}

export interface SeasonUpdate {
    name?: string;
    startYear?: number;
    endYear?: number;
}
