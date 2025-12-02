package com.levelup.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "payment_methods")
@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentMethod {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String tipo; // "tarjeta", "transferencia", "efectivo", "paypal"

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "numero", column = @Column(name = "tarjeta_numero")),
            @AttributeOverride(name = "fechaExpiracion", column = @Column(name = "tarjeta_fecha_expiracion")),
            @AttributeOverride(name = "titular", column = @Column(name = "tarjeta_titular"))
    })
    private CardDetails tarjeta;

    private String banco;
    private String cuenta;
    private String emailPaypal;

    private boolean esPredeterminado;
}
