import type { CVData } from "types/cv-builder";

/**
 * Extracts CV data from an analyzed Resume object
 * This is a simplified version - in a real implementation,
 * you would need to parse the actual resume file content
 */
export function extractCVDataFromResume(resume: Resume): CVData {
  // For now, we'll extract what we can from the Resume object
  // In a real implementation, you would:
  // 1. Parse the resume file (PDF/DOCX)
  // 2. Use AI to extract structured data
  // 3. Map it to CVData structure

  return {
    personalDetails: {
      firstName: "",
      lastName: "",
      jobTitle: resume.jobTitle || "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      website: "",
    },
    professionalSummary: "",
    professionalExperience: [],
    education: [],
    skills: extractSkillsFromFeedback(resume.feedback),
    accomplishments: [],
    powerStatement: "",
    additionalSections: [],
  };
}

/**
 * Extracts skills from feedback tips
 */
function extractSkillsFromFeedback(feedback: Feedback): string[] {
  const skills: string[] = [];
  
  // Extract skills mentioned in "good" tips
  feedback.skills.tips.forEach((tip) => {
    if (tip.type === "good") {
      // Try to extract skills from the tip text
      // This is a simple implementation - in reality you'd use more sophisticated parsing
      const skillMatches = tip.tip.match(/["']([^"']+)["']/g);
      if (skillMatches) {
        skillMatches.forEach((match) => {
          const skill = match.replace(/["']/g, "");
          if (skill && !skills.includes(skill)) {
            skills.push(skill);
          }
        });
      }
    }
  });

  return skills;
}

/**
 * Converts feedback tips into AI suggestions for the CV builder
 */
export function convertFeedbackToSuggestions(feedback: Feedback) {
  const suggestions: any = {
    professionalSummary: null,
    experience: [],
    skills: [],
    jobTitle: null,
  };

  // Extract suggestions from content tips
  const improveTips = feedback.content.tips.filter((tip) => tip.type === "improve");
  if (improveTips.length > 0) {
    suggestions.professionalSummary = {
      text: improveTips[0].explanation || improveTips[0].tip,
    };
  }

  // Extract skill suggestions
  feedback.skills.tips.forEach((tip) => {
    if (tip.type === "improve") {
      // Try to extract suggested skills from tip text
      const skillMatches = tip.tip.match(/["']([^"']+)["']/g);
      if (skillMatches) {
        skillMatches.forEach((match) => {
          const skill = match.replace(/["']/g, "");
          if (skill && !suggestions.skills.includes(skill)) {
            suggestions.skills.push(skill);
          }
        });
      }
    }
  });

  return suggestions;
}