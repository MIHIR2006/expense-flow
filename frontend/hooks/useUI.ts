import { useCallback, useEffect } from 'react';
import { useUIStore } from '../stores';

/**
 * Custom hook for UI functionality
 * Provides easy access to UI state and actions
 */
export const useUI = () => {
  const store = useUIStore();

  return {
    // State
    theme: store.theme,
    notifications: store.notifications,
    modals: store.modals,
    sidebar: store.sidebar,
    globalLoading: store.globalLoading,
    loadingStates: store.loadingStates,
    isMobile: store.isMobile,
    isMobileMenuOpen: store.isMobileMenuOpen,
    searchQuery: store.searchQuery,
    searchResults: store.searchResults,
    isSearchOpen: store.isSearchOpen,
    isFiltersOpen: store.isFiltersOpen,
    currentPage: store.currentPage,
    itemsPerPage: store.itemsPerPage,
    globalError: store.globalError,

    // Actions
    setTheme: store.setTheme,
    toggleTheme: store.toggleTheme,
    addNotification: store.addNotification,
    removeNotification: store.removeNotification,
    clearNotifications: store.clearNotifications,
    showSuccess: store.showSuccess,
    showError: store.showError,
    showWarning: store.showWarning,
    showInfo: store.showInfo,
    openModal: store.openModal,
    closeModal: store.closeModal,
    closeAllModals: store.closeAllModals,
    updateModal: store.updateModal,
    toggleSidebar: store.toggleSidebar,
    setSidebarOpen: store.setSidebarOpen,
    setSidebarCollapsed: store.setSidebarCollapsed,
    setActiveSidebarItem: store.setActiveSidebarItem,
    setGlobalLoading: store.setGlobalLoading,
    setLoadingState: store.setLoadingState,
    clearLoadingState: store.clearLoadingState,
    setIsMobile: store.setIsMobile,
    toggleMobileMenu: store.toggleMobileMenu,
    setMobileMenuOpen: store.setMobileMenuOpen,
    setSearchQuery: store.setSearchQuery,
    setSearchResults: store.setSearchResults,
    setSearchOpen: store.setSearchOpen,
    clearSearch: store.clearSearch,
    setFiltersOpen: store.setFiltersOpen,
    toggleFilters: store.toggleFilters,
    setCurrentPage: store.setCurrentPage,
    setItemsPerPage: store.setItemsPerPage,
    setGlobalError: store.setGlobalError,
    clearGlobalError: store.clearGlobalError,
    resetUI: store.resetUI,
  };
};

/**
 * Hook for notification management
 */
export const useNotifications = () => {
  const { 
    notifications, 
    addNotification, 
    removeNotification, 
    clearNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo 
  } = useUI();

  const addSuccessNotification = useCallback((title: string, message: string, duration?: number) => {
    showSuccess(title, message, duration);
  }, [showSuccess]);

  const addErrorNotification = useCallback((title: string, message: string, duration?: number) => {
    showError(title, message, duration);
  }, [showError]);

  const addWarningNotification = useCallback((title: string, message: string, duration?: number) => {
    showWarning(title, message, duration);
  }, [showWarning]);

  const addInfoNotification = useCallback((title: string, message: string, duration?: number) => {
    showInfo(title, message, duration);
  }, [showInfo]);

  return {
    notifications,
    addNotification,
    addSuccessNotification,
    addErrorNotification,
    addWarningNotification,
    addInfoNotification,
    removeNotification,
    clearNotifications,
  };
};

/**
 * Hook for modal management
 */
export const useModals = () => {
  const { modals, openModal, closeModal, closeAllModals, updateModal } = useUI();

  const openExpenseFormModal = useCallback((expenseData?: any) => {
    return openModal({
      type: 'expense-form',
      data: expenseData,
    });
  }, [openModal]);

  const openExpenseDetailsModal = useCallback((expenseId: string) => {
    return openModal({
      type: 'expense-details',
      data: { expenseId },
    });
  }, [openModal]);

  const openConfirmationModal = useCallback((data: {
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel?: () => void;
  }) => {
    return openModal({
      type: 'confirmation',
      data,
    });
  }, [openModal]);

  const openReceiptViewerModal = useCallback((receiptUrl: string) => {
    return openModal({
      type: 'receipt-viewer',
      data: { receiptUrl },
    });
  }, [openModal]);

  const openBulkActionsModal = useCallback((expenseIds: string[]) => {
    return openModal({
      type: 'bulk-actions',
      data: { expenseIds },
    });
  }, [openModal]);

  return {
    modals,
    openModal,
    openExpenseFormModal,
    openExpenseDetailsModal,
    openConfirmationModal,
    openReceiptViewerModal,
    openBulkActionsModal,
    closeModal,
    closeAllModals,
    updateModal,
  };
};

/**
 * Hook for responsive behavior
 */
export const useResponsive = () => {
  const { isMobile, setIsMobile, isMobileMenuOpen, toggleMobileMenu, setMobileMenuOpen } = useUI();

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsMobile]);

  // Close mobile menu when screen becomes larger
  useEffect(() => {
    if (!isMobile && isMobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  }, [isMobile, isMobileMenuOpen, setMobileMenuOpen]);

  return {
    isMobile,
    isMobileMenuOpen,
    toggleMobileMenu,
    setMobileMenuOpen,
  };
};

/**
 * Hook for loading states
 */
export const useLoading = (key?: string) => {
  const { globalLoading, loadingStates, setGlobalLoading, setLoadingState, clearLoadingState } = useUI();

  const isLoading = key ? loadingStates[key] || false : globalLoading;
  
  const setLoading = useCallback((loading: boolean) => {
    if (key) {
      setLoadingState(key, loading);
    } else {
      setGlobalLoading(loading);
    }
  }, [key, setLoadingState, setGlobalLoading]);

  const clearLoading = useCallback(() => {
    if (key) {
      clearLoadingState(key);
    } else {
      setGlobalLoading(false);
    }
  }, [key, clearLoadingState, setGlobalLoading]);

  return {
    isLoading,
    setLoading,
    clearLoading,
  };
};
