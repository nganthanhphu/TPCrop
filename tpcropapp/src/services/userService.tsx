import type { PageResponse } from "@/types/common";
import type { UserLogin, UserLoginResponse, User, ManagerUserUpdate } from "@/types/user";
import { axiosClient } from "./axiosClient";
import endpoints from "./endpoints";
import type { AxiosPromise } from "axios";

export const loginWithPassword = (loginData: UserLogin): AxiosPromise<UserLoginResponse> => 
    axiosClient.post(endpoints.login, loginData);

export const getCurrentUser = (): AxiosPromise<User> =>
    axiosClient.get(endpoints.profile);

export const updateUserProfile = (userData: FormData): AxiosPromise<User> =>
    axiosClient.patch(endpoints.profile, userData);

export const register = (userData: FormData): AxiosPromise<UserLoginResponse> =>
    axiosClient.post(endpoints.register, userData);

export const getAllUsers = (params?: { page?: number; size?: number; sort?: string }): AxiosPromise<PageResponse<User>> =>
    axiosClient.get(endpoints.usersManagement, params);

export const updateUserByManager = (userId: number | string, data: ManagerUserUpdate): AxiosPromise<User> =>
    axiosClient.patch(endpoints.userManagement(userId), data);
