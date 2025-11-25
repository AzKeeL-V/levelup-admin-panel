package com.levelup.backend.dto;

import com.levelup.backend.entity.Address;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateOrderRequest {
    private Map<Long, Integer> items; // ProductID -> Quantity
    private Address direccionEnvio;
    private String metodoPago;
}
