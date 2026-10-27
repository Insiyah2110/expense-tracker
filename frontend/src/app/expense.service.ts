import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Expense,
  ExpenseSummary,
  CreateExpense
} from './expense.model';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/expenses';

  getExpenses(): Observable<Expense[]> {
    return this.http.get<Expense[]>(this.apiUrl);
  }

  getSummary(): Observable<ExpenseSummary> {
    return this.http.get<ExpenseSummary>(`${this.apiUrl}/summary`);
  }

  addExpense(expense: CreateExpense): Observable<Expense> {
    return this.http.post<Expense>(this.apiUrl, expense);
  }

  deleteExpense(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}