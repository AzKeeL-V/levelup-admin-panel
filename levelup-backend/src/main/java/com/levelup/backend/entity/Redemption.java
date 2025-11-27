package com.levelup.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "redemptions")
public class Redemption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private Integer puntosUsados;

    @Builder.Default
    private Integer cantidad = 1;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "nombre", column = @Column(name = "envio_nombre")),
            @AttributeOverride(name = "calle", column = @Column(name = "envio_calle")),
            @AttributeOverride(name = "numero", column = @Column(name = "envio_numero")),
            @AttributeOverride(name = "apartamento", column = @Column(name = "envio_apartamento")),
            @AttributeOverride(name = "edificio", column = @Column(name = "envio_edificio")),
            @AttributeOverride(name = "ciudad", column = @Column(name = "envio_ciudad")),
            @AttributeOverride(name = "comuna", column = @Column(name = "envio_comuna")),
            @AttributeOverride(name = "region", column = @Column(name = "envio_region")),
            @AttributeOverride(name = "codigoPostal", column = @Column(name = "envio_codigo_postal")),
            @AttributeOverride(name = "pais", column = @Column(name = "envio_pais"))
    })
    private Address direccionEnvio;

    private String metodoRetiro; // "retiro" | "envio"

    private String estado; // "pendiente" | "confirmado" | "enviado" | "entregado" | "cancelado"

    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;

    @Column(columnDefinition = "TEXT")
    private String notas;

    @PrePersist
    protected void onCreate() {
        fechaCreacion = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        fechaActualizacion = LocalDateTime.now();
    }
}
