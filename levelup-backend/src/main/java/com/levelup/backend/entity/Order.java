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
            @AttributeOverride(name = "edificio", column = @Column(name = "envio_edificio")),
            @AttributeOverride(name = "ciudad", column = @Column(name = "envio_ciudad")),
            @AttributeOverride(name = "comuna", column = @Column(name = "envio_comuna")),
            @AttributeOverride(name = "region", column = @Column(name = "envio_region")),
            @AttributeOverride(name = "codigoPostal", column = @Column(name = "envio_codigo_postal")),
            @AttributeOverride(name = "pais", column = @Column(name = "envio_pais")),
            @AttributeOverride(name = "telefono", column = @Column(name = "envio_telefono"))
    })
    private Address direccionEnvio;

    private String metodoPago;

    @Column(nullable = false)
    private LocalDateTime fechaCreacion;

    @PrePersist
    protected void onCreate() {
        fechaCreacion = LocalDateTime.now();
    }
}
