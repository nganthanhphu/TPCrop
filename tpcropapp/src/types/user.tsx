export interface User {
    id: number;
    username: string;
    email: string;
    fullName: string;
    avatar: string;
    role: string;
    active: boolean;
    joinedDate: string;
}

export interface UserCreate {
    username: string;
    password: string;
    email: string;
    fullName: string;
    avatar: File | null;
    role: string;
}

export interface UserUpdate {
    oldPassword: string;
    password: string;
    email: string;
    fullName: string;
    avatar: File | null;
}

export interface ManagerUserUpdate {
    active: boolean;
}

export interface UserLogin {
    username: string;
    password: string;
}

export interface UserLoginResponse {
    user: User;
    token: string;
}