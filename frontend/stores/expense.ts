import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { getAuthHeaders } from '../lib/auth-utils';

export interface Expense {
  id: string;
  userId: string;
  title: string;
  description?: string;
  amount: number;
  currency: string;
  category: string;
  subcategory?: string;
  date: string;
  receiptUrl?: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'paid';
  submittedAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
  paidAt?: string;
  approvedBy?: string;
  rejectedBy?: string;
  rejectionReason?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseFilters {
  status?: string[];
  category?: string[];
  dateFrom?: string;
  dateTo?: string;
  amountMin?: number;
  amountMax?: number;
  search?: string;
}

export interface ExpenseState {
  expenses: Expense[];
  currentExpense: Expense | null;
  filters: ExpenseFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  isLoading: boolean;
  error: string | null;
  selectedExpenses: string[];
}

export interface ExpenseActions {
  // CRUD Operations
  fetchExpenses: (filters?: ExpenseFilters, page?: number) => Promise<void>;
  fetchExpenseById: (id: string) => Promise<void>;
  createExpense: (expenseData: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateExpense: (id: string, expenseData: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  
  // Bulk Operations
  deleteExpenses: (ids: string[]) => Promise<void>;
  updateExpenseStatus: (id: string, status: Expense['status'], reason?: string) => Promise<void>;
  bulkUpdateStatus: (ids: string[], status: Expense['status']) => Promise<void>;
  
  // Selection
  selectExpense: (id: string) => void;
  deselectExpense: (id: string) => void;
  selectAllExpenses: () => void;
  clearSelection: () => void;
  toggleExpenseSelection: (id: string) => void;
  
  // Filters and Search
  setFilters: (filters: Partial<ExpenseFilters>) => void;
  clearFilters: () => void;
  setSearch: (search: string) => void;
  
  // Pagination
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  
  // State Management
  setCurrentExpense: (expense: Expense | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Utility
  getExpenseById: (id: string) => Expense | undefined;
  getExpensesByStatus: (status: Expense['status']) => Expense[];
  getTotalAmount: () => number;
  getExpensesByCategory: () => Record<string, number>;
}

export type ExpenseStore = ExpenseState & ExpenseActions;

const useExpenseStore = create<ExpenseStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      expenses: [],
      currentExpense: null,
      filters: {},
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
      isLoading: false,
      error: null,
      selectedExpenses: [],

      // CRUD Operations
      fetchExpenses: async (filters = {}, page = 1) => {
        set({ isLoading: true, error: null });
        
        try {
          const queryParams = new URLSearchParams();
          
          // Add filters to query params
          Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
              if (Array.isArray(value)) {
                value.forEach(v => queryParams.append(key, v));
              } else {
                queryParams.append(key, String(value));
              }
            }
          });
          
          queryParams.append('page', String(page));
          queryParams.append('limit', String(get().pagination.limit));

          const response = await fetch(`/api/v1/expenses?${queryParams.toString()}`, {
            headers: getAuthHeaders(),
          });

          if (!response.ok) {
            throw new Error('Failed to fetch expenses');
          }

          const data = await response.json();
          
          set({
            expenses: data.expenses,
            pagination: {
              page: data.pagination.page,
              limit: data.pagination.limit,
              total: data.pagination.total,
              totalPages: data.pagination.totalPages,
            },
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch expenses',
            isLoading: false,
          });
        }
      },

