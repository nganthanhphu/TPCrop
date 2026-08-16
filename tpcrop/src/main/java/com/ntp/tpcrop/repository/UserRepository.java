package com.ntp.tpcrop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.ntp.tpcrop.entity.Users;

public interface UserRepository extends JpaRepository<Users, Long> {

    Users findByUsername(String username);

}
