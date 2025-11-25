package com.levelup.backend.service;

import com.levelup.backend.entity.Address;
import com.levelup.backend.entity.Order;
import com.levelup.backend.entity.OrderItem;
import com.levelup.backend.entity.Product;
import com.levelup.backend.entity.User;
import com.levelup.backend.repository.OrderRepository;
import com.levelup.backend.repository.ProductRepository;
import com.levelup.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public List<Order> getUserOrders(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return orderRepository.findByUserId(user.getId());
    }

    @Transactional
    public Order createOrder(String email, Map<Long, Integer> items, Address direccionEnvio, String metodoPago) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Order order = Order.builder()
                .user(user)
                .estado("pendiente")
                .direccionEnvio(direccionEnvio)
                .metodoPago(metodoPago)
                .subtotal(BigDecimal.ZERO) // Initialize
                .total(BigDecimal.ZERO)
                .descuentoDuoc(BigDecimal.ZERO)
                .descuentoPuntos(BigDecimal.ZERO)
                .puntosUsados(0)
                .puntosGanados(0)
                .build();

        BigDecimal subtotal = BigDecimal.ZERO;

        for (Map.Entry<Long, Integer> entry : items.entrySet()) {
            @SuppressWarnings("null")
            Product product = productRepository.findById(entry.getKey())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + entry.getKey()));

            if (product.getStock() < entry.getValue()) {
                throw new RuntimeException("Stock insuficiente para producto: " + product.getNombre());
            }

            // Update stock
            product.setStock(product.getStock() - entry.getValue());
            productRepository.save(product);

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(entry.getValue())
                    .price(product.getPrecio())
                    .build();

            order.getItems().add(orderItem);
            subtotal = subtotal.add(product.getPrecio().multiply(BigDecimal.valueOf(entry.getValue())));
        }

        order.setSubtotal(subtotal);
        // Logic for discounts can be added here
        order.setTotal(subtotal); // For now total = subtotal

        // Calculate points earned (e.g., 1% of total / 10) - Placeholder logic
        int pointsEarned = subtotal.divideToIntegralValue(BigDecimal.valueOf(100)).intValue();
        order.setPuntosGanados(pointsEarned);

        // Update user points
        user.setPuntos(user.getPuntos() + pointsEarned);
        userRepository.save(user);

        return orderRepository.save(order);
    }
}
