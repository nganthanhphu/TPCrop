package com.ntp.tpcrop.service;

public interface LikeService {

    void LikeArticle(Long articleId);

    void UnlikeArticle(Long articleId);

    boolean isArticleLikedByCurrentUser(Long articleId);

}
