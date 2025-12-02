package com.levelup.backend.service;

import com.levelup.backend.entity.User;
import com.levelup.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(java.util.Objects.requireNonNull(id))
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    public User createUser(User user) {
        // Encode password if provided
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }

        // Set defaults if not provided
        if (user.getActivo() == null) {
            user.setActivo(true);
        }
        if (user.getPuntos() == null) {
            user.setPuntos(0);
        }
        if (user.getNivel() == null || user.getNivel().isEmpty()) {
            user.setNivel("bronce");
        }
        if (user.getTipo() == null || user.getTipo().isEmpty()) {
            user.setTipo("normal");
        }

        // Initialize collections if null
        if (user.getDirecciones() == null) {
            user.setDirecciones(new java.util.ArrayList<>());
        }
        if (user.getMetodosPago() == null) {
            user.setMetodosPago(new java.util.ArrayList<>());
        }
        if (user.getIntereses() == null) {
            user.setIntereses(new java.util.ArrayList<>());
        }
        if (user.getPreferenciasComunicacion() == null) {
            user.setPreferenciasComunicacion(new com.levelup.backend.entity.CommunicationPreferences());
        }
        if (user.getAceptaTerminos() == null) {
            user.setAceptaTerminos(false);
        }
        if (user.getAceptaPoliticaPrivacidad() == null) {
            user.setAceptaPoliticaPrivacidad(false);
        }

        return userRepository.save(user);
    }

    public User updateUser(Long id, User userDetails) {
        System.out.println("UserService.updateUser: Updating user ID " + id);
        System.out.println("UserService.updateUser: Received direcciones: " +
                (userDetails.getDirecciones() != null ? userDetails.getDirecciones().size() + " items" : "null"));
        System.out.println("UserService.updateUser: Received metodosPago: " +
                (userDetails.getMetodosPago() != null ? userDetails.getMetodosPago().size() + " items" : "null"));

        User user = getUserById(id);

        // Update basic fields
        if (userDetails.getNombre() != null)
            user.setNombre(userDetails.getNombre());
        if (userDetails.getEmail() != null)
            user.setEmail(userDetails.getEmail());
        if (userDetails.getTelefono() != null)
            user.setTelefono(userDetails.getTelefono());
        if (userDetails.getRut() != null)
            user.setRut(userDetails.getRut());
        if (userDetails.getTipo() != null)
            user.setTipo(userDetails.getTipo());
        if (userDetails.getPuntos() != null)
            user.setPuntos(userDetails.getPuntos());
        if (userDetails.getNivel() != null)
            user.setNivel(userDetails.getNivel());
        if (userDetails.getActivo() != null)
            user.setActivo(userDetails.getActivo());

        // SAFE UPDATE: Only update direcciones if explicitly provided AND intentionally
        // being changed
        // This prevents accidental deletion when updating other fields
        if (userDetails.getDirecciones() != null && !userDetails.getDirecciones().isEmpty()) {
            System.out.println("UserService.updateUser: Updating direcciones with "
                    + userDetails.getDirecciones().size() + " items");
            user.getDirecciones().clear();
            user.getDirecciones().addAll(userDetails.getDirecciones());
        } else if (userDetails.getDirecciones() != null && userDetails.getDirecciones().isEmpty()) {
            // Only clear if explicitly sending empty array (intentional deletion)
            System.out.println("UserService.updateUser: WARNING - Clearing all direcciones (empty array received)");
            user.getDirecciones().clear();
        }
        // If direcciones is null, we don't touch it at all (preserve existing data)

        // Update other fields as necessary, avoiding password overwrite if null
        if (userDetails.getRole() != null) {
            user.setRole(userDetails.getRole());
        }

        // SAFE UPDATE: Only update metodosPago if explicitly provided AND intentionally
        // being changed
        if (userDetails.getMetodosPago() != null && !userDetails.getMetodosPago().isEmpty()) {
            System.out.println("UserService.updateUser: Updating metodosPago with "
                    + userDetails.getMetodosPago().size() + " items");
            user.getMetodosPago().clear();
            user.getMetodosPago().addAll(userDetails.getMetodosPago());
        } else if (userDetails.getMetodosPago() != null && userDetails.getMetodosPago().isEmpty()) {
            // Only clear if explicitly sending empty array (intentional deletion)
            System.out.println("UserService.updateUser: WARNING - Clearing all metodosPago (empty array received)");
            user.getMetodosPago().clear();
        }
        // If metodosPago is null, we don't touch it at all (preserve existing data)

        // Update new fields
        if (userDetails.getMetodoPagoPreferido() != null) {
            user.setMetodoPagoPreferido(userDetails.getMetodoPagoPreferido());
        }

        // SAFE UPDATE: Only update intereses if provided
        if (userDetails.getIntereses() != null && !userDetails.getIntereses().isEmpty()) {
            user.getIntereses().clear();
            user.getIntereses().addAll(userDetails.getIntereses());
        } else if (userDetails.getIntereses() != null && userDetails.getIntereses().isEmpty()) {
            user.getIntereses().clear();
        }

        if (userDetails.getPreferenciasComunicacion() != null) {
            user.setPreferenciasComunicacion(userDetails.getPreferenciasComunicacion());
        }
        if (userDetails.getAceptaTerminos() != null) {
            user.setAceptaTerminos(userDetails.getAceptaTerminos());
        }
        if (userDetails.getAceptaPoliticaPrivacidad() != null) {
            user.setAceptaPoliticaPrivacidad(userDetails.getAceptaPoliticaPrivacidad());
        }

        System.out.println("UserService.updateUser: Saving user with " +
                user.getDirecciones().size() + " direcciones and " +
                user.getMetodosPago().size() + " metodosPago");

        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        User user = getUserById(id);
        // Logical deletion
        user.setActivo(false);
        userRepository.save(user);
    }

    public Map<String, Object> getUserStats() {
        List<User> users = userRepository.findAll();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", users.size());
        stats.put("duocUsers", users.stream().filter(u -> "duoc".equals(u.getTipo())).count());
        stats.put("normalUsers", users.stream().filter(u -> "normal".equals(u.getTipo())).count());
        stats.put("totalPoints", users.stream().mapToInt(User::getPuntos).sum());

        Map<String, Long> levelStats = new HashMap<>();
        levelStats.put("bronce", users.stream().filter(u -> "bronce".equals(u.getNivel())).count());
        levelStats.put("plata", users.stream().filter(u -> "plata".equals(u.getNivel())).count());
        levelStats.put("oro", users.stream().filter(u -> "oro".equals(u.getNivel())).count());
        levelStats.put("diamante", users.stream().filter(u -> "diamante".equals(u.getNivel())).count());

        stats.put("levelStats", levelStats);

        return stats;
    }
}
