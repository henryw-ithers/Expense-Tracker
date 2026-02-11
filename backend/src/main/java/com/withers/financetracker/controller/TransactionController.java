package com.withers.financetracker.controller;

import com.withers.financetracker.dto.CreateTransactionRequest;
import com.withers.financetracker.dto.TransactionResponse;
import com.withers.financetracker.model.Category;
import com.withers.financetracker.model.Transaction;
import com.withers.financetracker.service.TransactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.UUID;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping
    public ResponseEntity<TransactionResponse> create(@RequestBody CreateTransactionRequest request) {
        Transaction tx = new Transaction();
        tx.setAmount(request.amount());
        tx.setType(request.type());
        tx.setDescription(request.description());
        tx.setDate(request.date());

        Category c = new Category();
        c.setId(request.categoryId());
        tx.setCategory(c);

        Transaction created = transactionService.create(tx);

        URI location = URI.create("/api/transactions/" + created.getId());
        return ResponseEntity.created(location).body(toResponse(created));
    }

    private static TransactionResponse toResponse(Transaction t) {
        UUID categoryId = t.getCategory() == null ? null : t.getCategory().getId();
        String categoryName = t.getCategory() == null ? null : t.getCategory().getName();

        return new TransactionResponse(
                t.getId(),
                t.getAmount(),
                t.getType() == null ? null : t.getType().name(),
                t.getDescription(),
                t.getDate(),
                categoryId,
                categoryName
        );
    }
}
