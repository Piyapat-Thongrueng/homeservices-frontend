/**
 * LocalStorage Helper Functions
 * 
 * This file contains reusable functions for managing localStorage operations
 * with proper error handling and type safety.
 */

/**
 * Safely retrieves and parses JSON data from localStorage
 * Returns the parsed data or null if not found or invalid
 */
export const getFromLocalStorage = <T>(key: string): T | null => {
  if (typeof window === "undefined") return null;
  
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;
    return JSON.parse(item) as T;
  } catch (e) {
    console.error(`Error parsing localStorage item "${key}":`, e);
    return null;
  }
};

/**
 * Safely saves data to localStorage as JSON
 * Returns true if successful, false otherwise
 */
export const saveToLocalStorage = <T>(key: string, data: T): boolean => {
  if (typeof window === "undefined") return false;
  
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error(`Error saving to localStorage "${key}":`, e);
    return false;
  }
};

/**
 * Builds a localStorage key that is scoped to the current user and service.
 *
 * This is used across the multi-step service detail flow so that:
 * - Each user has isolated storage (via `userId`)
 * - Each service booking has its own namespace (via `serviceId` from the router)
 *
 * Example shape: `${baseKey}_${userId}_${serviceId}`
 */
export const getServiceScopedKey = (
  baseKey: string,
  serviceIdParam?: string | string[],
  userId?: string,
): string => {
  let key = baseKey;

  if (userId) {
    key = `${key}_${userId}`;
  }

  if (serviceIdParam) {
    const id = Array.isArray(serviceIdParam) ? serviceIdParam[0] : serviceIdParam;
    key = `${key}_${id}`;
  }

  return key;
};

