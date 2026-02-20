/**
 * Date and Time Formatting Utilities
 * 
 * This file contains reusable functions for formatting dates and times
 * in various formats used throughout the service detail pages.
 */

/**
 * Formats a date string (YYYY-MM-DD) to Thai format (DD MMM YYYY)
 * Example: "2024-01-15" -> "15 ม.ค. 2024"
 */
export const formatDateToThai = (dateString?: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const months = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

/**
 * Formats a time string (HH:MM) to Thai format (HH.MM น.)
 * Example: "14:30" -> "14.30 น."
 */
export const formatTimeToThai = (timeString?: string): string => {
  if (!timeString) return "";
  const [hours, minutes] = timeString.split(":");
  return `${hours}.${minutes} น.`;
};

/**
 * Converts date from YYYY-MM-DD format to DD/MM/YYYY format
 * Example: "2024-01-15" -> "15/01/2024"
 */
export const formatDateToDDMMYYYY = (dateString: string): string => {
  if (!dateString) return "";
  // If already in YYYY-MM-DD format, convert to DD/MM/YYYY
  if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  }
  // If already in DD/MM/YYYY format, return as is
  return dateString;
};

/**
 * Converts date from DD/MM/YYYY format to YYYY-MM-DD format
 * Example: "15/01/2024" -> "2024-01-15"
 */
export const formatDateToYYYYMMDD = (dateString: string): string => {
  if (!dateString) return "";
  // If in DD/MM/YYYY format, convert to YYYY-MM-DD
  if (dateString.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
    const [day, month, year] = dateString.split("/");
    return `${year}-${month}-${day}`;
  }
  // If already in YYYY-MM-DD format, return as is
  return dateString;
};

/**
 * Validates a date string in DD/MM/YYYY format
 * Returns true if the date is valid, false otherwise
 */
export const validateDate = (dateString: string): boolean => {
  if (!dateString) return false;
  const match = dateString.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return false;
  const [, day, month, year] = match;
  const dayNum = parseInt(day, 10);
  const monthNum = parseInt(month, 10);
  const yearNum = parseInt(year, 10);
  
  if (monthNum < 1 || monthNum > 12) return false;
  if (dayNum < 1 || dayNum > 31) return false;
  
  const date = new Date(yearNum, monthNum - 1, dayNum);
  return (
    date.getFullYear() === yearNum &&
    date.getMonth() === monthNum - 1 &&
    date.getDate() === dayNum
  );
};
