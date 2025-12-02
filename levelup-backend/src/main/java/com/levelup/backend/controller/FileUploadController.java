package com.levelup.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:5174" })
public class FileUploadController {

    // Directorio donde se guardarán las imágenes (fuera del classpath para acceso
    // inmediato)
    private static final String UPLOAD_DIR = "./uploads/images/products/";

    @PostMapping("/product-image")
    public ResponseEntity<?> uploadProductImage(@RequestParam("file") MultipartFile file) {
        System.out.println("[FileUpload] Received upload request");
        System.out.println("[FileUpload] - File name: " + file.getOriginalFilename());
        System.out.println("[FileUpload] - File size: " + file.getSize() + " bytes");
        System.out.println("[FileUpload] - Content type: " + file.getContentType());

        try {
            // Validar que el archivo no esté vacío
            if (file.isEmpty()) {
                System.out.println("[FileUpload] ERROR: File is empty");
                return ResponseEntity.badRequest().body(Map.of("error", "El archivo está vacío"));
            }

            // Validar tipo de archivo
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                System.out.println("[FileUpload] ERROR: Invalid content type: " + contentType);
                return ResponseEntity.badRequest().body(Map.of("error", "El archivo debe ser una imagen"));
            }

            // Crear directorio si no existe
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                System.out.println("[FileUpload] Creating upload directory: " + uploadPath.toAbsolutePath());
                Files.createDirectories(uploadPath);
            }

            // Generar nombre único para el archivo
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".")
                    ? originalFilename.substring(originalFilename.lastIndexOf("."))
                    : ".jpg";
            String uniqueFilename = UUID.randomUUID().toString() + extension;

            // Guardar archivo
            Path filePath = uploadPath.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            System.out.println("[FileUpload] SUCCESS: File saved to: " + filePath.toAbsolutePath());

            // Retornar la ruta relativa que se usará en el frontend
            String imageUrl = "/images/products/" + uniqueFilename;

            Map<String, String> response = new HashMap<>();
            response.put("url", imageUrl);
            response.put("filename", uniqueFilename);
            response.put("message", "Imagen subida exitosamente");

            System.out.println("[FileUpload] Returning URL: " + imageUrl);
            return ResponseEntity.ok(response);

        } catch (IOException e) {
            System.err.println("[FileUpload] ERROR: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Error al guardar la imagen: " + e.getMessage()));
        }
    }
}
