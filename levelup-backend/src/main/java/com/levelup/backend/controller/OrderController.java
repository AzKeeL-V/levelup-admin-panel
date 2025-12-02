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

    @GetMapping("/all")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody CreateOrderRequest request, Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(orderService.createOrder(
                email,
                request.getItems(),
                request.getDireccionEnvio(),
                request.getMetodoPago(),
                request.getCreadoPor(),
                request.getAdminId(),
                request.getAdminNombre(),
                request.getSubtotal(),
                request.getDescuentoDuoc(),
                request.getDescuentoPuntos(),
                request.getTotal(),
                request.getPuntosUsados(),
                request.getPuntosGanados(),
                request.getNotas()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Order> updateOrder(@PathVariable Long id, @RequestBody Order orderUpdates) {
        System.out.println("OrderController: Received update request for order ID: " + id);
        System.out.println("OrderController: Updates: " + orderUpdates);
        return ResponseEntity.ok(orderService.updateOrder(id, orderUpdates));
    }
}
