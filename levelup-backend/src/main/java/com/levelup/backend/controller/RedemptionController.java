package com.levelup.backend.controller;

import com.levelup.backend.entity.Redemption;
import com.levelup.backend.service.RedemptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/redemptions")
@RequiredArgsConstructor
public class RedemptionController {

    private final RedemptionService redemptionService;

    @GetMapping
    public ResponseEntity<List<Redemption>> getUserRedemptions() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return ResponseEntity.ok(redemptionService.getUserRedemptions(email));
    }

    @PostMapping("/{productId}")
    public ResponseEntity<Redemption> createRedemption(@PathVariable Long productId,
            @RequestBody Redemption redemption) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return ResponseEntity.ok(redemptionService.createRedemption(email, productId, redemption));
    }
}
