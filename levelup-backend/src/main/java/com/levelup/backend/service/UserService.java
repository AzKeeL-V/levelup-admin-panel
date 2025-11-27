package com.levelup.backend.service;

import com.levelup.backend.entity.User;
import com.levelup.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    public User updateUser(Long id, User userDetails) {
        User user = getUserById(id);

        user.setNombre(userDetails.getNombre());
        user.setEmail(userDetails.getEmail());
        user.setTelefono(userDetails.getTelefono());
        user.setRut(userDetails.getRut());
        user.setTipo(userDetails.getTipo());
        user.setPuntos(userDetails.getPuntos());
        user.setNivel(userDetails.getNivel());
        user.setActivo(userDetails.getActivo());

        // Update other fields as necessary, avoiding password overwrite if null
        if (userDetails.getRole() != null) {
            user.setRole(userDetails.getRole());
        }

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
