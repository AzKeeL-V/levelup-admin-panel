package com.levelup.backend.repository;

import com.levelup.backend.entity.Blog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BlogRepository extends JpaRepository<Blog, Long> {
    List<Blog> findByTipo(String tipo);

    List<Blog> findByEstado(String estado);
}
