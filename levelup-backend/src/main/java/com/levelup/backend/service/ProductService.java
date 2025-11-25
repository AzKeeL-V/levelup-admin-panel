package com.levelup.backend.service;

import com.levelup.backend.entity.Product;
import com.levelup.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        @SuppressWarnings("null")
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        return product;
    }

    public Product createProduct(Product product) {
        @SuppressWarnings("null")
        Product savedProduct = productRepository.save(product);
        return savedProduct;
    }

    public Product updateProduct(Long id, Product productDetails) {
        Product product = getProductById(id);

        product.setNombre(productDetails.getNombre());
        product.setDescripcion(productDetails.getDescripcion());
        product.setPrecio(productDetails.getPrecio());
        product.setStock(productDetails.getStock());
        product.setCategoria(productDetails.getCategoria());
        product.setImagen(productDetails.getImagen());
        product.setPlataforma(productDetails.getPlataforma());
        product.setEsDigital(productDetails.getEsDigital());

        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("ID cannot be null");
        }
        productRepository.deleteById(id);
    }
}
