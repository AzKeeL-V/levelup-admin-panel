package com.levelup.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private Long id;
    private String token;
    private String email;
    private String nombre;
    private String role;
    private String rut;
    private Integer puntos;
    private String nivel;
    private String tipo;
    private String telefono;
    private Boolean activo;
}
