package com.levelup.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "blogs")
public class Blog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String tipo; // "video" | "nota" | "evento"

    @Column(nullable = false)
    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    private LocalDateTime fecha;

    private Integer puntos;

    private String estado; // "activo" | "finalizado" | "programado"

    private String imagen;

    private String videoUrl;

    @Column(columnDefinition = "TEXT")
    private String contenidoCompleto;

    private String autor;

    private Integer tiempoLectura;

    private String categoria;

    @ElementCollection
    @CollectionTable(name = "blog_tags", joinColumns = @JoinColumn(name = "blog_id"))
    @Column(name = "tag")
    @Builder.Default
    private List<String> etiquetas = new ArrayList<>();

    private String direccion;

    private String horaInicio;

    private String horaFin;

    private String ubicacionUrl;
}
