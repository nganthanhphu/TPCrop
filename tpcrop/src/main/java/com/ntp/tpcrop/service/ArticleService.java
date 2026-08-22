 package com.ntp.tpcrop.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.ntp.tpcrop.dto.request.ArticleCreateDto;
import com.ntp.tpcrop.dto.request.ArticleUpdateDto;
import com.ntp.tpcrop.dto.response.ArticleDetailViewDto;
import com.ntp.tpcrop.dto.response.ArticleViewDto;

public interface ArticleService {

    ArticleDetailViewDto addArticle(ArticleCreateDto articleCreateDto);

    ArticleDetailViewDto getArticleById(Long id);

    Page<ArticleViewDto> getArticles(Long cropId, Long userId, String keyword, String sortBy, Pageable pageable);

    ArticleDetailViewDto updateArticle(Long id, ArticleUpdateDto articleUpdateDto);

    boolean deleteArticle(Long id);

}
