import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface Modal {
  id: string;
  type: 'expense-form' | 'expense-details' | 'confirmation' | 'receipt-viewer' | 'bulk-actions';
  isOpen: boolean;
  data?: any;
  onClose?: () => void;
  onConfirm?: () => void;
}

export interface SidebarState {
  isOpen: boolean;
  isCollapsed: boolean;
  activeItem?: string;
}

export interface UIState {
  // Theme
  theme: 'light' | 'dark' | 'system';
  
  // Notifications
  notifications: Notification[];
  
  // Modals
  modals: Modal[];
  
  // Sidebar
  sidebar: SidebarState;
  
  // Loading states
  globalLoading: boolean;
  loadingStates: Record<string, boolean>;
  
  // Mobile
  isMobile: boolean;
  isMobileMenuOpen: boolean;
  
  // Search
  searchQuery: string;
  searchResults: any[];
  isSearchOpen: boolean;
  
  // Filters
  isFiltersOpen: boolean;
  
  // Pagination
  currentPage: number;
  itemsPerPage: number;
  
  // Error states
  globalError: string | null;
}

export interface UIActions {
  // Theme
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleTheme: () => void;
  
  // Notifications
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  showSuccess: (title: string, message: string, duration?: number) => void;
  showError: (title: string, message: string, duration?: number) => void;
  showWarning: (title: string, message: string, duration?: number) => void;
  showInfo: (title: string, message: string, duration?: number) => void;
  
  // Modals
  openModal: (modal: Omit<Modal, 'id' | 'isOpen'>) => string;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
  updateModal: (id: string, updates: Partial<Modal>) => void;
  
  // Sidebar
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  setSidebarCollapsed: (isCollapsed: boolean) => void;
  setActiveSidebarItem: (item: string) => void;
  
  // Loading states
  setGlobalLoading: (loading: boolean) => void;
  setLoadingState: (key: string, loading: boolean) => void;
  clearLoadingState: (key: string) => void;
  
  // Mobile
  setIsMobile: (isMobile: boolean) => void;
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (isOpen: boolean) => void;
  
  // Search
  setSearchQuery: (query: string) => void;
  setSearchResults: (results: any[]) => void;
  setSearchOpen: (isOpen: boolean) => void;
  clearSearch: () => void;
  
  // Filters
  setFiltersOpen: (isOpen: boolean) => void;
  toggleFilters: () => void;
  
  // Pagination
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (items: number) => void;
  
  // Error states
  setGlobalError: (error: string | null) => void;
  clearGlobalError: () => void;
  
  // Utility
  resetUI: () => void;
}

export type UIStore = UIState & UIActions;

