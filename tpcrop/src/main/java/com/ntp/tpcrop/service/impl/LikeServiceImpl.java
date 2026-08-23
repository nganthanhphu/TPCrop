package com.ntp.tpcrop.service.impl;

import org.springframework.stereotype.Service;

import com.ntp.tpcrop.entity.Articles;
import com.ntp.tpcrop.entity.Likes;
import com.ntp.tpcrop.entity.LikesPK;
import com.ntp.tpcrop.repository.ArticleRepository;
import com.ntp.tpcrop.repository.LikeRepository;
import com.ntp.tpcrop.service.LikeService;
import com.ntp.tpcrop.util.UserUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LikeServiceImpl implements LikeService {

    private final LikeRepository likeRepository;
    private final ArticleRepository articleRepository;
    private final UserUtil userUtil;

    @Override
    public void LikeArticle(Long articleId) {
        LikesPK linesPK = new LikesPK();
        linesPK.setArticleId(articleId);

        Long currentUserId = userUtil.getCurrentUser().getId();
        linesPK.setUserId(currentUserId);
        likeRepository.save(new Likes(linesPK));

        Articles article = articleRepository.findById(articleId).get();
        article.setLikeCount(article.getLikeCount() + 1);
        articleRepository.save(article);
    }

    @Override
    public void UnlikeArticle(Long articleId) {
        LikesPK linesPK = new LikesPK();
        linesPK.setArticleId(articleId);

        Long currentUserId = userUtil.getCurrentUser().getId();
        linesPK.setUserId(currentUserId);
        
        if (likeRepository.existsById(linesPK)) {
            likeRepository.deleteById(linesPK);
            Articles article = articleRepository.findById(articleId).get();
            article.setLikeCount(article.getLikeCount() - 1);
            articleRepository.save(article);
        }
    }

    @Override
    public boolean isArticleLikedByCurrentUser(Long articleId) {
        Long currentUserId = userUtil.getCurrentUser().getId();
        LikesPK linesPK = new LikesPK();
        linesPK.setArticleId(articleId);
        linesPK.setUserId(currentUserId);
        return likeRepository.existsById(linesPK);
    }

}
