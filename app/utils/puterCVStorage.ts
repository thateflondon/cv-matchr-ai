import type { CVData, CVCustomization } from "types/cv-builder";
import { usePuterStore } from "~/lib/puter";

const KV_PREFIX = "cv_matchr_resume_";

export interface SavedResume {
  id: string;
  cvData: CVData;
  customization: CVCustomization;
  createdAt: string;
  updatedAt: string;
  jobTitle: string;
}

/**
 * Save a complete resume to Puter KV store
 */
export async function saveResumeToPuter(
  resumeId: string,
  cvData: CVData,
  customization: CVCustomization
): Promise<boolean> {
  try {
    const puter = usePuterStore.getState();
    
    if (!puter.puterReady) {
      throw new Error("Puter is not ready");
    }

    const savedResume: SavedResume = {
      id: resumeId,
      cvData,
      customization,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      jobTitle: cvData.personalDetails?.jobTitle || "Untitled Resume",
    };

    const key = `${KV_PREFIX}${resumeId}`;
    const result = await puter.kv.set(key, JSON.stringify(savedResume));
    
    return result === true;
  } catch (error) {
    console.error("Failed to save resume to Puter KV:", error);
    throw error;
  }
}

/**
 * Load a resume from Puter KV store
 */
export async function loadResumeFromPuter(
  resumeId: string
): Promise<SavedResume | null> {
  try {
    const puter = usePuterStore.getState();
    
    if (!puter.puterReady) {
      throw new Error("Puter is not ready");
    }

    const key = `${KV_PREFIX}${resumeId}`;
    const data = await puter.kv.get(key);
    
    if (data) {
      return JSON.parse(data) as SavedResume;
    }
    
    return null;
  } catch (error) {
    console.error("Failed to load resume from Puter KV:", error);
    throw error;
  }
}

/**
 * Update an existing resume in Puter KV store
 */
export async function updateResumeInPuter(
  resumeId: string,
  cvData: CVData,
  customization: CVCustomization
): Promise<boolean> {
  try {
    const puter = usePuterStore.getState();
    
    if (!puter.puterReady) {
      throw new Error("Puter is not ready");
    }

    // Load existing resume to preserve createdAt
    const existing = await loadResumeFromPuter(resumeId);
    
    const savedResume: SavedResume = {
      id: resumeId,
      cvData,
      customization,
      createdAt: existing?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      jobTitle: cvData.personalDetails?.jobTitle || "Untitled Resume",
    };

    const key = `${KV_PREFIX}${resumeId}`;
    const result = await puter.kv.set(key, JSON.stringify(savedResume));
    
    return result === true;
  } catch (error) {
    console.error("Failed to update resume in Puter KV:", error);
    throw error;
  }
}

/**
 * Delete a resume from Puter KV store
 */
export async function deleteResumeFromPuter(
  resumeId: string
): Promise<boolean> {
  try {
    const puter = usePuterStore.getState();
    
    if (!puter.puterReady) {
      throw new Error("Puter is not ready");
    }

    const key = `${KV_PREFIX}${resumeId}`;
    const result = await puter.kv.delete(key);
    
    return result === true;
  } catch (error) {
    console.error("Failed to delete resume from Puter KV:", error);
    throw error;
  }
}

/**
 * List all saved resumes from Puter KV store
 */
export async function listResumesFromPuter(): Promise<SavedResume[]> {
  try {
    const puter = usePuterStore.getState();
    
    if (!puter.puterReady) {
      throw new Error("Puter is not ready");
    }

    const keys = await puter.kv.list(`${KV_PREFIX}*`, true);
    
    if (!keys || !Array.isArray(keys)) {
      return [];
    }

    // Keys with returnValues=true should return KVItem[] with key and value
    const resumes: SavedResume[] = [];
    
    for (const item of keys) {
      try {
        if (typeof item === 'object' && 'value' in item) {
          const resume = JSON.parse(item.value as string) as SavedResume;
          resumes.push(resume);
        }
      } catch (error) {
        console.error("Failed to parse resume:", error);
      }
    }
    
    // Sort by updatedAt descending
    resumes.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
    
    return resumes;
  } catch (error) {
    console.error("Failed to list resumes from Puter KV:", error);
    throw error;
  }
}

/**
 * Generate a unique resume ID
 */
export function generateResumeId(): string {
  return `resume_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}