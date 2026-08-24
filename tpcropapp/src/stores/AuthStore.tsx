import type { User } from "@/types/user";
import { Cookies } from "react-cookie";
import { create } from "zustand";

const cookies = new Cookies();

const cookiesOptions = {
    path: '/',
    maxAge: 86400,
    sameSite: 'lax' as const
};

export interface AuthState {
    token: string | null;
    user: User | null;
    isAuthenticated: boolean;
    login: (userData: User, token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    token: cookies.get("token") || null,
    user: cookies.get("user") || null,
    isAuthenticated: !!cookies.get("token"),

    login: (userData: User, token: string) => {
        cookies.set("token", token, cookiesOptions);
        cookies.set("user", userData, cookiesOptions);
        set({ token, user: userData, isAuthenticated: true });
    },

    logout: () => {
        cookies.remove("token", cookiesOptions);
        cookies.remove("user", cookiesOptions);
        set({ token: null, user: null, isAuthenticated: false });
    }
}));