const useUIStore = create<UIStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      theme: 'system',
      notifications: [],
      modals: [],
      sidebar: {
        isOpen: true,
        isCollapsed: false,
        activeItem: undefined,
      },
      globalLoading: false,
      loadingStates: {},
      isMobile: false,
      isMobileMenuOpen: false,
      searchQuery: '',
      searchResults: [],
      isSearchOpen: false,
      isFiltersOpen: false,
      currentPage: 1,
      itemsPerPage: 10,
      globalError: null,

      // Theme
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => {
        const { theme } = get();
        const newTheme = theme === 'light' ? 'dark' : 'light';
        set({ theme: newTheme });
      },

      // Notifications
      addNotification: (notification) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newNotification = { ...notification, id };
        
        set((state) => ({
          notifications: [...state.notifications, newNotification],
        }));

        // Auto-remove notification after duration
        if (notification.duration && notification.duration > 0) {
          setTimeout(() => {
            get().removeNotification(id);
          }, notification.duration);
        }
      },

      removeNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter(notification => notification.id !== id),
        }));
      },

      clearNotifications: () => set({ notifications: [] }),

      showSuccess: (title, message, duration = 5000) => {
        get().addNotification({
          type: 'success',
          title,
          message,
          duration,
        });
      },

      showError: (title, message, duration = 7000) => {
        get().addNotification({
          type: 'error',
          title,
          message,
          duration,
        });
      },

      showWarning: (title, message, duration = 6000) => {
        get().addNotification({
          type: 'warning',
          title,
          message,
          duration,
        });
      },

      showInfo: (title, message, duration = 5000) => {
        get().addNotification({
          type: 'info',
          title,
          message,
          duration,
        });
      },

      // Modals
      openModal: (modal) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newModal = { ...modal, id, isOpen: true };
        
        set((state) => ({
          modals: [...state.modals, newModal],
        }));

        return id;
      },

      closeModal: (id) => {
        set((state) => ({
          modals: state.modals.map(modal =>
            modal.id === id ? { ...modal, isOpen: false } : modal
          ),
        }));

        // Remove modal from state after animation
        setTimeout(() => {
          set((state) => ({
            modals: state.modals.filter(modal => modal.id !== id),
          }));
        }, 300);
      },

      closeAllModals: () => {
        set((state) => ({
          modals: state.modals.map(modal => ({ ...modal, isOpen: false })),
        }));

        setTimeout(() => {
          set({ modals: [] });
        }, 300);
      },

      updateModal: (id, updates) => {
        set((state) => ({
          modals: state.modals.map(modal =>
            modal.id === id ? { ...modal, ...updates } : modal
          ),
        }));
      },

      // Sidebar
      toggleSidebar: () => {
        set((state) => ({
          sidebar: { ...state.sidebar, isOpen: !state.sidebar.isOpen },
        }));
      },

      setSidebarOpen: (isOpen) => {
        set((state) => ({
          sidebar: { ...state.sidebar, isOpen },
        }));
      },

      setSidebarCollapsed: (isCollapsed) => {
        set((state) => ({
          sidebar: { ...state.sidebar, isCollapsed },
        }));
      },

      setActiveSidebarItem: (item) => {
        set((state) => ({
          sidebar: { ...state.sidebar, activeItem: item },
        }));
      },

      // Loading states
      setGlobalLoading: (loading) => set({ globalLoading: loading }),
      
      setLoadingState: (key, loading) => {
        set((state) => ({
          loadingStates: { ...state.loadingStates, [key]: loading },
        }));
      },

      clearLoadingState: (key) => {
        set((state) => {
          const newLoadingStates = { ...state.loadingStates };
          delete newLoadingStates[key];
          return { loadingStates: newLoadingStates };
        });
      },

      // Mobile
      setIsMobile: (isMobile) => set({ isMobile }),
      toggleMobileMenu: () => {
        set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen }));
      },
      setMobileMenuOpen: (isOpen) => set({ isMobileMenuOpen: isOpen }),

      // Search
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSearchResults: (results) => set({ searchResults: results }),
      setSearchOpen: (isOpen) => set({ isSearchOpen: isOpen }),
      clearSearch: () => {
        set({
          searchQuery: '',
          searchResults: [],
          isSearchOpen: false,
        });
      },

      // Filters
      setFiltersOpen: (isOpen) => set({ isFiltersOpen: isOpen }),
      toggleFilters: () => {
        set((state) => ({ isFiltersOpen: !state.isFiltersOpen }));
      },

      // Pagination
      setCurrentPage: (page) => set({ currentPage: page }),
      setItemsPerPage: (items) => set({ itemsPerPage: items }),

      // Error states
      setGlobalError: (error) => set({ globalError: error }),
      clearGlobalError: () => set({ globalError: null }),

      // Utility
      resetUI: () => {
        set({
          notifications: [],
          modals: [],
          sidebar: {
            isOpen: true,
            isCollapsed: false,
            activeItem: undefined,
          },
          globalLoading: false,
          loadingStates: {},
          isMobileMenuOpen: false,
          searchQuery: '',
          searchResults: [],
          isSearchOpen: false,
          isFiltersOpen: false,
          currentPage: 1,
          itemsPerPage: 10,
          globalError: null,
        });
      },
    }),
    {
      name: 'ui-store',
    }
  )
);

export default useUIStore;
