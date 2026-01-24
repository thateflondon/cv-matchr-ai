import { create } from "zustand";
import { persist } from "zustand/middleware";

// Types pour les différentes sections du CV
export interface PersonalInfo {
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  website?: string;
  photo?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description?: string;
  gpa?: string;
}

export interface Skill {
  id: string;
  name: string;
  level: "beginner" | "intermediate" | "advanced" | "expert";
  category: "technical" | "soft" | "language" | "other";
}

export interface Language {
  id: string;
  name: string;
  level: "basic" | "conversational" | "professional" | "native";
}

export interface Interest {
  id: string;
  name: string;
  description?: string;
}

export interface CVSettings {
  template: "modern" | "classic" | "minimal" | "professional" | "creative";
  language: "fr" | "en";
  fontSize: "small" | "medium" | "large";
  fontFamily: "inter" | "roboto" | "open-sans" | "lato" | "poppins";
  dateFormat: "fr" | "en";
  colorScheme: "blue" | "purple" | "green" | "gray" | "red";
}

export interface CVData {
  id: string;
  personalInfo: PersonalInfo;
  about: string;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  languages: Language[];
  interests: Interest[];
  other: string[];
  settings: CVSettings;
  createdAt: string;
  updatedAt: string;
}

interface CVStore {
  currentCV: CVData | null;
  savedCVs: CVData[];
  activeTab: "parcours" | "design" | "ats" | "download" | "settings";
  
  // Actions
  setActiveTab: (tab: CVStore["activeTab"]) => void;
  
  // CV Management
  createNewCV: () => void;
  loadCV: (id: string) => void;
  saveCV: () => void;
  deleteCV: (id: string) => void;
  
  // Personal Info
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  
  // About
  updateAbout: (about: string) => void;
  
  // Experience
  addExperience: (experience: Omit<Experience, "id">) => void;
  updateExperience: (id: string, experience: Partial<Experience>) => void;
  deleteExperience: (id: string) => void;
  reorderExperiences: (experiences: Experience[]) => void;
  
  // Education
  addEducation: (education: Omit<Education, "id">) => void;
  updateEducation: (id: string, education: Partial<Education>) => void;
  deleteEducation: (id: string) => void;
  reorderEducation: (education: Education[]) => void;
  
  // Skills
  addSkill: (skill: Omit<Skill, "id">) => void;
  updateSkill: (id: string, skill: Partial<Skill>) => void;
  deleteSkill: (id: string) => void;
  
  // Languages
  addLanguage: (language: Omit<Language, "id">) => void;
  updateLanguage: (id: string, language: Partial<Language>) => void;
  deleteLanguage: (id: string) => void;
  
  // Interests
  addInterest: (interest: Omit<Interest, "id">) => void;
  updateInterest: (id: string, interest: Partial<Interest>) => void;
  deleteInterest: (id: string) => void;
  
  // Settings
  updateSettings: (settings: Partial<CVSettings>) => void;
  
  // Import from AI suggestions
  applyAISuggestions: (suggestions: any) => void;
}

