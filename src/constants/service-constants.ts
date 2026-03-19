/**
 * Service Detail Constants
 * 
 * This file contains all constants used across service detail pages,
 * including storage keys, default values, and configuration.
 */

import type { ServiceItem } from "@/features/servicedetail/types";

// ============================================================================
// LocalStorage Keys
// ============================================================================

/** Key for storing all service items with quantities */
export const ALL_ITEMS_STORAGE_KEY = "allServiceItems";

/** Key for storing selected service items */
export const SERVICE_ITEMS_STORAGE_KEY = "serviceItems";

/** Key for storing service information form data */
export const SERVICE_INFO_STORAGE_KEY = "serviceInfo";

/** Key for storing payment data */
export const PAYMENT_DATA_STORAGE_KEY = "paymentData";

// ============================================================================
// Promotion Codes
// ============================================================================

/** Valid promotion codes and their discount amounts */
export const VALID_PROMOTION_CODES: { [key: string]: number } = {
  "HOME0202": 50,
  "WELCOME10": 10,
  "SAVE20": 20,
};
