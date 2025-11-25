package com.levelup.backend.repository;

import com.levelup.backend.entity.Redemption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RedemptionRepository extends JpaRepository<Redemption, Long> {
    List<Redemption> findByUserId(Long userId);

    List<Redemption> findByEstado(String estado);
}
