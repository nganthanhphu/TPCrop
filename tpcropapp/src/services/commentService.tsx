import type { Comment, CommentCreate, CommentUpdate } from "@/types/comment";
import type { PageResponse } from "@/types/common";
import { axiosClient } from "./axiosClient";
import endpoints from "./endpoints";
import type { AxiosPromise } from "axios";

export const getComments = (
    articleId: number | string,
    params?: {
        parentId?: number;
        page?: number;
        size?: number;
        sort?: string;
    }
): AxiosPromise<PageResponse<Comment>> =>
    axiosClient.get(endpoints.articleComments(articleId), params);

export const createComment = (
    articleId: number | string,
    data: CommentCreate
): AxiosPromise<Comment> =>
    axiosClient.post(endpoints.createArticleComment(articleId), data);

export const updateComment = (
    commentId: number | string,
    data: CommentUpdate
): AxiosPromise<Comment> =>
    axiosClient.patch(endpoints.commentManagement(commentId), data);

export const deleteComment = (commentId: number | string): AxiosPromise<void> =>
    axiosClient.delete(endpoints.commentManagement(commentId));
