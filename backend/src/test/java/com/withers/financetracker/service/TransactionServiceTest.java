package com.withers.financetracker.service;

import com.withers.financetracker.model.Category;
import com.withers.financetracker.model.Transaction;
import com.withers.financetracker.repository.CategoryRepository;
import com.withers.financetracker.repository.TransactionRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.lang.reflect.Method;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TransactionServiceTest {

    @Mock
    TransactionRepository transactionRepository;
    @Mock
    CategoryRepository categoryRepository;
    @InjectMocks
    TransactionService transactionService;

    @Test
    void create_rejectsInvalidAmount() {
        Transaction tx1 = new Transaction();
        tx1.setAmount(null);
        setValidType(tx1);

        assertThatThrownBy(() -> transactionService.create(tx1))
                .isInstanceOf(IllegalArgumentException.class);

        Transaction tx2 = new Transaction();
        tx2.setAmount(BigDecimal.ZERO);
        setValidType(tx2);

        assertThatThrownBy(() -> transactionService.create(tx2))
                .isInstanceOf(IllegalArgumentException.class);

        verifyNoInteractions(transactionRepository, categoryRepository);
    }

    @Test
    void create_rejectsMissingType() {
        Transaction tx = new Transaction();
        tx.setAmount(new BigDecimal("10.00"));

        assertThatThrownBy(() -> transactionService.create(tx))
                .isInstanceOf(IllegalArgumentException.class);

        verifyNoInteractions(transactionRepository, categoryRepository);
    }

    @Test
    void create_rejectsMissingCategory() {
        Transaction tx = new Transaction();
        tx.setAmount(new BigDecimal("10.00"));
        setValidType(tx);
        tx.setCategory(null);

        assertThatThrownBy(() -> transactionService.create(tx))
                .isInstanceOf(IllegalArgumentException.class);

        verifyNoInteractions(transactionRepository, categoryRepository);
    }

    @Test
    void create_throwsWhenCategoryNotFound() {
        UUID catId = UUID.randomUUID();
        Category inputCategory = new Category();
        inputCategory.setId(catId);

        when(categoryRepository.findById(catId)).thenReturn(Optional.empty());

        Transaction tx = new Transaction();
        tx.setAmount(new BigDecimal("10.00"));
        setValidType(tx);
        tx.setCategory(inputCategory);
        tx.setDate(LocalDate.of(2026, 2, 11));

        assertThatThrownBy(() -> transactionService.create(tx))
                .isInstanceOf(IllegalArgumentException.class);

        verify(categoryRepository).findById(catId);
        verifyNoInteractions(transactionRepository);
    }

    @Test
    void create_setsDateIfNull_resolvesCategory_saves() {
        UUID catId = UUID.randomUUID();

        Category inputCategory = new Category();
        inputCategory.setId(catId);

        Category persisted = new Category();
        persisted.setId(catId);
        persisted.setName("Groceries");

        when(categoryRepository.findById(catId)).thenReturn(Optional.of(persisted));
        when(transactionRepository.save(any(Transaction.class))).thenAnswer(inv -> {
            Transaction t = inv.getArgument(0, Transaction.class);
            if (t.getId() == null)
                t.setId(UUID.randomUUID());
            return t;
        });

        Transaction tx = new Transaction();
        tx.setAmount(new BigDecimal("12.34"));
        setValidType(tx);
        tx.setCategory(inputCategory);
        tx.setDate(null);

        Transaction saved = transactionService.create(tx);

        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getDate()).isNotNull();
        assertThat(saved.getCategory()).isSameAs(persisted);

        verify(transactionRepository).save(any(Transaction.class));
    }

    private static void setValidType(Transaction tx) {
        try {
            Method setter = null;
            for (Method m : tx.getClass().getMethods()) {
                if (m.getName().equals("setType") && m.getParameterCount() == 1) {
                    setter = m;
                    break;
                }
            }
            if (setter == null)
                throw new IllegalStateException("No setType(...) on Transaction");

            Class<?> paramType = setter.getParameterTypes()[0];

            Object value;
            if (paramType.isEnum()) {
                Object[] constants = paramType.getEnumConstants();
                value = constants[0];
            } else if (paramType.equals(String.class)) {
                value = "EXPENSE";
            } else {
                value = paramType.getDeclaredConstructor().newInstance();
            }

            setter.invoke(tx, value);
        } catch (ReflectiveOperationException e) {
            throw new RuntimeException(e);
        }
    }
}