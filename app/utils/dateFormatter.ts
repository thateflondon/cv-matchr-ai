import type { CVCustomization } from "~/types/cv-builder";

/**
 * Format a date string based on the selected format
 */
export function formatDate(dateStr: string | undefined, format: CVCustomization["dateFormat"]): string {
  if (!dateStr) return "";

  // Try to parse the date - it could be in various formats
  const parts = dateStr.match(/(\d{1,2})[\/\-\.]?(\d{4})|(\d{4})[\/\-\.]?(\d{1,2})|(\w+)\s*(\d{4})|(\d{4})/);

  if (!parts) return dateStr; // Return original if can't parse

  let month: number | undefined;
  let year: number | undefined;

  if (parts[1] && parts[2]) {
    // Format: MM/YYYY or MM-YYYY
    month = parseInt(parts[1]);
    year = parseInt(parts[2]);
  } else if (parts[3] && parts[4]) {
    // Format: YYYY/MM or YYYY-MM
    year = parseInt(parts[3]);
    month = parseInt(parts[4]);
  } else if (parts[5] && parts[6]) {
    // Format: Month YYYY
    const monthNames = ["january", "february", "march", "april", "may", "june",
                        "july", "august", "september", "october", "november", "december"];
    month = monthNames.indexOf(parts[5].toLowerCase()) + 1;
    year = parseInt(parts[6]);
  } else if (parts[7]) {
    // Format: YYYY only
    year = parseInt(parts[7]);
  }

  if (!year) return dateStr;

  const monthNames = ["January", "February", "March", "April", "May", "June",
                      "July", "August", "September", "October", "November", "December"];

  switch (format) {
    case "short":
      return month ? `${String(month).padStart(2, "0")}/${year}` : String(year);
    case "long":
      return month ? `${monthNames[month - 1]} ${year}` : String(year);
    case "numeric":
      return month ? `${String(month).padStart(2, "0")}.${year}` : String(year);
    case "year":
      return String(year);
    default:
      return dateStr;
  }
}

/**
 * Format a date range (start - end)
 */
export function formatDateRange(
  startDate: string | undefined,
  endDate: string | undefined,
  format: CVCustomization["dateFormat"],
  presentText: string = "Present"
): string {
  const formattedStart = formatDate(startDate, format);
  const formattedEnd = endDate ? formatDate(endDate, format) : presentText;

  if (!formattedStart && !formattedEnd) return "";
  if (!formattedStart) return formattedEnd;
  if (!formattedEnd) return formattedStart;

  return `${formattedStart} - ${formattedEnd}`;
}
