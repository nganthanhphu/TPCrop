package com.ntp.tpcrop.service.impl;

import java.time.LocalDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import com.ntp.tpcrop.dto.request.ArticleCreateDto;
import com.ntp.tpcrop.dto.request.ArticleUpdateDto;
import com.ntp.tpcrop.dto.response.ArticleDetailViewDto;
import com.ntp.tpcrop.dto.response.ArticleViewDto;
import com.ntp.tpcrop.entity.Articles;
import com.ntp.tpcrop.repository.ArticleRepository;
import com.ntp.tpcrop.repository.UserRepository;
import com.ntp.tpcrop.service.ArticleService;
import com.ntp.tpcrop.service.mapper.ArticleMapper;
import com.ntp.tpcrop.util.UserUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ArticleServiceImpl implements ArticleService {

    private final ArticleRepository articleRepository;
    private final ArticleMapper articleMapper;
    private final UserRepository userRepository;
    private final UserUtil userUtil;

    @Override
    public ArticleDetailViewDto addArticle(ArticleCreateDto articleCreateDto) {
        Articles article = new Articles();
        article.setTitle(articleCreateDto.title());
        article.setContent(articleCreateDto.content());
        article.setLikeCount(0);
        article.setCommentCount(0);
        article.setCreatedAt(LocalDateTime.now());

        Long userId  = userUtil.getCurrentUser().getId();
        article.setUserId(userRepository.getReferenceById(userId));
        
        Articles savedArticle = articleRepository.save(article);
        return articleMapper.toDetailViewDto(savedArticle);
    }

    @Override
    public ArticleDetailViewDto getArticleById(Long id) {
        Articles article = articleRepository.findById(id).get();
        return articleMapper.toDetailViewDto(article);
    }

    @Override
    public Page<ArticleViewDto> getArticles(Long cropId, Long userId, String keyword, String sortBy,
            Pageable pageable) {
        if (sortBy == null || sortBy.isEmpty()) {
            sortBy = "createdAt";
        }
        Sort sort;
        switch (sortBy) {
            case "likeCount":
                sort = Sort.by(Sort.Direction.DESC, "likeCount");
                break;
            case "commentCount":
                sort = Sort.by(Sort.Direction.DESC, "commentCount");
                break;
            case "createdAt":
                sort = Sort.by(Sort.Direction.DESC, "createdAt");
                break;
            default:
                sort = Sort.by(Sort.Direction.DESC, "createdAt");
        }

        Page<Articles> articles = articleRepository.getArticles(cropId, userId, keyword, sort, pageable);
        return articles.map(articleMapper::toViewDto);
    }

    @Override
    @PreAuthorize("@articleSecurity.isArticleOwner(#id)")
    public ArticleDetailViewDto updateArticle(Long id, ArticleUpdateDto articleUpdateDto) {
        Articles article = articleRepository.findById(id).get();
        articleMapper.updateEntityFromDto(articleUpdateDto, article);
        article.setUpdatedAt(LocalDateTime.now());
        Articles updatedArticle = articleRepository.save(article);
        return articleMapper.toDetailViewDto(updatedArticle);
    }

    @Override
    @PreAuthorize("@articleSecurity.isArticleOwner(#id) or hasRole('MANAGER')")
    public boolean deleteArticle(Long id) {
        if (articleRepository.existsById(id)) {
            articleRepository.deleteById(id);
            return true;
        } else {
            return false;
        }
    }

}
