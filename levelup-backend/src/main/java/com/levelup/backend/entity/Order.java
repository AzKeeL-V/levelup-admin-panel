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
@Table(name = "orders")
@com.fasterxml.jackson.annotation.JsonIdentityInfo(generator = com.fasterxml.jackson.annotation.ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OrderItem> items = new ArrayList<>();

    @Column(nullable = false)
    private BigDecimal subtotal;

    @Builder.Default
    private BigDecimal descuentoDuoc = BigDecimal.ZERO;

    @Builder.Default
    private BigDecimal descuentoPuntos = BigDecimal.ZERO;

    @Column(nullable = false)
    private BigDecimal total;

    @Builder.Default
    private Integer puntosUsados = 0;

    @Builder.Default
    private Integer puntosGanados = 0;

    @Column(nullable = false)
    private String estado; // pendiente, pagado, enviado, entregado

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "nombre", column = @Column(name = "envio_nombre")),
            @AttributeOverride(name = "calle", column = @Column(name = "envio_calle")),
            @AttributeOverride(name = "numero", column = @Column(name = "envio_numero")),
            @AttributeOverride(name = "apartamento", column = @Column(name = "envio_apartamento")),
            @AttributeOverride(name = "ciudad", column = @Column(name = "envio_ciudad")),
            @AttributeOverride(name = "region", column = @Column(name = "envio_region"))
    })
    private Address direccionEnvio;

    private String metodoPago;

    @Column(nullable = false)
    @com.fasterxml.jackson.annotation.JsonFormat(shape = com.fasterxml.jackson.annotation.JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime fechaCreacion;

    @Column(columnDefinition = "TEXT")
    private String notas;

    @Column(unique = true, nullable = false)
    private String numeroOrden;

    private String creadoPor; // "usuario" | "admin"
    private Long adminId;
    private String adminNombre;

    @PrePersist
    protected void onCreate() {
        fechaCreacion = LocalDateTime.now();
        fechaActualizacion = LocalDateTime.now();
        if (numeroOrden == null) {
            // Generar número de orden único: ORD-YYYYMMDD-XXXXX
            String timestamp = LocalDateTime.now().format(
                    java.time.format.DateTimeFormatter.ofPattern("yyyyMMdd"));
            String random = String.format("%05d", (int) (Math.random() * 100000));
            numeroOrden = "ORD-" + timestamp + "-" + random;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        fechaActualizacion = LocalDateTime.now();
    }

    @Column
    @com.fasterxml.jackson.annotation.JsonFormat(shape = com.fasterxml.jackson.annotation.JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @com.fasterxml.jackson.annotation.JsonProperty(access = com.fasterxml.jackson.annotation.JsonProperty.Access.READ_ONLY)
    private LocalDateTime fechaActualizacion;
}
