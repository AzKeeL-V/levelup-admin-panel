package com.levelup.backend.service;

import com.levelup.backend.dto.AuthResponse;
import com.levelup.backend.dto.LoginRequest;
import com.levelup.backend.dto.RegisterRequest;
import com.levelup.backend.entity.Role;
import com.levelup.backend.entity.User;
import com.levelup.backend.repository.UserRepository;
import com.levelup.backend.utils.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;
        private final JwtUtils jwtUtils;
        private final AuthenticationManager authenticationManager;

        public AuthResponse register(RegisterRequest request) {
                if (userRepository.existsByEmail(request.getEmail())) {
                        throw new RuntimeException("El email ya está registrado");
                }

                var user = User.builder()
                                .nombre(request.getNombre())
                                .email(request.getEmail())
                                .password(passwordEncoder.encode(request.getPassword()))
                                .telefono(request.getTelefono())
                                .rut(request.getRut())
                                .role(Role.USER)
                                .tipo("normal") // Default type
                                .puntos(0)
                                .nivel("bronce")
                                .build();

                @SuppressWarnings("null")
                var savedUser = userRepository.save(user);
                var jwtToken = jwtUtils.generateToken(savedUser);

                return buildAuthResponse(savedUser, jwtToken);
        }

        public AuthResponse login(LoginRequest request) {
                System.out.println("AuthService: Attempting authentication for: " + request.getEmail());
                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                request.getEmail(),
                                                request.getPassword()));

                var user = userRepository.findByEmail(request.getEmail())
                                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

                var jwtToken = jwtUtils.generateToken(user);

                return buildAuthResponse(user, jwtToken);
        }

        public User getCurrentUser(String email) {
                return userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        }

        private AuthResponse buildAuthResponse(User user, String token) {
                return AuthResponse.builder()
                                .token(token)
                                .email(user.getEmail())
                                .nombre(user.getNombre())
                                .role(user.getRole().name())
                                .rut(user.getRut())
                                .puntos(user.getPuntos())
                                .nivel(user.getNivel())
                                .tipo(user.getTipo())
                                .telefono(user.getTelefono())
                                .build();
        }
}
