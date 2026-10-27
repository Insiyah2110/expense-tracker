package com.example.expense_tracker;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = "http://localhost:4200")
public class ExpenseController {

    private final List<Expense> expenses = new ArrayList<>();
    private final AtomicLong nextId = new AtomicLong(1);

    @GetMapping
    public List<Expense> getExpenses() {
        return new ArrayList<>(expenses);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Expense addExpense(@RequestBody Expense expense) {
        if (expense.description() == null
                || expense.description().isBlank()) {
            throw new IllegalArgumentException("Description is required");
        }

        if (expense.amount() <= 0 || !Double.isFinite(expense.amount())) {
            throw new IllegalArgumentException("Amount must be positive");
        }

        if (expense.category() == null || expense.category().isBlank()) {
            throw new IllegalArgumentException("Category is required");
        }

        if (expense.date() == null) {
            throw new IllegalArgumentException("Date is required");
        }

        Expense saved = new Expense(
            nextId.getAndIncrement(),
            expense.description().trim(),
            expense.amount(),
            expense.category(),
            expense.date()
        );

        expenses.add(saved);
        return saved;
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteExpense(@PathVariable Long id) {
        boolean removed = expenses.removeIf(expense -> expense.id().equals(id));

        if (!removed) {
            throw new org.springframework.web.server.ResponseStatusException(
                HttpStatus.NOT_FOUND, "Expense not found"
            );
        }
    }

    @GetMapping("/summary")
    public ExpenseSummary getSummary() {
        double total = expenses.stream()
            .mapToDouble(Expense::amount)
            .sum();

        Map<String, Double> categoryTotals = expenses.stream()
            .collect(Collectors.groupingBy(
                Expense::category,
                LinkedHashMap::new,
                Collectors.summingDouble(Expense::amount)
            ));

        return new ExpenseSummary(total, categoryTotals);
    }
}