package com.ntp.tpcrop.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ntp.tpcrop.entity.Likes;
import com.ntp.tpcrop.entity.LikesPK;

public interface LikeRepository extends JpaRepository<Likes, LikesPK> {

}
