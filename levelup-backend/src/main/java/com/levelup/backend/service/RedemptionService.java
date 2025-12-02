package com.levelup.backend.service;

import com.levelup.backend.entity.Redemption;
import com.levelup.backend.entity.User;
import com.levelup.backend.entity.Product;
import com.levelup.backend.repository.RedemptionRepository;
import com.levelup.backend.repository.UserRepository;
import com.levelup.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RedemptionService {

    private final RedemptionRepository redemptionRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public List<Redemption> getUserRedemptions(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return redemptionRepository.findByUserId(user.getId());
    }

    @Transactional
    public Redemption createRedemption(String email, Long productId, Redemption redemptionDetails) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Product product = productRepository.findById(java.util.Objects.requireNonNull(productId))
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        if (user.getPuntos() < product.getPuntos()) {
            throw new RuntimeException("Puntos insuficientes");
        }

        // Deduct points
        user.setPuntos(user.getPuntos() - product.getPuntos());
        userRepository.save(user);

        Redemption redemption = Redemption.builder()
                .user(user)
                .product(product)
                .puntosUsados(product.getPuntos())
                .cantidad(1)
                .direccionEnvio(redemptionDetails.getDireccionEnvio())
                .metodoRetiro(redemptionDetails.getMetodoRetiro())
                .estado("pendiente")
                .notas(redemptionDetails.getNotas())
                .build();

        return redemptionRepository.save(java.util.Objects.requireNonNull(redemption));
    }
}
