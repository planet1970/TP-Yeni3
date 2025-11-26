import { useState, useEffect } from 'react';

// --- Custom Hook for LocalStorage Persistence ---
export function usePersistedState<T>(key: string, initialValue: T) {
  const [state, setState] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, state]);

  return [state, setState] as const;
}

// --- ROBUST ID GENERATOR ---
export const generateUniqueId = (prefix: string) => {
    // Use performance.now() for high-precision timing to avoid collisions
    const perf = typeof performance !== 'undefined' ? performance.now().toString().replace('.', '') : '';
    // Use Math.random for randomness
    const random = Math.random().toString(36).substr(2, 9);
    // Use Date.now for chronological ordering
    const timestamp = Date.now();
    
    return `${prefix}-${timestamp}-${perf}-${random}`;
};