      fetchExpenseById: async (id: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch(`/api/v1/expenses/${id}`, {
            headers: getAuthHeaders(),
          });

          if (!response.ok) {
            throw new Error('Failed to fetch expense');
          }

          const expense = await response.json();
          set({ currentExpense: expense, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch expense',
            isLoading: false,
          });
        }
      },

      createExpense: async (expenseData) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch('/api/v1/expenses', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(expenseData),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to create expense');
          }

          const newExpense = await response.json();
          
          set((state) => ({
            expenses: [newExpense, ...state.expenses],
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to create expense',
            isLoading: false,
          });
        }
      },

      updateExpense: async (id: string, expenseData) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch(`/api/v1/expenses/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(expenseData),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to update expense');
          }

          const updatedExpense = await response.json();
          
          set((state) => ({
            expenses: state.expenses.map(expense => 
              expense.id === id ? updatedExpense : expense
            ),
            currentExpense: state.currentExpense?.id === id ? updatedExpense : state.currentExpense,
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to update expense',
            isLoading: false,
          });
        }
      },

      deleteExpense: async (id: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch(`/api/v1/expenses/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
          });

          if (!response.ok) {
            throw new Error('Failed to delete expense');
          }

          set((state) => ({
            expenses: state.expenses.filter(expense => expense.id !== id),
            currentExpense: state.currentExpense?.id === id ? null : state.currentExpense,
            selectedExpenses: state.selectedExpenses.filter(expenseId => expenseId !== id),
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to delete expense',
            isLoading: false,
          });
        }
      },

      // Bulk Operations
      deleteExpenses: async (ids: string[]) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch('/api/v1/expenses/bulk-delete', {
            method: 'DELETE',
            headers: getAuthHeaders(),
            body: JSON.stringify({ ids }),
          });

          if (!response.ok) {
            throw new Error('Failed to delete expenses');
          }

          set((state) => ({
            expenses: state.expenses.filter(expense => !ids.includes(expense.id)),
            selectedExpenses: [],
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to delete expenses',
            isLoading: false,
          });
        }
      },

      updateExpenseStatus: async (id: string, status: Expense['status'], reason?: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch(`/api/v1/expenses/${id}/status`, {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify({ status, reason }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to update expense status');
          }

          const updatedExpense = await response.json();
          
          set((state) => ({
            expenses: state.expenses.map(expense => 
              expense.id === id ? updatedExpense : expense
            ),
            currentExpense: state.currentExpense?.id === id ? updatedExpense : state.currentExpense,
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to update expense status',
            isLoading: false,
          });
        }
      },

      bulkUpdateStatus: async (ids: string[], status: Expense['status']) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch('/api/v1/expenses/bulk-status', {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify({ ids, status }),
          });

          if (!response.ok) {
            throw new Error('Failed to update expense statuses');
          }

          const updatedExpenses = await response.json();
          
          set((state) => ({
            expenses: state.expenses.map(expense => {
              const updated = updatedExpenses.find((updated: Expense) => updated.id === expense.id);
              return updated || expense;
            }),
            selectedExpenses: [],
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to update expense statuses',
            isLoading: false,
          });
        }
      },

      // Selection
      selectExpense: (id: string) => {
        set((state) => ({
          selectedExpenses: [...state.selectedExpenses, id],
        }));
      },

      deselectExpense: (id: string) => {
        set((state) => ({
          selectedExpenses: state.selectedExpenses.filter(expenseId => expenseId !== id),
        }));
      },

      selectAllExpenses: () => {
        set((state) => ({
          selectedExpenses: state.expenses.map(expense => expense.id),
        }));
      },

      clearSelection: () => {
        set({ selectedExpenses: [] });
      },

      toggleExpenseSelection: (id: string) => {
        set((state) => {
          const isSelected = state.selectedExpenses.includes(id);
          return {
            selectedExpenses: isSelected
              ? state.selectedExpenses.filter(expenseId => expenseId !== id)
              : [...state.selectedExpenses, id],
          };
        });
      },

      // Filters and Search
      setFilters: (filters) => {
        set((state) => ({
          filters: { ...state.filters, ...filters },
          pagination: { ...state.pagination, page: 1 },
        }));
        get().fetchExpenses(get().filters, 1);
      },

      clearFilters: () => {
        set({ filters: {}, pagination: { ...get().pagination, page: 1 } });
        get().fetchExpenses({}, 1);
      },

      setSearch: (search: string) => {
        get().setFilters({ search });
      },

      // Pagination
      setPage: (page: number) => {
        set((state) => ({ pagination: { ...state.pagination, page } }));
        get().fetchExpenses(get().filters, page);
      },

      setLimit: (limit: number) => {
        set((state) => ({ 
          pagination: { ...state.pagination, limit, page: 1 } 
        }));
        get().fetchExpenses(get().filters, 1);
      },

      // State Management
      setCurrentExpense: (expense: Expense | null) => set({ currentExpense: expense }),
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setError: (error: string | null) => set({ error }),
      clearError: () => set({ error: null }),

      // Utility
      getExpenseById: (id: string) => {
        return get().expenses.find(expense => expense.id === id);
      },

      getExpensesByStatus: (status: Expense['status']) => {
        return get().expenses.filter(expense => expense.status === status);
      },

      getTotalAmount: () => {
        return get().expenses.reduce((total, expense) => total + expense.amount, 0);
      },

      getExpensesByCategory: () => {
        return get().expenses.reduce((acc, expense) => {
          acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
          return acc;
        }, {} as Record<string, number>);
      },
    }),
    {
      name: 'expense-store',
    }
  )
);

export default useExpenseStore;
