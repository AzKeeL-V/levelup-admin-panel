package com.levelup.backend.service;

import com.levelup.backend.entity.Blog;
import com.levelup.backend.repository.BlogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BlogService {

    private final BlogRepository blogRepository;

    public List<Blog> getAllBlogs() {
        return blogRepository.findAll();
    }

    public Blog getBlogById(Long id) {
        return blogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog no encontrado"));
    }

    public Blog createBlog(Blog blog) {
        return blogRepository.save(blog);
    }

    public Blog updateBlog(Long id, Blog blogDetails) {
        Blog blog = getBlogById(id);
        blog.setTitulo(blogDetails.getTitulo());
        blog.setDescripcion(blogDetails.getDescripcion());
        blog.setContenidoCompleto(blogDetails.getContenidoCompleto());
        blog.setImagen(blogDetails.getImagen());
        blog.setTipo(blogDetails.getTipo());
        blog.setEtiquetas(blogDetails.getEtiquetas());
        // Update other fields as needed
        return blogRepository.save(blog);
    }

    public void deleteBlog(Long id) {
        blogRepository.deleteById(id);
    }
}
