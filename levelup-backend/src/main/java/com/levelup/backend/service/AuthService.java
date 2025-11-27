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

import java.security.SecureRandom;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;
        private final JwtUtils jwtUtils;
        private final AuthenticationManager authenticationManager;

        private static final int PUNTOS_BIENVENIDA_REFERIDO = 100; // Puntos para el nuevo usuario
        private static final int PUNTOS_POR_REFERIR = 150; // Puntos para quien refiere

        public AuthResponse register(RegisterRequest request) {
                if (userRepository.existsByEmail(request.getEmail())) {
                        throw new RuntimeException("El email ya está registrado");
                }

                // Generar código de referido único
                String codigoReferido = generarCodigoReferido(request.getNombre());

                // Puntos iniciales
                int puntosIniciales = 0;
                User referidor = null;

                // Si proporcionó un código de referido, validar y otorgar puntos
                if (request.getCodigoReferido() != null && !request.getCodigoReferido().trim().isEmpty()) {
                        Optional<User> referidorOpt = userRepository
                                        .findByCodigoReferido(request.getCodigoReferido().trim());

                        if (referidorOpt.isPresent()) {
                                referidor = referidorOpt.get();
                                // El nuevo usuario gana puntos de bienvenida
                                puntosIniciales = PUNTOS_BIENVENIDA_REFERIDO;

                                // El referidor gana puntos por referir (solo si no es admin)
                                if (referidor.getRole() == Role.USER) {
                                        referidor.setPuntos(referidor.getPuntos() + PUNTOS_POR_REFERIR);
                                        userRepository.save(referidor);
                                        System.out.println("Usuario " + referidor.getNombre() + " ganó "
                                                        + PUNTOS_POR_REFERIR + " puntos por referir");
                                }
                        } else {
                                System.out.println("Código de referido no válido: " + request.getCodigoReferido());
                        }
                }

                var user = User.builder()
                                .nombre(request.getNombre())
                                .email(request.getEmail())
                                .password(passwordEncoder.encode(request.getPassword()))
                                .telefono(request.getTelefono())
                                .rut(request.getRut())
                                .role(Role.USER)
                                .tipo("normal")
                                .puntos(puntosIniciales)
                                .nivel("bronce")
                                .codigoReferido(codigoReferido)
                                .build();

                var savedUser = userRepository.save(user);
                var jwtToken = jwtUtils.generateToken(savedUser);

                System.out.println("Usuario registrado: " + savedUser.getNombre() + " con código: " + codigoReferido
                                + " y " + puntosIniciales + " puntos");

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

        /**
         * Genera un código de referido único basado en el nombre del usuario
         * Formato: 3 primeras letras del nombre (mayúsculas) + 4 caracteres aleatorios
         * Ejemplo: "FER5X9K" para "Fernando"
         */
        private String generarCodigoReferido(String nombre) {
                // Obtener las 3 primeras letras del nombre (sin espacios)
                String nombreLimpio = nombre.replaceAll("\\s+", "").toUpperCase();
                String prefijo = nombreLimpio.length() >= 3
                                ? nombreLimpio.substring(0, 3)
                                : nombreLimpio + "X".repeat(3 - nombreLimpio.length());

                // Generar 4 caracteres aleatorios (letras y números)
                String caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                SecureRandom random = new SecureRandom();
                StringBuilder sufijo = new StringBuilder(4);

                for (int i = 0; i < 4; i++) {
                        sufijo.append(caracteres.charAt(random.nextInt(caracteres.length())));
                }

                String codigo = prefijo + sufijo.toString();

                // Verificar que el código sea único, si no, regenerar
                while (userRepository.findByCodigoReferido(codigo).isPresent()) {
                        sufijo = new StringBuilder(4);
                        for (int i = 0; i < 4; i++) {
                                sufijo.append(caracteres.charAt(random.nextInt(caracteres.length())));
                        }
                        codigo = prefijo + sufijo.toString();
                }

                return codigo;
        }

        private AuthResponse buildAuthResponse(User user, String token) {
                return AuthResponse.builder()
                                .id(user.getId())
                                .token(token)
                                .email(user.getEmail())
                                .nombre(user.getNombre())
                                .role(user.getRole().name())
                                .rut(user.getRut())
                                .puntos(user.getPuntos())
                                .nivel(user.getNivel())
                                .tipo(user.getTipo())
                                .telefono(user.getTelefono())
                                .activo(user.getActivo())
                                .build();
        }
}
