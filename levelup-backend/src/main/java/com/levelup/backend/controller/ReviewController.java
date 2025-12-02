package com.levelup.backend.controller;

import com.levelup.backend.entity.Review;
import com.levelup.backend.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping
    public ResponseEntity<List<Review>> getAllReviews() {
        return ResponseEntity.ok(reviewService.getAllReviews());
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Review>> getProductReviews(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getProductReviews(productId));
    }

    @GetMapping("/product/codigo/{productCodigo}")
    public ResponseEntity<List<Review>> getProductReviewsByCodigo(@PathVariable String productCodigo) {
        return ResponseEntity.ok(reviewService.getProductReviewsByCodigo(productCodigo));
    }

    @PostMapping("/product/{productId}")
    public ResponseEntity<Review> createReview(@PathVariable Long productId, @RequestBody Review review) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return ResponseEntity.ok(reviewService.createReview(email, productId, review));
    }

    @PostMapping("/product/codigo/{productCodigo}")
    public ResponseEntity<Review> createReviewByCodigo(@PathVariable String productCodigo, @RequestBody Review review) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return ResponseEntity.ok(reviewService.createReviewByCodigo(email, productCodigo, review));
    }
}
