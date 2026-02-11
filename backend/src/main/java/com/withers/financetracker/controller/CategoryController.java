package com.withers.financetracker.controller;

import com.withers.financetracker.dto.CategoryResponse;
import com.withers.financetracker.dto.CreateCategoryRequest;
import com.withers.financetracker.model.Category;
import com.withers.financetracker.service.CategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PostMapping
    public ResponseEntity<CategoryResponse> create(@RequestBody CreateCategoryRequest request) {
        Category created = categoryService.create(request.name());
        CategoryResponse body = toResponse(created);

        URI location = URI.create("/api/categories/" + created.getId());
        return ResponseEntity.created(location).body(body);
    }

    @GetMapping
    public ResponseEntity<List<CategoryResponse>> list() {
        List<CategoryResponse> body = categoryService.list().stream()
                .map(CategoryController::toResponse)
                .toList();
        return ResponseEntity.ok(body);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponse> get(@PathVariable UUID id) {
        Category c = categoryService.get(id);
        return ResponseEntity.ok(toResponse(c));
    }

    private static CategoryResponse toResponse(Category c) {
        return new CategoryResponse(c.getId(), c.getName());
    }
}
