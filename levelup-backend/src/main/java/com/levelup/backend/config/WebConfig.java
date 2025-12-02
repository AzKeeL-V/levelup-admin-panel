package com.levelup.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        // Configurar ruta para imágenes de productos
        Path uploadDir = Paths.get("./uploads/images/products");
        String uploadPath = uploadDir.toFile().getAbsolutePath();

        registry.addResourceHandler("/images/products/**")
                .addResourceLocations("file:/" + uploadPath + "/", "classpath:/static/images/products/");

        registry.addResourceHandler("/images/logo/**")
                .addResourceLocations("classpath:/static/images/logo/");

        registry.addResourceHandler("/images/blog_noticia/**")
                .addResourceLocations("classpath:/static/images/blog_noticia/");

        registry.addResourceHandler("/images/catalogo/**")
                .addResourceLocations("classpath:/static/images/catalogo/");

        registry.addResourceHandler("/images/inicio/**")
                .addResourceLocations("classpath:/static/images/inicio/");

        registry.addResourceHandler("/images/nosotros/**")
                .addResourceLocations("classpath:/static/images/nosotros/");
    }
}
