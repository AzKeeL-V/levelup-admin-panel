package com.levelup.backend.controller;

import com.levelup.backend.dto.CreateOrderRequest;
import com.levelup.backend.entity.Order;
import com.levelup.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<List<Order>> getUserOrders(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(orderService.getUserOrders(email));
    }

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody CreateOrderRequest request, Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(orderService.createOrder(
                email,
                request.getItems(),
                request.getDireccionEnvio(),
                request.getMetodoPago()));
    }
}
