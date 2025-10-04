/**
 * Utility functions for authentication
 */

export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      const parsed = JSON.parse(authStorage);
      return parsed.state?.token || null;
    }
  } catch (error) {
    console.error('Error parsing auth storage:', error);
  }
  
  return null;
};

export const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  
  if (token) {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }
  
  return {
    'Content-Type': 'application/json',
  };
};
