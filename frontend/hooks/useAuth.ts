import { useEffect } from 'react';
import { useAuthStore } from '../stores';

/**
 * Custom hook for authentication functionality
 * Provides easy access to auth state and actions
 */
export const useAuth = () => {
  const store = useAuthStore();

  // Auto-refresh token on mount if user is authenticated
  useEffect(() => {
    if (store.isAuthenticated && store.token) {
      // Set up token refresh interval (refresh every 25 minutes)
      const interval = setInterval(() => {
        store.refreshToken();
      }, 25 * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [store.isAuthenticated, store.token, store.refreshToken]);

  return {
    // State
    user: store.user,
    token: store.token,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    error: store.error,

    // Actions
    login: store.login,
    register: store.register,
    logout: store.logout,
    refreshToken: store.refreshToken,
    clearError: store.clearError,
    setLoading: store.setLoading,
    setUser: store.setUser,
    setToken: store.setToken,

    // Computed values
    isAdmin: store.user?.role === 'admin',
    isManager: store.user?.role === 'manager',
    isEmployee: store.user?.role === 'employee',
    fullName: store.user ? `${store.user.firstName} ${store.user.lastName}` : '',
    initials: store.user 
      ? `${store.user.firstName[0]}${store.user.lastName[0]}`.toUpperCase()
      : '',
  };
};

/**
 * Hook to check if user has specific role
 */
export const useRole = (requiredRole: 'admin' | 'manager' | 'employee') => {
  const { user } = useAuth();
  
  if (!user) return false;
  
  const roleHierarchy = {
    admin: 3,
    manager: 2,
    employee: 1,
  };
  
  return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
};

/**
 * Hook to check if user can perform specific actions
 */
export const usePermissions = () => {
  const { user, isAdmin, isManager } = useAuth();
  
  if (!user) return {
    canCreateExpense: false,
    canEditExpense: false,
    canDeleteExpense: false,
    canApproveExpense: false,
    canRejectExpense: false,
    canViewAllExpenses: false,
    canManageUsers: false,
    canViewReports: false,
  };

  return {
    canCreateExpense: true, // All authenticated users can create expenses
    canEditExpense: (expenseUserId: string) => 
      user.id === expenseUserId || isAdmin || isManager,
    canDeleteExpense: (expenseUserId: string) => 
      user.id === expenseUserId || isAdmin,
    canApproveExpense: isAdmin || isManager,
    canRejectExpense: isAdmin || isManager,
    canViewAllExpenses: isAdmin || isManager,
    canManageUsers: isAdmin,
    canViewReports: isAdmin || isManager,
  };
};