const createDefaultCV = (): CVData => ({
  id: `cv-${Date.now()}`,
  personalInfo: {
    firstName: "",
    lastName: "",
    title: "",
    email: "",
    phone: "",
    location: "",
  },
  about: "",
  experiences: [],
  education: [],
  skills: [],
  languages: [],
  interests: [],
  other: [],
  settings: {
    template: "modern",
    language: "en",
    fontSize: "medium",
    fontFamily: "inter",
    dateFormat: "en",
    colorScheme: "blue",
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const useCVStore = create<CVStore>()(
  persist(
    (set, get) => ({
      currentCV: null,
      savedCVs: [],
      activeTab: "parcours",

      setActiveTab: (tab) => set({ activeTab: tab }),

      createNewCV: () => {
        const newCV = createDefaultCV();
        set({ currentCV: newCV });
      },

      loadCV: (id) => {
        const cv = get().savedCVs.find((cv) => cv.id === id);
        if (cv) {
          set({ currentCV: cv });
        }
      },

      saveCV: () => {
        const { currentCV, savedCVs } = get();
        if (!currentCV) return;

        const updatedCV = {
          ...currentCV,
          updatedAt: new Date().toISOString(),
        };

        const existingIndex = savedCVs.findIndex((cv) => cv.id === currentCV.id);
        
        if (existingIndex >= 0) {
          const newSavedCVs = [...savedCVs];
          newSavedCVs[existingIndex] = updatedCV;
          set({ savedCVs: newSavedCVs, currentCV: updatedCV });
        } else {
          set({ savedCVs: [...savedCVs, updatedCV], currentCV: updatedCV });
        }
      },

      deleteCV: (id) => {
        set((state) => ({
          savedCVs: state.savedCVs.filter((cv) => cv.id !== id),
          currentCV: state.currentCV?.id === id ? null : state.currentCV,
        }));
      },

      updatePersonalInfo: (info) => {
        set((state) => ({
          currentCV: state.currentCV
            ? {
                ...state.currentCV,
                personalInfo: { ...state.currentCV.personalInfo, ...info },
              }
            : null,
        }));
      },

      updateAbout: (about) => {
        set((state) => ({
          currentCV: state.currentCV ? { ...state.currentCV, about } : null,
        }));
      },

      addExperience: (experience) => {
        set((state) => ({
          currentCV: state.currentCV
            ? {
                ...state.currentCV,
                experiences: [
                  ...state.currentCV.experiences,
                  { ...experience, id: generateId() },
                ],
              }
            : null,
        }));
      },

      updateExperience: (id, experience) => {
        set((state) => ({
          currentCV: state.currentCV
            ? {
                ...state.currentCV,
                experiences: state.currentCV.experiences.map((exp) =>
                  exp.id === id ? { ...exp, ...experience } : exp
                ),
              }
            : null,
        }));
      },

      deleteExperience: (id) => {
        set((state) => ({
          currentCV: state.currentCV
            ? {
                ...state.currentCV,
                experiences: state.currentCV.experiences.filter((exp) => exp.id !== id),
              }
            : null,
        }));
      },

      reorderExperiences: (experiences) => {
        set((state) => ({
          currentCV: state.currentCV ? { ...state.currentCV, experiences } : null,
        }));
      },

      addEducation: (education) => {
        set((state) => ({
          currentCV: state.currentCV
            ? {
                ...state.currentCV,
                education: [
                  ...state.currentCV.education,
                  { ...education, id: generateId() },
                ],
              }
            : null,
        }));
      },

      updateEducation: (id, education) => {
        set((state) => ({
          currentCV: state.currentCV
            ? {
                ...state.currentCV,
                education: state.currentCV.education.map((edu) =>
                  edu.id === id ? { ...edu, ...education } : edu
                ),
              }
            : null,
        }));
      },

      deleteEducation: (id) => {
        set((state) => ({
          currentCV: state.currentCV
            ? {
                ...state.currentCV,
                education: state.currentCV.education.filter((edu) => edu.id !== id),
              }
            : null,
        }));
      },

      reorderEducation: (education) => {
        set((state) => ({
          currentCV: state.currentCV ? { ...state.currentCV, education } : null,
        }));
      },

      addSkill: (skill) => {
        set((state) => ({
          currentCV: state.currentCV
            ? {
                ...state.currentCV,
                skills: [...state.currentCV.skills, { ...skill, id: generateId() }],
              }
            : null,
        }));
      },

      updateSkill: (id, skill) => {
        set((state) => ({
          currentCV: state.currentCV
            ? {
                ...state.currentCV,
                skills: state.currentCV.skills.map((s) =>
                  s.id === id ? { ...s, ...skill } : s
                ),
              }
            : null,
        }));
      },

      deleteSkill: (id) => {
        set((state) => ({
          currentCV: state.currentCV
            ? {
                ...state.currentCV,
                skills: state.currentCV.skills.filter((s) => s.id !== id),
              }
            : null,
        }));
      },

      addLanguage: (language) => {
        set((state) => ({
          currentCV: state.currentCV
            ? {
                ...state.currentCV,
                languages: [
                  ...state.currentCV.languages,
                  { ...language, id: generateId() },
                ],
              }
            : null,
        }));
      },

      updateLanguage: (id, language) => {
        set((state) => ({
          currentCV: state.currentCV
            ? {
                ...state.currentCV,
                languages: state.currentCV.languages.map((lang) =>
                  lang.id === id ? { ...lang, ...language } : lang
                ),
              }
            : null,
        }));
      },

      deleteLanguage: (id) => {
        set((state) => ({
          currentCV: state.currentCV
            ? {
                ...state.currentCV,
                languages: state.currentCV.languages.filter((lang) => lang.id !== id),
              }
            : null,
        }));
      },

      addInterest: (interest) => {
        set((state) => ({
          currentCV: state.currentCV
            ? {
                ...state.currentCV,
                interests: [
                  ...state.currentCV.interests,
                  { ...interest, id: generateId() },
                ],
              }
            : null,
        }));
      },

      updateInterest: (id, interest) => {
        set((state) => ({
          currentCV: state.currentCV
            ? {
                ...state.currentCV,
                interests: state.currentCV.interests.map((int) =>
                  int.id === id ? { ...int, ...interest } : int
                ),
              }
            : null,
        }));
      },

      deleteInterest: (id) => {
        set((state) => ({
          currentCV: state.currentCV
            ? {
                ...state.currentCV,
                interests: state.currentCV.interests.filter((int) => int.id !== id),
              }
            : null,
        }));
      },

      updateSettings: (settings) => {
        set((state) => ({
          currentCV: state.currentCV
            ? {
                ...state.currentCV,
                settings: { ...state.currentCV.settings, ...settings },
              }
            : null,
        }));
      },

      applyAISuggestions: (suggestions) => {
        // TODO: Implement AI suggestions application
        console.log("Applying AI suggestions:", suggestions);
      },
    }),
    {
      name: "cv-storage",
    }
  )
);