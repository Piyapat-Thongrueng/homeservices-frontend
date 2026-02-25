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
 * Removes an item from localStorage
 */
export const removeFromLocalStorage = (key: string): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(key);
};
