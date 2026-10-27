package com.example.expense_tracker;

import java.util.Map;

public record ExpenseSummary(
    double total,
    Map<String, Double> categoryTotals
) {}