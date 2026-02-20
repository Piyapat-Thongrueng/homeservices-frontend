/**
 * Router Helper Functions
 * 
 * This file contains reusable functions for parsing router query parameters
 * and handling navigation logic.
 */

import type { ServiceItem } from "@/components/servicedetail/types";

/**
 * Parses service items from router query string
 * Returns parsed items array or empty array if invalid
 */
export const parseServiceItemsFromQuery = (queryItems?: string | string[]): ServiceItem[] => {
  if (!queryItems) return [];
  
  try {
    const itemsString = Array.isArray(queryItems) ? queryItems[0] : queryItems;
    return JSON.parse(itemsString) as ServiceItem[];
  } catch (e) {
    console.error("Error parsing service items from query:", e);
    return [];
  }
};

/**
 * Parses service info from router query string
 * Returns parsed service info object or null if invalid
 */
export const parseServiceInfoFromQuery = (queryServiceInfo?: string | string[]): any | null => {
  if (!queryServiceInfo) return null;
  
  try {
    const infoString = Array.isArray(queryServiceInfo) ? queryServiceInfo[0] : queryServiceInfo;
    return JSON.parse(infoString);
  } catch (e) {
    console.error("Error parsing service info from query:", e);
    return null;
  }
};
