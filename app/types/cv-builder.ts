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
  isCurrentlyStudying?: boolean;
  gpa?: string;
  achievements?: string[];
}

export interface CVAdditionalSection {
  id: string;
  title: string;
  content: string | string[];
}

export interface CVSkillGroup {
  title?: string;
  skills: string[];
}

export interface SocialLink {
  id: string;
  label: string;
  url: string;
}

export interface Language {
  id: string;
  language: string;
  level: string;
}

export interface Skill {
  id: string;
  name: string;
  level?: string;
}

export interface CVData {
  personalDetails: CVPersonalDetails | null;
  professionalSummary: string;
  professionalExperience: CVProfessionalExperience[];
  education: CVEducation[];
  skills: string[];
  skillGroups?: CVSkillGroup[];
  accomplishments?: string[];
  selectedAchievements?: string[]; // Academic template specific
  powerStatement?: string;
  additionalSections?: CVAdditionalSection[];
  socialLinks?: SocialLink[];
  languages?: Language[];
  skillsData?: Skill[];
}

export type TemplateCategory =
  | "all"
  | "ats"
  | "two-column"
  | "specialist";

export type TemplateID =
  | "template-helsinki"
  | "template-seoul"
  | "template-paris"
  | "template-two_column_classic"
  | "template-two_column_design"
  | "template-specialist_traditional1"
  | "template-academic"
  | "template-entry_level";

export interface CVTemplate {
  id: TemplateID;
  name: string;
  category: TemplateCategory;
  hasPhoto: boolean;
  columns: 1 | 2;
  thumbnail?: string;
  description?: string;
  defaultColor?: string; // Default primary color for this template
  // Customization capabilities - if false or undefined, the control will be disabled
  supportsColorCustomization?: boolean; // If false, color customization will be disabled
  supportsFontCustomization?: boolean; // If false, font customization will be disabled
  supportsLayoutCustomization?: boolean; // If false, layout customization will be disabled
}

export interface CVMargins {
  headerFooter: number; // in inches
  topBottom: number; // in inches
  leftRight: number; // in inches
  betweenSections: number; // in pt
  betweenTitleContent: number; // in pt
  betweenContentBlocks: number; // in pt
}

export interface CVCustomization {
  template: CVTemplate;
  primaryColor: string;
  fonts: {
    primary: string;
    secondary: string;
  };
  spacing: {
    lineHeight: number;
  };
  margins: CVMargins;
  fontSize: {
    primaryHeading: number;
    secondaryHeading: number;
    body: number;
    sectionTitles: number;
  };
  fontWeight: {
    primaryHeading: string;
    secondaryHeading: string;
    body: string;
    sectionTitles: string;
  };
  dateFormat: "short" | "long" | "numeric" | "year";
  dateAlignment: "left" | "right";
  headerAlignment: "left" | "center" | "right";
  skillsLayout: "comma" | "columns" | "categories";
  skillsColumns: number;
  educationLayout: "stacked" | "inline";
  educationOrder: "institution" | "degree";
}

export const defaultTemplate: CVTemplate = {
  id: "template-helsinki",
  name: "Prime ATS",
  category: "ats",
  hasPhoto: false,
  columns: 1,
};

export const defaultMargins: CVMargins = {
  headerFooter: 0.5,
  topBottom: 0.75,
  leftRight: 0.75,
  betweenSections: 24,
  betweenTitleContent: 8,
  betweenContentBlocks: 12,
};

export const defaultCustomization: CVCustomization = {
  template: defaultTemplate,
  primaryColor: "#2563eb",
  fonts: {
    primary: "'Inter', sans-serif",
    secondary: "'Inter', sans-serif",
  },
  spacing: {
    lineHeight: 140,
  },
  margins: defaultMargins,
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
  skillsLayout: "columns",
  skillsColumns: 4,
  educationLayout: "stacked",
  educationOrder: "institution",
};

export const defaultCVData: CVData = {
  personalDetails: null,
  professionalSummary: "",
  professionalExperience: [],
  education: [],
  skills: [],
  skillGroups: [],
  accomplishments: [],
};