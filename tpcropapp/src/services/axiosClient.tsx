import { useAuthStore } from "@/stores/AuthStore";
import axios from "axios";

const client = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

client.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    }
)

export const axiosClient = {
    get: (url: string, params?: Record<string, unknown>) => {
        return client.get(url, { params });
    },
    post: (url: string, data?: unknown) => {
        return client.post(url, data);
    },
    patch: (url: string, data?: unknown) => {
        return client.patch(url, data);
    },
    delete: (url: string) => {
        return client.delete(url);
    }
}