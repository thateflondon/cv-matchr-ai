import type { CVTemplate, TemplateID } from "~/types/cv-builder";

export const TEMPLATES: CVTemplate[] = [
  // ATS Friendly Templates
  {
    id: "template-helsinki",
    name: "Prime ATS",
    category: "ats",
    hasPhoto: false,
    columns: 1,
    description: "ATS-optimized template with clean, professional layout",
    thumbnail: "/templates/helsinki-template.jpg",
    defaultColor: "#000000",
    supportsColorCustomization: false,
    supportsFontCustomization: true,
    supportsLayoutCustomization: true,
  },
  {
    id: "template-seoul",
    name: "Pure ATS",
    category: "ats",
    hasPhoto: false,
    columns: 1,
    description: "Minimalist ATS-friendly design for maximum compatibility",
    thumbnail: "/templates/seoul-template.jpg",
    defaultColor: "#2563eb",
    supportsColorCustomization: true,
    supportsFontCustomization: true,
    supportsLayoutCustomization: true,
  },

  // Two-Column Templates
  {
    id: "template-paris",
    name: "Paris",
    category: "two-column",
    hasPhoto: true,
    columns: 2,
    description: "Two-column layout with teal sidebar",
    thumbnail: "/templates/paris-template.png",
    defaultColor: "#008B8B",
    supportsColorCustomization: true,
    supportsFontCustomization: true,
    supportsLayoutCustomization: true,
  },
  {
    id: "template-two_column_classic",
    name: "Two Column Classic",
    category: "two-column",
    hasPhoto: true,
    columns: 2,
    description: "Classic two-column layout with dark navy sidebar",
    thumbnail: "/templates/two-column-classic-template.png",
    defaultColor: "#1a2744",
    supportsColorCustomization: true,
    supportsFontCustomization: true,
    supportsLayoutCustomization: true,
  },
  {
    id: "template-two_column_design",
    name: "Two Column Design",
    category: "two-column",
    hasPhoto: true,
    columns: 2,
    description: "Modern two-column design with yellow accents",
    thumbnail: "/templates/two-column-design-template.png",
    defaultColor: "#F5A623",
    supportsColorCustomization: true,
    supportsFontCustomization: true,
    supportsLayoutCustomization: true,
  },

  // Specialist Templates
  {
    id: "template-specialist_traditional1",
    name: "Specialist",
    category: "specialist",
    hasPhoto: false,
    columns: 1,
    description: "Specialist professional template",
    thumbnail: "/templates/specialist_traditional1-template.jpg",
    defaultColor: "#000000",
    supportsColorCustomization: false,
    supportsFontCustomization: true,
    supportsLayoutCustomization: true,
  },
  {
    id: "template-academic",
    name: "Academic",
    category: "specialist",
    hasPhoto: false,
    columns: 1,
    description: "Academic CV format for researchers and educators",
    thumbnail: "/templates/academic-template.jpg",
    defaultColor: "#0A5F8C",
    supportsColorCustomization: true,
    supportsFontCustomization: true,
    supportsLayoutCustomization: true,
  },
  {
    id: "template-entry_level",
    name: "Entry Level",
    category: "specialist",
    hasPhoto: false,
    columns: 1,
    description: "Entry-level focused template for new graduates",
    thumbnail: "/templates/entry_level-template.jpg",
    defaultColor: "#2563eb",
    supportsColorCustomization: true,
    supportsFontCustomization: true,
    supportsLayoutCustomization: true,
  },
];

// Helper function to get template by ID
export const getTemplateById = (id: TemplateID): CVTemplate | undefined => {
  return TEMPLATES.find((template) => template.id === id);
};

// Helper function to get templates by category
export const getTemplatesByCategory = (
  category: string
): CVTemplate[] => {
  if (category === "all") {
    return TEMPLATES;
  }
  return TEMPLATES.filter((template) => template.category === category);
};

// Default template
export const DEFAULT_TEMPLATE: CVTemplate = TEMPLATES.find(
  (t) => t.id === "template-helsinki"
) || TEMPLATES[0];
