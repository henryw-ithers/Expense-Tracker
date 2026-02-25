package com.withers.financetracker.service;

import com.withers.financetracker.model.Category;
import com.withers.financetracker.model.Transaction;
import com.withers.financetracker.repository.CategoryRepository;
import com.withers.financetracker.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;
import java.util.List;

@Service
@Transactional
public class TransactionService {
    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;

    public TransactionService(TransactionRepository transactionRepository,
            CategoryRepository categoryRepository) {
        this.transactionRepository = transactionRepository;
        this.categoryRepository = categoryRepository;
    }

    public Transaction create(Transaction tx) {
        if (tx.getAmount() == null || tx.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be > 0");
        }
        if (tx.getType() == null) {
            throw new IllegalArgumentException("Type is required");
        }
        if (tx.getDate() == null) {
            tx.setDate(LocalDate.now());
        }
        Category category = resolveCategory(tx.getCategory());
        tx.setCategory(category);

        return transactionRepository.save(tx);
    }

    private Category resolveCategory(Category maybeCategory) {
        if (maybeCategory == null) {
            throw new IllegalArgumentException("Category is required");
        }

        UUID id = maybeCategory.getId();
        if (id == null) {
            throw new IllegalArgumentException("Category is required");
        }

        return categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));
    }

    public List<Transaction> list() {
        return transactionRepository.findAll();
    }
}
