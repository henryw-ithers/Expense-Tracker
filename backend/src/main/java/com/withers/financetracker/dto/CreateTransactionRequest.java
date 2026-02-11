package com.withers.financetracker.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

import com.withers.financetracker.model.TransactionType;

public record CreateTransactionRequest(
        BigDecimal amount,
        TransactionType type,
        String description,
        LocalDate date,
        UUID categoryId) {
}
