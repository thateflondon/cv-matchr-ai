/**
 * Unified Storage Service
 *
 * This module provides a consistent interface for all storage operations in the app.
 * It handles both local (localStorage) and cloud (Puter KV) storage with clear separation.
 *
 * Storage Architecture:
 * --------------------
 *
 * 1. **Puter KV Store** (Cloud - requires authentication):
 *    - `resume:{uuid}` - Uploaded/analyzed resumes with AI feedback
 *    - `cv_matchr_resume_{id}` - CV Builder resumes (created from scratch)
 *
 * 2. **localStorage** (Local - works offline):
 *    - `cv_builder_{resumeId}_data` - Draft CV data while editing
 *    - `cv_builder_{resumeId}_customization` - Draft customization settings
 *
 * Flow:
 * -----
 * 1. User edits CV → Auto-saved to localStorage (debounced)
 * 2. User clicks "Save" → Saved to Puter KV (cloud)
 * 3. User loads page → Load from Puter KV, then check localStorage for newer draft
 */

import {
  saveCVData,
  loadCVData,
  saveCVCustomization,
  loadCVCustomization,
  clearCVData,
} from "~/utils/cvStorage";

import {
  saveResumeToPuter,
  loadResumeFromPuter,
  updateResumeInPuter,
  deleteResumeFromPuter,
  listResumesFromPuter,
  generateResumeId,
  type SavedResume,
} from "~/utils/puterCVStorage";

import type { CVData, CVCustomization } from "~/types/cv-builder";

// Re-export for convenience
export {
  // localStorage operations (draft/temp)
  saveCVData as saveDraft,
  loadCVData as loadDraft,
  saveCVCustomization as saveCustomizationDraft,
  loadCVCustomization as loadCustomizationDraft,
  clearCVData as clearDraft,

  // Puter KV operations (cloud/permanent)
  saveResumeToPuter as saveToCloud,
  loadResumeFromPuter as loadFromCloud,
  updateResumeInPuter as updateInCloud,
  deleteResumeFromPuter as deleteFromCloud,
  listResumesFromPuter as listFromCloud,
  generateResumeId,

  // Types
  type SavedResume,
};

/**
 * Storage key prefixes used in the application
 */
export const STORAGE_KEYS = {
  /** Puter KV prefix for uploaded/analyzed resumes */
  ANALYZED_RESUME: "resume:",
  /** Puter KV prefix for CV builder resumes */
  BUILDER_RESUME: "cv_matchr_resume_",
  /** localStorage prefix for draft data */
  LOCAL_DRAFT: "cv_builder_",
} as const;

/**
 * Check if there's a newer local draft than the cloud version
 */
export function hasNewerDraft(
  resumeId: string,
  cloudUpdatedAt: string
): boolean {
  try {
    const localData = loadCVData(resumeId);
    if (!localData) return false;

    // localStorage doesn't have timestamps, so we can't compare directly
    // For now, we assume if local data exists and has content, it might be newer
    const hasLocalContent =
      localData.personalDetails?.firstName ||
      localData.professionalExperience?.length > 0 ||
      localData.education?.length > 0;

    return hasLocalContent;
  } catch {
    return false;
  }
}

/**
 * Sync local draft to cloud storage
 */
export async function syncDraftToCloud(
  resumeId: string,
  customization: CVCustomization
): Promise<boolean> {
  const localData = loadCVData(resumeId);
  const localCustomization = loadCVCustomization(resumeId) || customization;

  if (!localData) {
    return false;
  }

  try {
    const result = await updateResumeInPuter(
      resumeId,
      localData,
      localCustomization
    );

    if (result) {
      // Clear local draft after successful sync
      clearCVData(resumeId);
    }

    return result;
  } catch {
    return false;
  }
}

/**
 * Load resume with local draft priority
 * Returns cloud data merged with any local draft changes
 */
export async function loadResumeWithDraft(
  resumeId: string
): Promise<{ cvData: CVData; customization: CVCustomization } | null> {
  try {
    // Load from cloud
    const cloudData = await loadResumeFromPuter(resumeId);

    if (!cloudData) {
      // No cloud data, try local
      const localData = loadCVData(resumeId);
      const localCustomization = loadCVCustomization(resumeId);

      if (localData && localCustomization) {
        return { cvData: localData, customization: localCustomization };
      }

      return null;
    }

    // Check for local draft
    const localData = loadCVData(resumeId);
    const localCustomization = loadCVCustomization(resumeId);

    // Prefer local data if it has meaningful content (user was editing)
    const hasLocalContent =
      localData?.personalDetails?.firstName ||
      (localData?.professionalExperience?.length ?? 0) > 0 ||
      (localData?.education?.length ?? 0) > 0;

    return {
      cvData: hasLocalContent ? localData! : cloudData.cvData,
      customization: localCustomization || cloudData.customization,
    };
  } catch {
    // Fall back to local only
    const localData = loadCVData(resumeId);
    const localCustomization = loadCVCustomization(resumeId);

    if (localData && localCustomization) {
      return { cvData: localData, customization: localCustomization };
    }

    return null;
  }
}
