import type { Article, ArticleDetail, ArticleCreate, ArticleUpdate, ArticleLikeStatus } from "@/types/article";
import type { PageResponse } from "@/types/common";
import { axiosClient } from "./axiosClient";
import endpoints from "./endpoints";
import type { AxiosPromise } from "axios";

export const getArticles = (params?: {
    cropId?: number;
    userId?: number;
    keyword?: string;
    sortBy?: string;
    page?: number;
    size?: number;
    sort?: string;
}): AxiosPromise<PageResponse<Article>> =>
    axiosClient.get(endpoints.articles, params);

export const getArticleById = (articleId: number | string): AxiosPromise<ArticleDetail> =>
    axiosClient.get(endpoints.article(articleId));

export const createArticle = (data: ArticleCreate): AxiosPromise<ArticleDetail> =>
    axiosClient.post(endpoints.articlesManagement, data);

export const updateArticle = (articleId: number | string, data: ArticleUpdate): AxiosPromise<ArticleDetail> =>
    axiosClient.patch(endpoints.articleManagement(articleId), data);

export const deleteArticle = (articleId: number | string): AxiosPromise<void> =>
    axiosClient.delete(endpoints.articleManagement(articleId));

export const getArticleLikeStatus = (articleId: number | string): AxiosPromise<ArticleLikeStatus> =>
    axiosClient.get(endpoints.articleLikes(articleId));

export const likeArticle = (articleId: number | string): AxiosPromise<ArticleLikeStatus> =>
    axiosClient.post(endpoints.articleLikes(articleId));

export const unlikeArticle = (articleId: number | string): AxiosPromise<void> =>
    axiosClient.delete(endpoints.articleLikes(articleId));
