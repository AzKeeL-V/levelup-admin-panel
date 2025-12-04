package com.levelup.backend.dto;

import com.levelup.backend.entity.Address;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateOrderRequest {
    private Map<Long, Integer> items; // ProductID -> Quantity
    private Address direccionEnvio;
    private String metodoPago;

    // Calculated values from frontend
    private BigDecimal subtotal;
    private BigDecimal descuentoDuoc;
    private BigDecimal descuentoPuntos;
    private BigDecimal total;
    private Integer puntosUsados;
    private Integer puntosGanados;
    private String notas;

    // Optional fields for admin context
    private String creadoPor;
    private Long adminId;
    private String adminNombre;

    // Optional fields for client creation/lookup (POS)
    private String userEmail;
    private String userName;
    private String userRut;
    private String userPhone;
}
