export interface Expense {
    id: number;
    description: string;
    amount: number;
    category: string;
    date: string;
  }
  
  export interface ExpenseSummary {
    total: number;
    categoryTotals: Record<string, number>;
  }
  
  export interface CreateExpense {
    description: string;
    amount: number;
    category: string;
    date: string;
  }