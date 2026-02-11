package com.withers.financetracker.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record TransactionResponse(
        UUID id,
        BigDecimal amount,
        String type,
        String description,
        LocalDate date,
        UUID categoryId,
        String categoryName) {

}
