package com.levelup.backend.repository;

import com.levelup.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategoria(String categoria);

    List<Product> findByNombreContainingIgnoreCase(String nombre);

    java.util.Optional<Product> findByCodigo(String codigo);
}
