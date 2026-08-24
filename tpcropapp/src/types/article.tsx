import type { User } from "./user";

export interface Article {
    id: number;
    title: string;
    likeCount: number;
    commentCount: number;
    createdAt: string;
    user?: User;
}

export interface ArticleDetail {
    id: number;
    title: string;
    content: string;
    likeCount: number;
    commentCount: number;
    createdAt: string;
    updatedAt?: string;
    user?: User;
}

export interface ArticleCreate {
    title: string;
    content: string;
    userId?: number;
}

export interface ArticleUpdate {
    title?: string;
    content?: string;
}
