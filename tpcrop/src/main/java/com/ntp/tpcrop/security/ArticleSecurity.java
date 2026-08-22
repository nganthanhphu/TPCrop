package com.ntp.tpcrop.security;

import org.springframework.stereotype.Component;

import com.ntp.tpcrop.repository.ArticleRepository;
import com.ntp.tpcrop.util.UserUtil;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ArticleSecurity {

    private final ArticleRepository articleRepository;
    private final UserUtil userUtil;

    public boolean isArticleOwner(Long articleId) {
        Long currentUserId = userUtil.getCurrentUser().getId();
        return articleRepository.existsByIdAndUserId_Id(articleId, currentUserId);   
    }


}
