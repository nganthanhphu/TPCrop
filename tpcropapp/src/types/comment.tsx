import type { User } from "./user";

export interface Comment {
    id: number;
    content: string;
    createdAt: string;
    updatedAt?: string;
    articleId: number;
    parentId?: number | null;
    user?: User;
}

export interface CommentCreate {
    content: string;
    articleId: number;
    parentId?: number | null;
}

export interface CommentUpdate {
    content: string;
}
