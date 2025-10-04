# Zustand State Management

This directory contains the Zustand stores for the Expense Flow application. Zustand is a lightweight state management library that provides a simple and intuitive API for managing application state.

## Store Structure

### 1. Auth Store (`auth.ts`)
Manages authentication state and user information.

**State:**
- `user`: Current user object
- `token`: JWT access token
- `isAuthenticated`: Authentication status
- `isLoading`: Loading state for auth operations
- `error`: Error messages

**Actions:**
- `login(email, password)`: Authenticate user
- `register(userData)`: Register new user
- `logout()`: Clear authentication state
- `refreshToken()`: Refresh access token
- `clearError()`: Clear error messages

**Persistence:**
- User data and token are persisted to localStorage
- Automatically restored on app reload

### 2. Expense Store (`expense.ts`)
Manages expense data and operations.

**State:**
- `expenses`: Array of expense objects
- `currentExpense`: Currently selected expense
- `filters`: Current filter settings
- `pagination`: Pagination information
- `isLoading`: Loading state
- `error`: Error messages
- `selectedExpenses`: Array of selected expense IDs

**Actions:**
- `fetchExpenses(filters?, page?)`: Fetch expenses with optional filters
- `createExpense(expenseData)`: Create new expense
- `updateExpense(id, data)`: Update existing expense
- `deleteExpense(id)`: Delete expense
- `updateExpenseStatus(id, status, reason?)`: Update expense status
- `setFilters(filters)`: Apply filters
- `selectExpense(id)`: Select expense for bulk operations
- `clearSelection()`: Clear all selections

**Features:**
- CRUD operations for expenses
- Bulk operations (delete, status update)
- Advanced filtering and search
- Pagination support
- Selection management
- Real-time updates

### 3. UI Store (`ui.ts`)
Manages global UI state and interactions.

**State:**
- `theme`: Current theme (light/dark/system)
- `notifications`: Array of notification objects
- `modals`: Array of open modals
- `sidebar`: Sidebar state and configuration
- `globalLoading`: Global loading state
- `loadingStates`: Named loading states
- `isMobile`: Mobile device detection
- `searchQuery`: Current search query
- `isSearchOpen`: Search modal state
- `isFiltersOpen`: Filters panel state

**Actions:**
- `setTheme(theme)`: Change theme
- `addNotification(notification)`: Show notification
- `openModal(modal)`: Open modal dialog
- `closeModal(id)`: Close specific modal
- `toggleSidebar()`: Toggle sidebar visibility
- `setLoadingState(key, loading)`: Set named loading state
- `setSearchQuery(query)`: Update search query

**Features:**
- Theme management with system preference detection
- Toast notifications with auto-dismiss
- Modal management system
- Responsive sidebar
- Loading state management
- Search functionality
- Mobile detection and menu management

## Usage Examples

### Basic Store Usage

```typescript
import { useAuth, useExpense, useUI } from '@/stores';

function MyComponent() {
  const { user, login, logout } = useAuth();
  const { expenses, fetchExpenses } = useExpense();
  const { theme, toggleTheme } = useUI();

  // Use the state and actions
}
```

### Using Custom Hooks

```typescript
import { useAuth, useExpenseStats, useNotifications } from '@/hooks';

function Dashboard() {
  const { isAuthenticated, fullName } = useAuth();
  const stats = useExpenseStats();
  const { showSuccess } = useNotifications();

  // Use the enhanced functionality
}
```

### Selector Hooks

```typescript
import { useAuthUser, useExpenses, useTheme } from '@/stores';

function UserProfile() {
  const user = useAuthUser(); // Only re-renders when user changes
  const expenses = useExpenses(); // Only re-renders when expenses change
  const theme = useTheme(); // Only re-renders when theme changes
}
```

## Store Features

### Persistence
- Auth store persists user data and token
- Other stores maintain state during session
- Automatic rehydration on app reload

### DevTools Integration
- All stores include Redux DevTools support
- Easy debugging and state inspection
- Time-travel debugging capabilities

### TypeScript Support
- Full TypeScript support with strict typing
- IntelliSense and autocomplete
- Compile-time error checking

### Performance Optimizations
- Selective subscriptions to prevent unnecessary re-renders
- Memoized selectors for computed values
- Efficient state updates

## Best Practices

### 1. Use Custom Hooks
Instead of directly accessing stores, use the provided custom hooks for better encapsulation and reusability.

```typescript
// Good
const { user, login } = useAuth();

// Avoid
const user = useAuthStore(state => state.user);
const login = useAuthStore(state => state.login);
```

### 2. Selector Hooks for Performance
Use selector hooks to prevent unnecessary re-renders.

```typescript
// Good - only re-renders when user changes
const user = useAuthUser();

// Avoid - re-renders on any auth store change
const { user } = useAuth();
```

### 3. Error Handling
Always handle errors from async operations.

```typescript
const handleLogin = async (email: string, password: string) => {
  try {
    await login(email, password);
    showSuccess('Success', 'Logged in successfully');
  } catch (error) {
    showError('Error', 'Login failed');
  }
};
```

### 4. Loading States
Use loading states to provide user feedback.

```typescript
const { isLoading, fetchExpenses } = useExpense();

useEffect(() => {
  fetchExpenses();
}, [fetchExpenses]);

if (isLoading) {
  return <LoadingSpinner />;
}
```

## Store Dependencies

The stores are designed to work independently, but some cross-store interactions are handled through the custom hooks:

- Auth store provides user context for API calls
- Expense store uses auth token for authenticated requests
- UI store provides global state for all components

## Testing

Each store can be tested independently:

```typescript
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '@/hooks/useAuth';

test('should login user', async () => {
  const { result } = renderHook(() => useAuth());
  
  await act(async () => {
    await result.current.login('test@example.com', 'password');
  });
  
  expect(result.current.isAuthenticated).toBe(true);
  expect(result.current.user).toBeDefined();
});
```

## Migration Guide

If migrating from other state management solutions:

1. **From Redux**: Zustand stores are simpler and don't require reducers or actions
2. **From Context API**: Zustand provides better performance and less boilerplate
3. **From MobX**: Zustand has a more predictable update pattern

## Troubleshooting

### Common Issues

1. **Store not updating**: Check if you're using the correct selector
2. **Infinite re-renders**: Ensure you're not creating new objects in selectors
3. **Persistence issues**: Check localStorage permissions and storage limits

### Debug Tools

- Use Redux DevTools to inspect store state
- Enable Zustand devtools for debugging
- Use React DevTools Profiler for performance analysis
