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
  },
  {
    id: "template-seoul",
    name: "Pure ATS",
    category: "ats",
    hasPhoto: false,
    columns: 1,
    description: "Minimalist ATS-friendly design for maximum compatibility",
    thumbnail: "/templates/seoul-template.jpg",
  },
  {
    id: "template-athens",
    name: "Simple ATS",
    category: "ats",
    hasPhoto: false,
    columns: 1,
    description: "Simple and straightforward ATS-compatible format",
  },
  {
    id: "template-prague",
    name: "Precision ATS",
    category: "ats",
    hasPhoto: false,
    columns: 1,
    description: "Precise formatting for ATS systems",
  },
  {
    id: "template-brussels",
    name: "Two column ATS",
    category: "ats",
    hasPhoto: false,
    columns: 2,
    description: "Two-column layout optimized for ATS",
  },
  {
    id: "template-shanghai",
    name: "Header ATS",
    category: "ats",
    hasPhoto: false,
    columns: 1,
    description: "ATS-friendly with prominent header section",
  },

  // Classic/Traditional Templates
  {
    id: "template-london",
    name: "Classic",
    category: "classic",
    hasPhoto: false,
    columns: 1,
    description: "Timeless classic design",
  },
  {
    id: "template-santiago",
    name: "Traditional",
    category: "classic",
    hasPhoto: false,
    columns: 1,
    description: "Traditional professional layout",
  },
  {
    id: "template-dublin",
    name: "Professional",
    category: "classic",
    hasPhoto: false,
    columns: 1,
    description: "Professional and polished appearance",
  },
  {
    id: "template-berlin",
    name: "Clean",
    category: "classic",
    hasPhoto: false,
    columns: 1,
    description: "Clean and organized layout",
  },
  {
    id: "template-vienna",
    name: "Clear",
    category: "classic",
    hasPhoto: false,
    columns: 1,
    description: "Clear and easy to read",
  },
  {
    id: "template-stockholm",
    name: "Essential",
    category: "classic",
    hasPhoto: false,
    columns: 1,
    description: "Essential elements, nothing more",
  },

  // Modern Templates
  {
    id: "template-tokyo",
    name: "Modern",
    category: "modern",
    hasPhoto: true,
    columns: 1,
    description: "Contemporary modern design",
  },
  {
    id: "template-sydney",
    name: "Balanced",
    category: "modern",
    hasPhoto: false,
    columns: 1,
    description: "Balanced modern layout",
  },
  {
    id: "template-paris",
    name: "Polished",
    category: "modern",
    hasPhoto: false,
    columns: 1,
    description: "Polished modern aesthetic",
  },
  {
    id: "template-madrid",
    name: "Vivid",
    category: "modern",
    hasPhoto: false,
    columns: 1,
    description: "Vivid and vibrant design",
  },
  {
    id: "template-singapore",
    name: "Minimalist",
    category: "modern",
    hasPhoto: false,
    columns: 1,
    description: "Minimalist modern approach",
  },

  // Creative Templates
  {
    id: "template-lisbon",
    name: "Creative",
    category: "creative",
    hasPhoto: true,
    columns: 2,
    description: "Creative and unique layout",
  },
  {
    id: "template-rome",
    name: "Calligraphic",
    category: "creative",
    hasPhoto: false,
    columns: 1,
    description: "Elegant calligraphic style",
  },
  {
    id: "template-milan",
    name: "Harmonized",
    category: "creative",
    hasPhoto: false,
    columns: 1,
    description: "Harmonious color-coordinated design",
  },
  {
    id: "template-oslo",
    name: "Bold",
    category: "creative",
    hasPhoto: false,
    columns: 1,
    description: "Bold and impactful design",
  },
  {
    id: "template-moscow",
    name: "Pastel",
    category: "creative",
    hasPhoto: true,
    columns: 2,
    description: "Soft pastel color scheme",
  },
  {
    id: "template-rio",
    name: "Visionary",
    category: "creative",
    hasPhoto: true,
    columns: 2,
    description: "Visionary creative layout",
  },
  {
    id: "template-vancouver",
    name: "Confetti",
    category: "creative",
    hasPhoto: true,
    columns: 2,
    description: "Playful confetti-inspired design",
  },
  {
    id: "template-cape_town",
    name: "Color Splash",
    category: "creative",
    hasPhoto: true,
    columns: 2,
    description: "Colorful splash design",
  },

  // Two-Column Templates
  {
    id: "template-copenhagen",
    name: "Half Tone",
    category: "two-column",
    hasPhoto: true,
    columns: 2,
    description: "Two-column with half-tone styling",
  },
  {
    id: "template-amsterdam",
    name: "Industrial",
    category: "two-column",
    hasPhoto: false,
    columns: 2,
    description: "Industrial two-column design",
  },
  {
    id: "template-barcelona",
    name: "Elegant",
    category: "two-column",
    hasPhoto: true,
    columns: 2,
    description: "Elegant two-column layout",
  },

  // Professional Templates
  {
    id: "template-new_york",
    name: "Corporate",
    category: "professional",
    hasPhoto: false,
    columns: 1,
    description: "Corporate professional style",
  },
  {
    id: "template-toronto",
    name: "Defined",
    category: "professional",
    hasPhoto: false,
    columns: 1,
    description: "Well-defined professional sections",
  },
  {
    id: "template-chicago",
    name: "Authority",
    category: "professional",
    hasPhoto: false,
    columns: 1,
    description: "Authoritative professional design",
  },
  {
    id: "template-boston",
    name: "Executive",
    category: "professional",
    hasPhoto: false,
    columns: 1,
    description: "Executive-level professional template",
  },
  {
    id: "template-geneva",
    name: "Statement",
    category: "professional",
    hasPhoto: false,
    columns: 1,
    description: "Makes a strong professional statement",
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
  },
  {
    id: "template-rirekisho",
    name: "Rirekisho",
    category: "specialist",
    hasPhoto: true,
    columns: 1,
    description: "Japanese Rirekisho format",
  },
  {
    id: "template-shokumukeirekisho",
    name: "Shokumukeirekisho",
    category: "specialist",
    hasPhoto: true,
    columns: 1,
    description: "Japanese Shokumukeirekisho format",
  },
  {
    id: "template-academic",
    name: "Academic",
    category: "specialist",
    hasPhoto: false,
    columns: 1,
    description: "Academic CV format",
    thumbnail: "/templates/academic-template.jpg",
  },
  {
    id: "template-entry_level",
    name: "Entry Level",
    category: "specialist",
    hasPhoto: false,
    columns: 1,
    description: "Entry-level focused template",
    thumbnail: "/templates/entry_level-template.jpg",
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