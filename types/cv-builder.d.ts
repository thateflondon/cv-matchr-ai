export interface CVPersonalDetails {
  firstName: string;
  lastName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  website?: string;
  photo?: string;
}

export interface CVProfessionalExperience {
  jobTitle: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  description?: string;
  achievements?: string[];
}

export interface CVEducation {
  degree: string;
  institution: string;
  location?: string;
  graduationDate: string;
  gpa?: string;
  achievements?: string[];
}

export interface CVAdditionalSection {
  id: string;
  title: string;
  content: string | string[];
}

export interface CVData {
  personalDetails: CVPersonalDetails | null;
  professionalSummary: string;
  professionalExperience: CVProfessionalExperience[];
  education: CVEducation[];
  skills: string[];
  accomplishments?: string[];
  powerStatement?: string;
  additionalSections?: CVAdditionalSection[];
}

export interface CVTemplate {
  id: string;
  name: string;
  category: "all" | "ats" | "photo" | "two-column" | "modern" | "classic";
  hasPhoto: boolean;
  columns: 1 | 2;
  thumbnail?: string;
}

export interface CVCustomization {
  template: CVTemplate;
  primaryColor: string;
  primaryFont: string;
  secondaryFont: string;
  lineHeight: number;
  fontSize: {
    primaryHeading: number;
    secondaryHeading: number;
    body: number;
    sectionTitles: number;
  };
  fontWeight: {
    primaryHeading: "400" | "500" | "600" | "700";
    secondaryHeading: "400" | "500" | "600" | "700";
    body: "400" | "500" | "600" | "700";
    sectionTitles: "400" | "500" | "600" | "700";
  };
  dateFormat: "short" | "long" | "numeric" | "year";
  dateAlignment: "left" | "right";
  headerAlignment: "left" | "center" | "right";
}

export const defaultTemplate: CVTemplate = {
  id: "ats-classic",
  name: "ATS Classic",
  category: "ats",
  hasPhoto: false,
  columns: 1,
};

export const defaultCustomization: CVCustomization = {
  template: defaultTemplate,
  primaryColor: "#2563eb",
  primaryFont: "Arial, sans-serif",
  secondaryFont: "Arial, sans-serif",
  lineHeight: 140,
  fontSize: {
    primaryHeading: 24,
    secondaryHeading: 16,
    body: 11,
    sectionTitles: 14,
  },
  fontWeight: {
    primaryHeading: "700",
    secondaryHeading: "600",
    body: "400",
    sectionTitles: "600",
  },
  dateFormat: "short",
  dateAlignment: "right",
  headerAlignment: "left",
};

export const defaultCVData: CVData = {
  personalDetails: null,
  professionalSummary: "",
  professionalExperience: [],
  education: [],
  skills: [],
  accomplishments: [],
  powerStatement: "",
  additionalSections: [],
};
