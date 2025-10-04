// Store exports for easy importing
import useAuthStore from './auth';
import useExpenseStore from './expense';
import useUIStore from './ui';

export { useAuthStore, useExpenseStore, useUIStore };

// Re-export types for convenience
export type { AuthActions, AuthState, AuthStore, User } from './auth';
export type {
    Expense, ExpenseActions, ExpenseFilters,
    ExpenseState, ExpenseStore
} from './expense';
export type {
    Modal, Notification, SidebarState, UIActions, UIState, UIStore
} from './ui';

// Store hooks for easy access
export const useAuth = () => useAuthStore();
export const useExpense = () => useExpenseStore();
export const useUI = () => useUIStore();

// Selector hooks for specific state slices
export const useAuthUser = () => useAuthStore((state) => state.user);
export const useAuthToken = () => useAuthStore((state) => state.token);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);

export const useExpenses = () => useExpenseStore((state) => state.expenses);
export const useCurrentExpense = () => useExpenseStore((state) => state.currentExpense);
export const useExpenseFilters = () => useExpenseStore((state) => state.filters);
export const useExpensePagination = () => useExpenseStore((state) => state.pagination);
export const useExpenseLoading = () => useExpenseStore((state) => state.isLoading);
export const useExpenseError = () => useExpenseStore((state) => state.error);
export const useSelectedExpenses = () => useExpenseStore((state) => state.selectedExpenses);

export const useTheme = () => useUIStore((state) => state.theme);
export const useNotifications = () => useUIStore((state) => state.notifications);
export const useModals = () => useUIStore((state) => state.modals);
export const useSidebar = () => useUIStore((state) => state.sidebar);
export const useGlobalLoading = () => useUIStore((state) => state.globalLoading);
export const useIsMobile = () => useUIStore((state) => state.isMobile);
export const useIsMobileMenuOpen = () => useUIStore((state) => state.isMobileMenuOpen);
export const useSearchQuery = () => useUIStore((state) => state.searchQuery);
export const useSearchResults = () => useUIStore((state) => state.searchResults);
export const useIsSearchOpen = () => useUIStore((state) => state.isSearchOpen);
export const useIsFiltersOpen = () => useUIStore((state) => state.isFiltersOpen);
export const useGlobalError = () => useUIStore((state) => state.globalError);
