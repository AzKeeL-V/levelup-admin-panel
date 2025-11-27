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
                        // Admin user - sin campos de gamificación
                        User admin = User.builder()
                                        .nombre("Admin User")
                                        .email("admin@levelup.com")
                                        .password(passwordEncoder.encode("admin123"))
                                        .role(Role.ADMIN)
                                        .telefono("123456789")
                                        .rut("11.111.111-1")
                                        .tipo("normal")
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

                        // Normal user - con campos de gamificación
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
                                        .codigoReferido("USER001")
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
                List<Product> products = List.of(
                                Product.builder()
                                                .nombre("Catan")
                                                .codigo("JM001")
                                                .descripcion(
                                                                "Un clásico juego de estrategia donde los jugadores compiten por colonizar y expandirse en la isla de Catan. Ideal para 3-4 jugadores y perfecto para noches de juego en familia o con amigos.")
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
                                                .codigo("JM002")
                                                .descripcion(
                                                                "Un juego de colocación de fichas donde los jugadores construyen el paisaje alrededor de la fortaleza medieval de Carcassonne. Ideal para 2-5 jugadores y fácil de aprender.")
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
                                                .codigo("AC001")
                                                .descripcion(
                                                                "Ofrece una experiencia de juego cómoda con botones mapeables y una respuesta táctil mejorada. Compatible con consolas Xbox y PC.")
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
                                                .codigo("AC002")
                                                .descripcion(
                                                                "Proporcionan un sonido envolvente de calidad con un micrófono desmontable y almohadillas de espuma viscoelástica para mayor comodidad durante largas sesiones de juego.")
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
                                                .codigo("CO001")
                                                .descripcion(
                                                                "La consola de última generación de Sony, que ofrece gráficos impresionantes y tiempos de carga ultrarrápidos para una experiencia de juego inmersiva.")
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
                                                .build(),
                                Product.builder()
                                                .nombre("PC Gamer ASUS ROG Strix")
                                                .codigo("CG001")
                                                .descripcion(
                                                                "Un potente equipo diseñado para los gamers más exigentes, equipado con los últimos componentes para ofrecer un rendimiento excepcional en cualquier juego.")
                                                .precio(BigDecimal.valueOf(1299990.0))
                                                .stock(3)
                                                .categoria("Computadores Gamers")
                                                .imagen("/images/products/asus-rog.jpg")
                                                .marca("ASUS")
                                                .puntos(130000)
                                                .activo(true)
                                                .canjeable(false)
                                                .origen("tienda")
                                                .rating(4.9)
                                                .build(),
                                Product.builder()
                                                .nombre("Silla Gamer Secretlab Titan")
                                                .codigo("SG001")
                                                .descripcion(
                                                                "Diseñada para el máximo confort, esta silla ofrece un soporte ergonómico y personalización ajustable para sesiones de juego prolongadas.")
                                                .precio(BigDecimal.valueOf(349990.0))
                                                .stock(12)
                                                .categoria("Sillas Gamers")
                                                .imagen("/images/products/secretlab-titan.jpg")
                                                .marca("Secretlab")
                                                .puntos(35000)
                                                .activo(true)
                                                .canjeable(true)
                                                .origen("tienda")
                                                .rating(4.8)
                                                .build(),
                                Product.builder()
                                                .nombre("Mouse Gamer Logitech G502 HERO")
                                                .codigo("MS001")
                                                .descripcion(
                                                                "Con sensor de alta precisión y botones personalizables, este mouse es ideal para gamers que buscan un control preciso y personalización.")
                                                .precio(BigDecimal.valueOf(49990.0))
                                                .stock(45)
                                                .categoria("Mouse")
                                                .imagen("/images/products/logitech-g502.jpg")
                                                .marca("Logitech")
                                                .puntos(5000)
                                                .activo(true)
                                                .canjeable(true)
                                                .origen("tienda")
                                                .rating(4.7)
                                                .build(),
                                Product.builder()
                                                .nombre("Mousepad Razer Goliathus Extended Chroma")
                                                .codigo("MP001")
                                                .descripcion(
                                                                "Ofrece un área de juego amplia con iluminación RGB personalizable, asegurando una superficie suave y uniforme para el movimiento del mouse.")
                                                .precio(BigDecimal.valueOf(29990.0))
                                                .stock(28)
                                                .categoria("Mousepad")
                                                .imagen("/images/products/razer-goliathus.jpg")
                                                .marca("Razer")
                                                .puntos(3000)
                                                .activo(true)
                                                .canjeable(true)
                                                .origen("tienda")
                                                .rating(4.6)
                                                .build(),
                                Product.builder()
                                                .nombre("Polera Gamer Personalizada 'Level-Up'")
                                                .codigo("PP001")
                                                .descripcion(
                                                                "Una camiseta cómoda y estilizada, con la posibilidad de personalizarla con tu gamer tag o diseño favorito.")
                                                .precio(BigDecimal.valueOf(14990.0))
                                                .stock(67)
                                                .categoria("Poleras Personalizadas")
                                                .imagen("/images/products/polera-levelup.jpg")
                                                .marca("Level-Up")
                                                .puntos(1500)
                                                .activo(true)
                                                .canjeable(true)
                                                .origen("tienda")
                                                .rating(4.5)
                                                .build());

                // Add products individually if they don't exist
                for (Product product : products) {
                        if (productRepository.findAll().stream()
                                        .noneMatch(p -> p.getCodigo().equals(product.getCodigo()))) {
                                productRepository.save(product);
                                System.out.println("Product seeded: " + product.getCodigo());
                        }
                }
                System.out.println("Products seeding completed");
        }
}
