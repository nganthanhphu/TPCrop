/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ntp.tpcrop.entity;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.Table;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 *
 * @author Joon
 */
@Entity
@Table(name = "likes")
@NamedQueries({
    @NamedQuery(name = "Likes.findAll", query = "SELECT l FROM Likes l"),
    @NamedQuery(name = "Likes.findByUserId", query = "SELECT l FROM Likes l WHERE l.likesPK.userId = :userId"),
    @NamedQuery(name = "Likes.findByArticleId", query = "SELECT l FROM Likes l WHERE l.likesPK.articleId = :articleId"),
    @NamedQuery(name = "Likes.findByCreatedAt", query = "SELECT l FROM Likes l WHERE l.createdAt = :createdAt")})
public class Likes implements Serializable {

    private static final long serialVersionUID = 1L;
    @EmbeddedId
    protected LikesPK likesPK;
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    @JoinColumn(name = "article_id", referencedColumnName = "id", insertable = false, updatable = false)
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private Articles articles;
    @JoinColumn(name = "user_id", referencedColumnName = "id", insertable = false, updatable = false)
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private Users user;

    public Likes() {
    }

    public Likes(LikesPK likesPK) {
        this.likesPK = likesPK;
    }

    public Likes(long userId, long articleId) {
        this.likesPK = new LikesPK(userId, articleId);
    }

    public LikesPK getLikesPK() {
        return likesPK;
    }

    public void setLikesPK(LikesPK likesPK) {
        this.likesPK = likesPK;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Articles getArticles() {
        return articles;
    }

    public void setArticles(Articles articles) {
        this.articles = articles;
    }

    public Users getUser() {
        return user;
    }

    public void setUser(Users user) {
        this.user = user;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (likesPK != null ? likesPK.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof Likes)) {
            return false;
        }
        Likes other = (Likes) object;
        if ((this.likesPK == null && other.likesPK != null) || (this.likesPK != null && !this.likesPK.equals(other.likesPK))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.ntp.tpcrop.entity.Likes[ likesPK=" + likesPK + " ]";
    }
    
}
