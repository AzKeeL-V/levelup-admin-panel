package com.levelup.backend.service;

import com.levelup.backend.entity.Review;
import com.levelup.backend.entity.User;
import com.levelup.backend.entity.Product;
import com.levelup.backend.repository.ReviewRepository;
import com.levelup.backend.repository.UserRepository;
import com.levelup.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    public List<Review> getProductReviews(Long productId) {
        return reviewRepository.findByProductId(productId);
    }

    public Review createReview(String email, Long productId, Review review) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        review.setUser(user);
        review.setProduct(product);
        review.setAprobado(true); // Auto-approve for now, or false if moderation needed

        return reviewRepository.save(review);
    }
}
