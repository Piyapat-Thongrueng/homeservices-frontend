/**
 * Category color presets used to style service category badges.
 *
 * Centralizes Tailwind color classes so that cards and filters can share
 * a consistent visual language for each service category.
 */
export const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  Cleaning: { bg: "bg-sky-100", text: "text-sky-700" },
  Repair: { bg: "bg-orange-100", text: "text-orange-700" },
  Installation: { bg: "bg-violet-100", text: "text-violet-700" },
  Maintenance: { bg: "bg-green-100", text: "text-green-700" },
  Electrical: { bg: "bg-yellow-100", text: "text-yellow-700" },
  Plumbing: { bg: "bg-teal-100", text: "text-teal-700" },
};

// Fallback styling for categories that do not have a specific color mapping.
export const DEFAULT_CATEGORY_COLOR = {
  bg: "bg-gray-100",
  text: "text-gray-600",
};

/**
 * Returns the color config for a given category name, or a fallback when
 * the category is unknown.
 */
export const getCategoryColor = (categoryName: string) =>
  CATEGORY_COLORS[categoryName] ?? DEFAULT_CATEGORY_COLOR;
