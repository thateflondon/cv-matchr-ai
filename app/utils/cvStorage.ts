import type { CVData, CVCustomization } from "~/types/cv-builder";
import { defaultCustomization, defaultMargins } from "~/types/cv-builder";

const STORAGE_KEY_PREFIX = "cv_builder_";
const DATA_KEY = "data";
const CUSTOMIZATION_KEY = "customization";

/**
 * Save CV data to localStorage
 */
export function saveCVData(resumeId: string | null, data: CVData): void {
  try {
    const key = resumeId
      ? `${STORAGE_KEY_PREFIX}${resumeId}_${DATA_KEY}`
      : `${STORAGE_KEY_PREFIX}new_${DATA_KEY}`;
    
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save CV data to localStorage:", error);
  }
}

/**
 * Load CV data from localStorage
 */
export function loadCVData(resumeId: string | null): CVData | null {
  try {
    const key = resumeId
      ? `${STORAGE_KEY_PREFIX}${resumeId}_${DATA_KEY}`
      : `${STORAGE_KEY_PREFIX}new_${DATA_KEY}`;
    
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored) as CVData;
    }
  } catch (error) {
    console.error("Failed to load CV data from localStorage:", error);
  }
  return null;
}

/**
 * Save CV customization to localStorage
 */
export function saveCVCustomization(
  resumeId: string | null,
  customization: CVCustomization
): void {
  try {
    const key = resumeId
      ? `${STORAGE_KEY_PREFIX}${resumeId}_${CUSTOMIZATION_KEY}`
      : `${STORAGE_KEY_PREFIX}new_${CUSTOMIZATION_KEY}`;
    
    localStorage.setItem(key, JSON.stringify(customization));
  } catch (error) {
    console.error("Failed to save CV customization to localStorage:", error);
  }
}

// System fonts that don't support all font weights (400, 500, 600, 700)
const SYSTEM_FONTS_LIMITED_WEIGHTS = [
  "Arial, sans-serif",
  "Helvetica, sans-serif",
  "Georgia, serif",
  "Times New Roman, serif",
  "Verdana, sans-serif",
  "Courier New, monospace",
];

/**
 * Migrate system fonts to Google Fonts for better weight support
 */
function migrateFontsForWeightSupport(fonts: { primary: string; secondary: string }): { primary: string; secondary: string } {
  const migratedFonts = { ...fonts };

  // Check if primary font is a system font with limited weight support
  if (SYSTEM_FONTS_LIMITED_WEIGHTS.some(f => fonts.primary.includes(f.split(',')[0]))) {
    migratedFonts.primary = "'Inter', sans-serif";
  }

  // Check if secondary font is a system font with limited weight support
  if (SYSTEM_FONTS_LIMITED_WEIGHTS.some(f => fonts.secondary.includes(f.split(',')[0]))) {
    migratedFonts.secondary = "'Inter', sans-serif";
  }

  return migratedFonts;
}

/**
 * Load CV customization from localStorage
 * Merges with defaults to ensure backward compatibility when new properties are added
 */
export function loadCVCustomization(
  resumeId: string | null
): CVCustomization | null {
  try {
    const key = resumeId
      ? `${STORAGE_KEY_PREFIX}${resumeId}_${CUSTOMIZATION_KEY}`
      : `${STORAGE_KEY_PREFIX}new_${CUSTOMIZATION_KEY}`;

    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed = JSON.parse(stored);

      // Merge fonts with defaults and migrate if needed
      const mergedFonts = { ...defaultCustomization.fonts, ...parsed.fonts };
      const migratedFonts = migrateFontsForWeightSupport(mergedFonts);

      // Merge with defaults to ensure all properties exist
      return {
        ...defaultCustomization,
        ...parsed,
        // Ensure nested objects are properly merged
        fonts: migratedFonts,
        spacing: { ...defaultCustomization.spacing, ...parsed.spacing },
        margins: { ...defaultMargins, ...parsed.margins },
        fontSize: { ...defaultCustomization.fontSize, ...parsed.fontSize },
        fontWeight: { ...defaultCustomization.fontWeight, ...parsed.fontWeight },
        template: parsed.template || defaultCustomization.template,
      };
    }
  } catch (error) {
    console.error("Failed to load CV customization from localStorage:", error);
  }
  return null;
}

/**
 * Clear CV data from localStorage (after saving to database)
 */
export function clearCVData(resumeId: string | null): void {
  try {
    const dataKey = resumeId
      ? `${STORAGE_KEY_PREFIX}${resumeId}_${DATA_KEY}`
      : `${STORAGE_KEY_PREFIX}new_${DATA_KEY}`;
    const customizationKey = resumeId
      ? `${STORAGE_KEY_PREFIX}${resumeId}_${CUSTOMIZATION_KEY}`
      : `${STORAGE_KEY_PREFIX}new_${CUSTOMIZATION_KEY}`;
    
    localStorage.removeItem(dataKey);
    localStorage.removeItem(customizationKey);
  } catch (error) {
    console.error("Failed to clear CV data from localStorage:", error);
  }
}

/**
 * Get all CV builder storage keys
 */
export function getAllCVStorageKeys(): string[] {
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(STORAGE_KEY_PREFIX)) {
      keys.push(key);
    }
  }
  return keys;
}

/**
 * Clear all CV builder data (for cleanup)
 */
export function clearAllCVData(): void {
  const keys = getAllCVStorageKeys();
  keys.forEach((key) => {
    localStorage.removeItem(key);
  });
}