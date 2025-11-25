package com.levelup.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "events")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    private String nombre; // Alias

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(columnDefinition = "TEXT")
    private String descripcionCompleta;

    private LocalDateTime fecha;

    private String hora;
    private String horaInicio;
    private String horaFin;

    @Embedded
    private EventLocation ubicacion;

    private String organizador;

    private String tipo; // "torneo", "lanparty", etc.

    private Integer capacidad;
    private Integer capacidadMaxima;
    private Integer inscritos;

    private BigDecimal precio;

    private String imagen;

    @Builder.Default
    private Boolean activo = true;

    private String estado;

    private Integer puntosRecompensa;
    private Integer puntosGanables;

    @ElementCollection
    @CollectionTable(name = "event_tags", joinColumns = @JoinColumn(name = "event_id"))
    @Column(name = "tag")
    @Builder.Default
    private List<String> tags = new ArrayList<>();

    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;

    @Builder.Default
    private Boolean requiereInscripcion = false;

    private String enlaceTransmision;

    private String categoria;

    // Contenido adjunto flattened for simplicity or could be another embeddable
    private String slidesUrl;
    private String videoUrl;
    private String documentoUrl;

    @PrePersist
    protected void onCreate() {
        fechaCreacion = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        fechaActualizacion = LocalDateTime.now();
    }
}
