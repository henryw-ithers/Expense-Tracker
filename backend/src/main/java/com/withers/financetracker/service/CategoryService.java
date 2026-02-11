package com.withers.financetracker.service;

import com.withers.financetracker.model.Category;
import com.withers.financetracker.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public Category create(String name) {
        String normalized = name == null ? "" : name.trim();
        if (normalized.isBlank()) {
            throw new IllegalArgumentException("Category name is required");
        }
        if (categoryRepository.existsByNameIgnoreCase(normalized)) {
            throw new IllegalArgumentException("Category already exists");
        }

        Category c = new Category();
        c.setName(normalized);
        return categoryRepository.save(c);
    }

    @Transactional(readOnly = true)
    public List<Category> list() {
        return categoryRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Category get(UUID id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));
    }
}
