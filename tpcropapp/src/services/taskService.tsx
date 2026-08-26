import type { PageResponse } from "@/types/common";
import type { Task, TaskCreate, TaskUpdate, TaskDetail, TaskCompletionCreate, TaskCompletion } from "@/types/task";
import { axiosClient } from "./axiosClient";
import endpoints from "./endpoints";
import type { AxiosPromise } from "axios";

export const getTasksByManager = (params: {
    seasonId: number;
    page?: number;
    size?: number;
    sort?: string;
}): AxiosPromise<PageResponse<Task>> =>
    axiosClient.get(endpoints.tasksManagement, params);

export const addTask = (data: TaskCreate): AxiosPromise<Task> =>
    axiosClient.post(endpoints.tasksManagement, data);

export const updateTask = (taskId: number | string, data: TaskUpdate): AxiosPromise<Task> =>
    axiosClient.patch(endpoints.taskManagement(taskId), data);

export const deleteTask = (taskId: number | string): AxiosPromise<void> =>
    axiosClient.delete(endpoints.taskManagement(taskId));

export const getDetailedTasks = (params: {
    plotId: number;
    cropId?: number;
    targetDate?: string;
    isCompleted?: boolean;
    page?: number;
    size?: number;
    sort?: string;
}): AxiosPromise<PageResponse<TaskDetail>> =>
    axiosClient.get(endpoints.myTasks, params);

export const completeTask = (data: TaskCompletionCreate): AxiosPromise<TaskCompletion> =>
    axiosClient.post(endpoints.taskCompletions, data);

export const deleteTaskCompletion = (taskCompletionId: number | string): AxiosPromise<void> =>
    axiosClient.delete(endpoints.taskCompletionManagement(taskCompletionId));
