package com.withers.financetracker.service;

import com.withers.financetracker.model.Category;
import com.withers.financetracker.repository.CategoryRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CategoryServiceTest {

    @Mock
    CategoryRepository categoryRepository;
    @InjectMocks
    CategoryService categoryService;

    @Test
    void create_throwsWhenNameNullOrBlank() {
        assertThatThrownBy(() -> categoryService.create(null))
                .isInstanceOf(IllegalArgumentException.class);

        assertThatThrownBy(() -> categoryService.create("   "))
                .isInstanceOf(IllegalArgumentException.class);

        verifyNoInteractions(categoryRepository);
    }

    @Test
    void create_throwsWhenDuplicateName() {
        when(categoryRepository.existsByNameIgnoreCase("Groceries")).thenReturn(true);

        assertThatThrownBy(() -> categoryService.create("Groceries"))
                .isInstanceOf(IllegalArgumentException.class);

        verify(categoryRepository).existsByNameIgnoreCase("Groceries");
        verifyNoMoreInteractions(categoryRepository);
    }

    @Test
    void create_trimsAndSaves() {
        when(categoryRepository.existsByNameIgnoreCase("Groceries")).thenReturn(false);

        when(categoryRepository.save(any(Category.class))).thenAnswer(inv -> {
            Category c = inv.getArgument(0, Category.class);
            if (c.getId() == null)
                c.setId(UUID.randomUUID());
            return c;
        });

        Category created = categoryService.create("  Groceries  ");

        assertThat(created.getName()).isEqualTo("Groceries");
        assertThat(created.getId()).isNotNull();

        verify(categoryRepository).save(any(Category.class));
    }

    @Test
    void list_returnsAll() {
        when(categoryRepository.findAll()).thenReturn(List.of());

        List<Category> categories = categoryService.list();

        assertThat(categories).isNotNull();
        verify(categoryRepository).findAll();
    }

    @Test
    void get_throwsWhenIdNull() {
        assertThatThrownBy(() -> categoryService.get(null))
                .isInstanceOf(IllegalArgumentException.class);

        verifyNoInteractions(categoryRepository);
    }

    @Test
    void get_throwsWhenNotFound() {
        UUID id = UUID.randomUUID();
        when(categoryRepository.findById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> categoryService.get(id))
                .isInstanceOf(IllegalArgumentException.class);

        verify(categoryRepository).findById(id);
    }
}