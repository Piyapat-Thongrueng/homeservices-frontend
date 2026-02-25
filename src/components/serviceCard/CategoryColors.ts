export const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  Cleaning: { bg: "bg-sky-100", text: "text-sky-700" },
  Repair: { bg: "bg-orange-100", text: "text-orange-700" },
  Installation: { bg: "bg-violet-100", text: "text-violet-700" },
  Maintenance: { bg: "bg-green-100", text: "text-green-700" },
  Electrical: { bg: "bg-yellow-100", text: "text-yellow-700" },
  Plumbing: { bg: "bg-teal-100", text: "text-teal-700" },
};

// fallback กรณี category ใหม่ที่ยังไม่ได้กำหนดสี
export const DEFAULT_CATEGORY_COLOR = {
  bg: "bg-gray-100",
  text: "text-gray-600",
};

export const getCategoryColor = (categoryName: string) =>
  CATEGORY_COLORS[categoryName] ?? DEFAULT_CATEGORY_COLOR;
