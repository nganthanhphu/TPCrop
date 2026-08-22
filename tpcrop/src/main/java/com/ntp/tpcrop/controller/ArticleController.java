package com.ntp.tpcrop.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ntp.tpcrop.dto.request.ArticleCreateDto;
import com.ntp.tpcrop.dto.request.ArticleUpdateDto;
import com.ntp.tpcrop.dto.response.ArticleDetailViewDto;
import com.ntp.tpcrop.dto.response.ArticleViewDto;
import com.ntp.tpcrop.service.ArticleService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequiredArgsConstructor
@RequestMapping("/api")
public class ArticleController {

    private final ArticleService articleService;

    @PostMapping("/secure/articles")
    public ResponseEntity<ArticleDetailViewDto> createArticle(@RequestBody @Valid ArticleCreateDto articleCreateDto) {

        ArticleDetailViewDto article = articleService.addArticle(articleCreateDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(article);
    }

    @GetMapping("/articles/{id}")
    public ResponseEntity<ArticleDetailViewDto> getArticleById(@PathVariable Long id) {
        ArticleDetailViewDto article = articleService.getArticleById(id);
        return ResponseEntity.ok(article);
    }

    @GetMapping("/articles")
    public ResponseEntity<Page<ArticleViewDto>> getArticles(@RequestParam(required = false) Long cropId,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String sortBy,
            Pageable pageable) {
        Page<ArticleViewDto> articles = articleService.getArticles(cropId, userId, keyword, sortBy, pageable);
        return ResponseEntity.ok(articles);
    }

    @PatchMapping("/secure/articles/{id}")
    public ResponseEntity<ArticleDetailViewDto> updateArticle(@PathVariable Long id,
            @RequestBody @Valid ArticleUpdateDto articleUpdateDto) {
        ArticleDetailViewDto updatedArticle = articleService.updateArticle(id, articleUpdateDto);
        return ResponseEntity.ok(updatedArticle);
    }

    @DeleteMapping("/secure/articles/{id}")
    public ResponseEntity<?> deleteArticle(@PathVariable Long id) {
        boolean deleted = articleService.deleteArticle(id);
        if (deleted) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

}
