package com.levelup.backend.config;

import com.levelup.backend.entity.Address;
import com.levelup.backend.entity.Product;
import com.levelup.backend.entity.Role;
import com.levelup.backend.entity.User;
import com.levelup.backend.repository.ProductRepository;
import com.levelup.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

        private final ProductRepository productRepository;
        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;

        @Override
        public void run(String... args) throws Exception {
                seedUsers();
                seedProducts();
        }

        private void seedUsers() {
                if (userRepository.count() == 0) {
                        User admin = User.builder()
                                        .nombre("Admin User")
                                        .email("admin@levelup.com")
                                        .password(passwordEncoder.encode("admin123"))
                                        .role(Role.ADMIN)
                                        .telefono("123456789")
                                        .rut("11.111.111-1")
                                        .tipo("normal")
                                        .puntos(5000)
                                        .nivel("diamante")
                                        .direcciones(List.of(Address.builder()
                                                        .nombre("Oficina Central")
                                                        .calle("Admin HQ")
                                                        .numero("123")
                                                        .ciudad("Santiago")
                                                        .comuna("Providencia")
                                                        .region("Metropolitana")
                                                        .pais("Chile")
                                                        .build()))
                                        .build();

                        User user = User.builder()
                                        .nombre("Normal User")
                                        .email("user@levelup.com")
                                        .password(passwordEncoder.encode("user123"))
                                        .role(Role.USER)
                                        .telefono("987654321")
                                        .rut("22.222.222-2")
                                        .tipo("duoc")
                                        .puntos(1500)
                                        .nivel("plata")
                                        .direcciones(List.of(Address.builder()
                                                        .nombre("Casa")
                                                        .calle("User Home")
                                                        .numero("456")
                                                        .ciudad("Valparaíso")
                                                        .comuna("Valparaíso")
                                                        .region("Valparaíso")
                                                        .pais("Chile")
                                                        .build()))
                                        .build();

                        Iterable<User> users = List.of(admin, user);
                        userRepository.saveAll(users);
                        System.out.println("Users seeded");
                }
        }

        private void seedProducts() {
                if (productRepository.count() == 0) {
                        List<Product> products = List.of(
                                        Product.builder()
                                                        .nombre("Catan")
                                                        .descripcion(
                                                                        "Un clásico juego de estrategia donde los jugadores compiten por colonizar y expandirse en la isla de Catan.")
                                                        .precio(BigDecimal.valueOf(29990.0))
                                                        .stock(15)
                                                        .categoria("Juegos de Mesa")
                                                        .imagen("/images/products/catan.jpg")
                                                        .marca("Devir")
                                                        .puntos(3000)
                                                        .activo(true)
                                                        .canjeable(true)
                                                        .origen("tienda")
                                                        .rating(4.8)
                                                        .build(),
                                        Product.builder()
                                                        .nombre("Carcassonne")
                                                        .descripcion(
                                                                        "Un juego de colocación de fichas donde los jugadores construyen el paisaje alrededor de la fortaleza medieval.")
                                                        .precio(BigDecimal.valueOf(24990.0))
                                                        .stock(23)
                                                        .categoria("Juegos de Mesa")
                                                        .imagen("/images/products/carcassonne.jpg")
                                                        .marca("Devir")
                                                        .puntos(2500)
                                                        .activo(true)
                                                        .canjeable(true)
                                                        .origen("tienda")
                                                        .rating(4.7)
                                                        .build(),
                                        Product.builder()
                                                        .nombre("Controlador Inalámbrico Xbox Series X")
                                                        .descripcion("Ofrece una experiencia de juego cómoda con botones mapeables.")
                                                        .precio(BigDecimal.valueOf(59990.0))
                                                        .stock(8)
                                                        .categoria("Accesorios")
                                                        .imagen("/images/products/xbox-controller.jpg")
                                                        .marca("Microsoft")
                                                        .puntos(6000)
                                                        .activo(true)
                                                        .canjeable(false)
                                                        .origen("tienda")
                                                        .rating(4.9)
                                                        .build(),
                                        Product.builder()
                                                        .nombre("Auriculares Gamer HyperX Cloud II")
                                                        .descripcion("Sonido envolvente de calidad con micrófono desmontable.")
                                                        .precio(BigDecimal.valueOf(79990.0))
                                                        .stock(34)
                                                        .categoria("Accesorios")
                                                        .imagen("/images/products/hyperx-cloud2.jpg")
                                                        .marca("HyperX")
                                                        .puntos(8000)
                                                        .activo(true)
                                                        .canjeable(false)
                                                        .origen("tienda")
                                                        .rating(4.6)
                                                        .build(),
                                        Product.builder()
                                                        .nombre("PlayStation 5")
                                                        .descripcion("La consola de última generación de Sony.")
                                                        .precio(BigDecimal.valueOf(549990.0))
                                                        .stock(5)
                                                        .categoria("Consolas")
                                                        .imagen("/images/products/ps5.jpg")
                                                        .marca("Sony")
                                                        .puntos(55000)
                                                        .activo(true)
                                                        .canjeable(false)
                                                        .origen("tienda")
                                                        .rating(5.0)
                                                        .build());

                        Iterable<Product> productsToSave = products;
                        productRepository.saveAll(productsToSave);
                        System.out.println("Products seeded");
                }
        }
}
