package com.levelup.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String codigo;

    @Column(nullable = false)
    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(nullable = false)
    private BigDecimal precio;

    @Column(nullable = false)
    private Integer stock;

    private String categoria;

    private String marca;

    private Integer puntos; // Costo en puntos para canje

    @Builder.Default
    private Boolean activo = true;

    @Builder.Default
    private Boolean canjeable = false;

    @Builder.Default
    private String origen = "tienda"; // "tienda" | "recompensas"

    @Builder.Default
    private Double rating = 0.0;

    private String imagen; // Matches frontend 'imagen' field
}
