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
  powerStatement?: string;
  additionalSections?: CVAdditionalSection[];
  socialLinks?: SocialLink[];
  languages?: Language[];
  skillsData?: Skill[];
}

export type TemplateCategory = 
  | "all" 
  | "ats" 
  | "classic" 
  | "modern" 
  | "creative" 
  | "two-column" 
  | "professional"
  | "specialist";

export type TemplateID = 
  | "template-london"
  | "template-santiago"
  | "template-dublin"
  | "template-helsinki"
  | "template-seoul"
  | "template-specialist_traditional1"
  | "template-berlin"
  | "template-athens"
  | "template-new_york"
  | "template-vienna"
  | "template-prague"
  | "template-brussels"
  | "template-sydney"
  | "template-shanghai"
  | "template-stockholm"
  | "template-paris"
  | "template-madrid"
  | "template-rome"
  | "template-milan"
  | "template-toronto"
  | "template-singapore"
  | "template-amsterdam"
  | "template-barcelona"
  | "template-oslo"
  | "template-chicago"
  | "template-copenhagen"
  | "template-boston"
  | "template-geneva"
  | "template-tokyo"
  | "template-lisbon"
  | "template-moscow"
  | "template-rio"
  | "template-vancouver"
  | "template-cape_town"
  | "template-rirekisho"
  | "template-shokumukeirekisho"
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
  supportsColorCustomization?: boolean; // If false, color customization will be disabled
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
  dateFormat: "short" | "long";
  dateAlignment: "left" | "right";
  headerAlignment: "left" | "center" | "right";
}

export const defaultTemplate: CVTemplate = {
  id: "template-helsinki",
  name: "Prime ATS",
  category: "ats",
  hasPhoto: false,
  columns: 1,
};

export const defaultCustomization: CVCustomization = {
  template: defaultTemplate,
  primaryColor: "#2563eb",
  fonts: {
    primary: "Arial, sans-serif",
    secondary: "Arial, sans-serif",
  },
  spacing: {
    lineHeight: 140,
  },
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
  skillGroups: [],
  accomplishments: [],
  powerStatement: "",
  additionalSections: [],
};