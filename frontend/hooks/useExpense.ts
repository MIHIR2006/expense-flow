import { useCallback, useMemo } from 'react';
import { useExpenseStore } from '../stores';

/**
 * Custom hook for expense functionality
 * Provides easy access to expense state and actions
 */
export const useExpense = () => {
  const store = useExpenseStore();

  return {
    // State
    expenses: store.expenses,
    currentExpense: store.currentExpense,
    filters: store.filters,
    pagination: store.pagination,
    isLoading: store.isLoading,
    error: store.error,
    selectedExpenses: store.selectedExpenses,

    // Actions
    fetchExpenses: store.fetchExpenses,
    fetchExpenseById: store.fetchExpenseById,
    createExpense: store.createExpense,
    updateExpense: store.updateExpense,
    deleteExpense: store.deleteExpense,
    deleteExpenses: store.deleteExpenses,
    updateExpenseStatus: store.updateExpenseStatus,
    bulkUpdateStatus: store.bulkUpdateStatus,
    selectExpense: store.selectExpense,
    deselectExpense: store.deselectExpense,
    selectAllExpenses: store.selectAllExpenses,
    clearSelection: store.clearSelection,
    toggleExpenseSelection: store.toggleExpenseSelection,
    setFilters: store.setFilters,
    clearFilters: store.clearFilters,
    setSearch: store.setSearch,
    setPage: store.setPage,
    setLimit: store.setLimit,
    setCurrentExpense: store.setCurrentExpense,
    setLoading: store.setLoading,
    setError: store.setError,
    clearError: store.clearError,

    // Utility functions
    getExpenseById: store.getExpenseById,
    getExpensesByStatus: store.getExpensesByStatus,
    getTotalAmount: store.getTotalAmount,
    getExpensesByCategory: store.getExpensesByCategory,
  };
};

/**
 * Hook for expense statistics and analytics
 */
export const useExpenseStats = () => {
  const { expenses, getTotalAmount, getExpensesByCategory } = useExpense();

  const stats = useMemo(() => {
    const totalAmount = getTotalAmount();
    const expensesByCategory = getExpensesByCategory();
    const expensesByStatus = expenses.reduce((acc, expense) => {
      acc[expense.status] = (acc[expense.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const monthlyExpenses = expenses.reduce((acc, expense) => {
      const month = new Date(expense.date).toISOString().slice(0, 7); // YYYY-MM
      acc[month] = (acc[month] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    const averageExpense = expenses.length > 0 ? totalAmount / expenses.length : 0;

    return {
      totalAmount,
      totalCount: expenses.length,
      averageExpense,
      expensesByCategory,
      expensesByStatus,
      monthlyExpenses,
    };
  }, [expenses, getTotalAmount, getExpensesByCategory]);

  return stats;
};

/**
 * Hook for expense filtering and search
 */
export const useExpenseFilters = () => {
  const { filters, setFilters, clearFilters, setSearch } = useExpense();

  const updateFilter = useCallback((key: string, value: any) => {
    setFilters({ [key]: value });
  }, [setFilters]);

  const addStatusFilter = useCallback((status: string) => {
    const currentStatuses = filters.status || [];
    if (!currentStatuses.includes(status)) {
      setFilters({ status: [...currentStatuses, status] });
    }
  }, [filters.status, setFilters]);

  const removeStatusFilter = useCallback((status: string) => {
    const currentStatuses = filters.status || [];
    setFilters({ status: currentStatuses.filter(s => s !== status) });
  }, [filters.status, setFilters]);

  const addCategoryFilter = useCallback((category: string) => {
    const currentCategories = filters.category || [];
    if (!currentCategories.includes(category)) {
      setFilters({ category: [...currentCategories, category] });
    }
  }, [filters.category, setFilters]);

  const removeCategoryFilter = useCallback((category: string) => {
    const currentCategories = filters.category || [];
    setFilters({ category: currentCategories.filter(c => c !== category) });
  }, [filters.category, setFilters]);

  const setDateRange = useCallback((dateFrom: string, dateTo: string) => {
    setFilters({ dateFrom, dateTo });
  }, [setFilters]);

  const setAmountRange = useCallback((amountMin: number, amountMax: number) => {
    setFilters({ amountMin, amountMax });
  }, [setFilters]);

  return {
    filters,
    updateFilter,
    addStatusFilter,
    removeStatusFilter,
    addCategoryFilter,
    removeCategoryFilter,
    setDateRange,
    setAmountRange,
    setSearch,
    clearFilters,
  };
};

/**
 * Hook for expense selection management
 */
export const useExpenseSelection = () => {
  const { 
    selectedExpenses, 
    selectExpense, 
    deselectExpense, 
    selectAllExpenses, 
    clearSelection, 
    toggleExpenseSelection,
    expenses 
  } = useExpense();

  const isAllSelected = useMemo(() => {
    return expenses.length > 0 && selectedExpenses.length === expenses.length;
  }, [expenses.length, selectedExpenses.length]);

  const isPartiallySelected = useMemo(() => {
    return selectedExpenses.length > 0 && selectedExpenses.length < expenses.length;
  }, [selectedExpenses.length, expenses.length]);

  const selectedExpensesData = useMemo(() => {
    return expenses.filter(expense => selectedExpenses.includes(expense.id));
  }, [expenses, selectedExpenses]);

  const selectedAmount = useMemo(() => {
    return selectedExpensesData.reduce((total, expense) => total + expense.amount, 0);
  }, [selectedExpensesData]);

  return {
    selectedExpenses,
    selectedExpensesData,
    selectedAmount,
    isAllSelected,
    isPartiallySelected,
    selectExpense,
    deselectExpense,
    selectAllExpenses,
    clearSelection,
    toggleExpenseSelection,
  };
};
