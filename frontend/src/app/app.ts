import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpenseService } from './expense.service';
import { CreateExpense, Expense, ExpenseSummary } from './expense.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CurrencyPipe, DatePipe],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private readonly expenseService = inject(ExpenseService);

  // Angular 21 is zoneless: state lives in signals so updates from async
  // HTTP callbacks schedule change detection and re-render the view.
  readonly expenses = signal<Expense[]>([]);
  readonly summary = signal<ExpenseSummary>({ total: 0, categoryTotals: {} });

  categories = [
    'Food',
    'Transport',
    'Shopping',
    'Bills',
    'Entertainment',
    'Health',
    'Other'
  ];

  form: CreateExpense = this.emptyForm();
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal('');

  readonly todayLabel = new Date().toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  ngOnInit(): void {
    this.refreshData();
  }

  readonly categoryEntries = computed(() =>
    Object.entries(this.summary().categoryTotals)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount)
  );

  categoryPercent(amount: number): number {
    const total = this.summary().total;
    return total > 0
      ? (amount / total) * 100
      : 0;
  }

  refreshData(): void {
    this.loading.set(true);
  
    this.expenseService.getExpenses().subscribe({
      next: (expenses) => {
        this.expenses.set([...expenses].sort(
          (a, b) => b.date.localeCompare(a.date) || b.id - a.id
        ));
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load expenses:', err);
        this.error.set('Could not load expenses. Check that the backend is running.');
        this.loading.set(false);
      }
    });
  
    this.expenseService.getSummary().subscribe({
      next: (summary) => {
        this.summary.set(summary);
      },
      error: (err) => {
        console.error('Failed to load summary:', err);
        this.error.set('Could not refresh the spending summary.');
      }
    });
  }

  addExpense(): void {
    if (this.saving()) return;
  
    this.saving.set(true);
    this.error.set('');
  
    this.expenseService.addExpense({
      ...this.form,
      description: this.form.description.trim(),
      amount: Number(this.form.amount)
    }).subscribe({
      next: (savedExpense) => {
        // Immediately show the expense returned by Spring Boot.
        this.expenses.update((list) => [savedExpense, ...list].sort(
          (a, b) => b.date.localeCompare(a.date) || b.id - a.id
        ));
  
        this.form = this.emptyForm();
        this.saving.set(false);
  
        // Fetch authoritative list and summary from the backend.
        this.refreshData();
      },
      error: (err) => {
        console.error('Failed to add expense:', err);
        this.error.set('Could not add this expense. Please check your entries.');
        this.saving.set(false);
      }
    });
  }

  deleteExpense(expense: Expense): void {
    this.error.set('');
  
    this.expenseService.deleteExpense(expense.id).subscribe({
      next: () => {
        // Remove it immediately after the backend confirms deletion.
        this.expenses.update((list) => list.filter(
          (item) => item.id !== expense.id
        ));
  
        this.refreshData();
      },
      error: (err) => {
        console.error('Failed to delete expense:', err);
        this.error.set('Could not delete this expense. Check the backend response.');
      }
    });
  }

  private emptyForm(): CreateExpense {
    const today = new Date();
    const date = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, '0'),
      String(today.getDate()).padStart(2, '0')
    ].join('-');

    return {
      description: '',
      amount: 0,
      category: 'Food',
      date
    };
  }
}