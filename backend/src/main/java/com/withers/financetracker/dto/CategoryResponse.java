package com.withers.financetracker.dto;

import java.util.UUID;

public record CategoryResponse(
        UUID id,
        String name) {
}
