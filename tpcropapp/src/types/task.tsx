import type { Season } from "./season";
import type { Plot } from "./plot";

export interface Task {
    id: number;
    description: string;
    startDate: string;
    endDate: string;
    season?: Season;
}

export interface TaskDetail {
    id: number;
    description: string;
    startDate: string;
    endDate: string;
    season?: Season;
    isCompleted?: boolean;
}

export interface TaskCreate {
    description: string;
    startDate: string;
    endDate: string;
    seasonId: number;
}

export interface TaskUpdate {
    description?: string;
    startDate?: string;
    endDate?: string;
}

export interface TaskCompletion {
    id: number;
    task?: Task;
    plot?: Plot;
    timeCompleted: string;
}

export interface TaskCompletionCreate {
    plotId: number;
    taskId: number;
}
