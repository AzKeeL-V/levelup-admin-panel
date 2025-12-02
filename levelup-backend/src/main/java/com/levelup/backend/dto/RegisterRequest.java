package com.levelup.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    private String nombre;
    private String email;
    private String password;
    private String telefono;
    private String rut;
    private String codigoReferido;
    private String referidoPor;

    // Address fields
    private String calle;
    private String numero;
    private String ciudad;
    private String region;
}
