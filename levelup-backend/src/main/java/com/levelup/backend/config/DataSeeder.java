package com.levelup.backend.config;

import com.levelup.backend.entity.Address;
import com.levelup.backend.entity.Product;
import com.levelup.backend.entity.Role;
import com.levelup.backend.entity.User;
import com.levelup.backend.entity.PaymentMethod;
import com.levelup.backend.entity.CardDetails;
import com.levelup.backend.repository.ProductRepository;
import com.levelup.backend.repository.UserRepository;
import com.levelup.backend.repository.BlogRepository;
import com.levelup.backend.entity.Blog;
import java.time.LocalDate;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

        private final ProductRepository productRepository;
        private final UserRepository userRepository;
        private final BlogRepository blogRepository;
        private final PasswordEncoder passwordEncoder;
        @NonNull
        private final PlatformTransactionManager transactionManager;

        @Override
        public void run(String... args) throws Exception {
                try {
                        new TransactionTemplate(transactionManager).execute(status -> {
                                seedUsers();
                                return null;
                        });
                        seedProducts();
                        seedBlogs();
                } catch (Exception e) {
                        System.out.println("ERROR SEEDING DATA: " + e.getMessage());
                        if (e.getCause() != null) {
                                System.out.println("CAUSE: " + e.getCause().getMessage());
                        }
                        e.printStackTrace();
                }
        }

        private void seedUsers() {
                // Seed Admin
                if (userRepository.findByEmail("admin@levelup.com").isEmpty()) {
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
                                                        .ciudad("Santiago").region("Metropolitana").build()))
                                        .build();
                        userRepository.save(Objects.requireNonNull(admin));
                        System.out.println("Admin user seeded");
                }

                // Seed Normal User
                User existingUser = userRepository.findByEmail("user@levelup.com").orElse(null);
                if (existingUser == null) {
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
                                                        .ciudad("Valparaíso").region("Valparaíso").build()))
                                        .build();

                        // Create payment methods with MASKED card numbers for security
                        PaymentMethod card = PaymentMethod.builder()
                                        .tipo("tarjeta")
                                        .tarjeta(CardDetails.builder()
                                                        .numero("**** **** **** 1111") // Masked for PCI-DSS compliance
                                                        .fechaExpiracion("12/25")
                                                        .titular("Normal User")
                                                        .build())
                                        .esPredeterminado(true)
                                        .build();

                        PaymentMethod paypal = PaymentMethod.builder()
                                        .tipo("paypal")
                                        .emailPaypal("user@levelup.com")
                                        .esPredeterminado(false)
                                        .build();

                        user.setMetodosPago(new ArrayList<>(List.of(card, paypal)));
                        userRepository.save(Objects.requireNonNull(user));
                        System.out.println("Normal user seeded with masked payment methods");
                } else {
                        // Update existing user if addresses are missing
                        if (existingUser.getDirecciones() == null || existingUser.getDirecciones().isEmpty()) {
                                Address address = Address.builder()
                                                .nombre("Casa")
                                                .calle("User Home")
                                                .numero("456")
                                                .ciudad("Valparaíso").region("Valparaíso").build();

                                if (existingUser.getDirecciones() == null) {
                                        existingUser.setDirecciones(new ArrayList<>());
                                }
                                existingUser.getDirecciones().add(address);
                                userRepository.save(Objects.requireNonNull(existingUser));
                                System.out.println("Normal user updated with default address");
                        }

                        // Update existing user if payment methods are missing
                        if (existingUser.getMetodosPago() == null || existingUser.getMetodosPago().isEmpty()) {
                                PaymentMethod card = PaymentMethod.builder()
                                                .tipo("tarjeta")
                                                .tarjeta(CardDetails.builder()
                                                                .numero("**** **** **** 1111") // Masked for PCI-DSS
                                                                                               // compliance
                                                                .fechaExpiracion("12/25")
                                                                .titular("Normal User")
                                                                .build())
                                                .esPredeterminado(true)
                                                .build();

                                PaymentMethod paypal = PaymentMethod.builder()
                                                .tipo("paypal")
                                                .emailPaypal("user@levelup.com")
                                                .esPredeterminado(false)
                                                .build();

                                // Modify existing collection instead of replacing it
                                existingUser.getMetodosPago().clear();
                                existingUser.getMetodosPago().add(card);
                                existingUser.getMetodosPago().add(paypal);
                                userRepository.save(Objects.requireNonNull(existingUser));
                                System.out.println("Normal user updated with masked payment methods");
                        }
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
                                                .canjeable(true).rating(4.8)
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
                                                .canjeable(true).rating(4.7)
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
                                                .canjeable(false).rating(4.9)
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
                                                .canjeable(false).rating(4.6)
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
                                                .canjeable(false).rating(5.0)
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
                                                .canjeable(false).rating(4.9)
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
                                                .canjeable(true).rating(4.8)
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
                                                .canjeable(true).rating(4.7)
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
                                                .canjeable(true).rating(4.6)
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
                                                .canjeable(true).rating(4.5)
                                                .build());

                // Add products individually if they don't exist
                for (Product product : products) {
                        if (productRepository.findAll().stream()
                                        .noneMatch(p -> p.getCodigo().equals(product.getCodigo()))) {
                                productRepository.save(Objects.requireNonNull(product));
                                System.out.println("Product seeded: " + product.getCodigo());
                        }
                }
        }

        private void seedBlogs() {
                try {
                        if (blogRepository.count() >= 0) {
                                blogRepository.deleteAll();
                                List<Blog> blogs = List.of(
                                                Blog.builder()
                                                                .tipo("evento")
                                                                .titulo("Gran Torneo de Apertura 2025")
                                                                .descripcion(
                                                                                "Únete al evento de esports más grande del año. Competencias de Valorant, LoL y más.")
                                                                .fecha(LocalDate.of(2025, 1, 15))
                                                                .horaInicio("10:00")
                                                                .horaFin("22:00")
                                                                .direccion("Movistar Arena, Santiago")
                                                                .ubicacionUrl(
                                                                                "https://www.google.com/maps/search/?api=1&query=Movistar+Arena,+Santiago")
                                                                .imagen("/images/inicio/banner_inicio.png")
                                                                .videoUrl("https://www.youtube.com/watch?v=C3GouGa0noM")
                                                                .autor("LevelUp Esports")
                                                                .categoria("Torneos")
                                                                .puntos(1000)
                                                                .estado("activo")
                                                                .contenidoCompleto(
                                                                                "El Gran Torneo de Apertura 2025 reunirá a los mejores equipos de la región...")
                                                                .tiempoLectura(5)
                                                                .etiquetas(List.of("esports", "torneo", "valorant",
                                                                                "lol"))
                                                                .build(),
                                                Blog.builder()
                                                                .tipo("evento")
                                                                .titulo("Lanzamiento Nuevas Tecnologías")
                                                                .descripcion(
                                                                                "Descubre lo último en hardware gaming. Presentación exclusiva de nuevas tarjetas gráficas.")
                                                                .fecha(LocalDate.of(2025, 2, 10))
                                                                .horaInicio("18:30")
                                                                .horaFin("21:00")
                                                                .direccion("Costanera Center, Santiago")
                                                                .ubicacionUrl(
                                                                                "https://www.google.com/maps/search/?api=1&query=Costanera+Center,+Santiago")
                                                                .imagen("/images/inicio/tarjeta_tecnologia.png")
                                                                .videoUrl("https://www.youtube.com/watch?v=aJwMEQqwDSo")
                                                                .autor("LevelUp Tech")
                                                                .categoria("Tecnología")
                                                                .puntos(500)
                                                                .estado("programado")
                                                                .contenidoCompleto(
                                                                                "Ven a conocer de primera mano la nueva generación de hardware...")
                                                                .tiempoLectura(3)
                                                                .etiquetas(List.of("hardware", "lanzamiento",
                                                                                "tecnologia"))
                                                                .build());
                                blogRepository.saveAll(Objects.requireNonNull(blogs));
                                System.out.println("Blogs seeded");
                        }
                } catch (Exception e) {
                        e.printStackTrace();
                }
        }
}
