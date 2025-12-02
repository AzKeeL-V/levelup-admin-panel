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

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Transactional
    @SuppressWarnings("null")
    public Order createOrder(String email, Map<Long, Integer> items, Address direccionEnvio, String metodoPago,
            String creadoPor, Long adminId, String adminNombre, BigDecimal subtotal, BigDecimal descuentoDuoc,
            BigDecimal descuentoPuntos, BigDecimal total, Integer puntosUsados, Integer puntosGanados, String notas) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Order order = Order.builder()
                .user(user)
                .estado("pendiente")
                .direccionEnvio(direccionEnvio)
                .metodoPago(metodoPago)
                .creadoPor(creadoPor != null ? creadoPor : "usuario")
                .adminId(adminId)
                .adminNombre(adminNombre)
                .subtotal(subtotal != null ? subtotal : BigDecimal.ZERO)
                .descuentoDuoc(descuentoDuoc != null ? descuentoDuoc : BigDecimal.ZERO)
                .descuentoPuntos(descuentoPuntos != null ? descuentoPuntos : BigDecimal.ZERO)
                .total(total != null ? total : BigDecimal.ZERO)
                .puntosUsados(puntosUsados != null ? puntosUsados : 0)
                .puntosGanados(puntosGanados != null ? puntosGanados : 0)
                .notas(notas)
                .build();

        for (Map.Entry<Long, Integer> entry : items.entrySet()) {

            Product product = productRepository.findById(java.util.Objects.requireNonNull(entry.getKey()))
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
        }

        // Update user points: subtract used points and add earned points
        int currentPoints = user.getPuntos() != null ? user.getPuntos() : 0;
        int usedPoints = puntosUsados != null ? puntosUsados : 0;
        int earnedPoints = puntosGanados != null ? puntosGanados : 0;
        user.setPuntos(currentPoints - usedPoints + earnedPoints);
        userRepository.save(user);

        return orderRepository.save(order);
    }

    @Transactional
    @SuppressWarnings("null")
    public Order updateOrder(Long id, Order orderUpdates) {
        System.out.println("OrderService: Updating order " + id);
        System.out.println("OrderService: Received updates: " + orderUpdates);

        if (id == null) {
            throw new IllegalArgumentException("El ID del pedido no puede ser nulo");
        }
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado: " + id));

        if (orderUpdates.getEstado() != null) {
            System.out.println("OrderService: Updating estado to: " + orderUpdates.getEstado());
            order.setEstado(orderUpdates.getEstado());
        }

        if (orderUpdates.getNotas() != null) {
            System.out.println("OrderService: Updating notas to: " + orderUpdates.getNotas());
            order.setNotas(orderUpdates.getNotas());
        }

        // fechaActualizacion is updated automatically by @PreUpdate in entity

        Order savedOrder = orderRepository.save(order);
        System.out.println("OrderService: Order saved successfully");
        return savedOrder;
    }
}
