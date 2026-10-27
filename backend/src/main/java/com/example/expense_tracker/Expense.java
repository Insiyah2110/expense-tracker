package com.example.expense_tracker;

import java.time.LocalDate;

public record Expense(
    Long id,
    String description,
    double amount,
    String category,
    LocalDate date
) {}