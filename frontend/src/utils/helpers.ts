// utils/helpers.ts

import React from "react";

/**
 * Fonction debounce pour limiter la fréquence d'exécution d'une fonction
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Fonction throttle pour limiter l'exécution d'une fonction
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Cache simple avec expiration
 */
export class SimpleCache<T = any> {
  private cache = new Map<string, { data: T; timestamp: number }>();
  private defaultTtl: number;

  constructor(defaultTtl: number = 5 * 60 * 1000) {
    this.defaultTtl = defaultTtl;
  }

  set(key: string, data: T, ttl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now() + (ttl || this.defaultTtl)
    });
  }

  get(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.timestamp) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

/**
 * Fonction pour grouper des éléments par une clé
 */
export const groupBy = <T, K extends keyof any>(
  array: T[],
  getKey: (item: T) => K
): Record<K, T[]> => {
  return array.reduce((result, currentItem) => {
    const groupKey = getKey(currentItem);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(currentItem);
    return result;
  }, {} as Record<K, T[]>);
};

/**
 * Fonction pour filtrer et rechercher dans un tableau
 */
export const filterAndSearch = <T>(
  items: T[],
  searchTerm: string,
  searchFields: (keyof T)[],
  filters?: Partial<Record<keyof T, any>>
): T[] => {
  let filtered = items;

  // Appliquer les filtres
  if (filters) {
    filtered = filtered.filter(item => {
      return Object.entries(filters).every(([key, value]) => {
        if (value === undefined || value === null || value === '') return true;
        return item[key as keyof T] === value;
      });
    });
  }

  // Appliquer la recherche
  if (searchTerm) {
    const lowercaseSearch = searchTerm.toLowerCase();
    filtered = filtered.filter(item =>
      searchFields.some(field => {
        const fieldValue = item[field];
        return fieldValue && 
          String(fieldValue).toLowerCase().includes(lowercaseSearch);
      })
    );
  }

  return filtered;
};

/**
 * Hook personnalisé pour la recherche avec debounce
 */
export const useDebouncedValue = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Utilitaire pour créer des requêtes avec retry
 */
export const withRetry = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (i === maxRetries) {
        throw lastError;
      }
      
      // Attendre avant le prochain essai (backoff exponentiel)
      await new Promise(resolve => 
        setTimeout(resolve, delay * Math.pow(2, i))
      );
    }
  }

  throw lastError!;
};