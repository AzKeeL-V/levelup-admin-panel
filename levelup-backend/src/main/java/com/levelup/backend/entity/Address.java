package com.levelup.backend.entity;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import lombok.NoArgsConstructor;

@Embeddable
@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Address {
    private String nombre; // Nombre del destinatario o alias de la dirección
    private String calle;
    private String numero;
    private String apartamento;
    private String ciudad;
    private String region;
    private String telefono;

}
