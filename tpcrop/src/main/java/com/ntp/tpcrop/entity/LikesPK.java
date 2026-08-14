/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ntp.tpcrop.entity;

import jakarta.persistence.Basic;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;

/**
 *
 * @author Joon
 */
@Embeddable
public class LikesPK implements Serializable {

    @Basic(optional = false)
    @Column(name = "user_id")
    private long userId;
    @Basic(optional = false)
    @Column(name = "article_id")
    private long articleId;

    public LikesPK() {
    }

    public LikesPK(long userId, long articleId) {
        this.userId = userId;
        this.articleId = articleId;
    }

    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    public long getArticleId() {
        return articleId;
    }

    public void setArticleId(long articleId) {
        this.articleId = articleId;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (int) userId;
        hash += (int) articleId;
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof LikesPK)) {
            return false;
        }
        LikesPK other = (LikesPK) object;
        if (this.userId != other.userId) {
            return false;
        }
        if (this.articleId != other.articleId) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.ntp.tpcrop.entity.LikesPK[ userId=" + userId + ", articleId=" + articleId + " ]";
    }
    
}
