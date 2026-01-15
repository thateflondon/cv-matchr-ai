import type { CVData } from "types/cv-builder";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface ResumeCompletenessProps {
  cvData: CVData;
}

export default function ResumeCompleteness({ cvData }: ResumeCompletenessProps) {
  // Calculate completeness score
  const calculateCompleteness = (): number => {
    let score = 0;
    let totalFields = 7; // Total number of sections

    // Personal Details (weight: 20%)
    if (
      cvData.personalDetails?.firstName &&
      cvData.personalDetails?.lastName &&
      cvData.personalDetails?.email &&
      cvData.personalDetails?.phone
    ) {
      score += 20;
    } else if (
      cvData.personalDetails?.firstName ||
      cvData.personalDetails?.lastName
    ) {
      score += 10;
    }

    // Job Title (weight: 10%)
    if (cvData.personalDetails?.jobTitle) {
      score += 10;
    }

    // Professional Summary (weight: 15%)
    const summaryLength = cvData.professionalSummary?.replace(/<[^>]*>/g, "").length || 0;
    if (summaryLength > 150) {
      score += 15;
    } else if (summaryLength > 0) {
      score += 8;
    }

    // Professional Experience (weight: 25%)
    if (cvData.professionalExperience && cvData.professionalExperience.length > 0) {
      const hasCompleteExperience = cvData.professionalExperience.some(
        (exp) =>
          exp.jobTitle &&
          exp.company &&
          exp.startDate &&
          (exp.description || (exp.achievements && exp.achievements.length > 0))
      );
      if (hasCompleteExperience) {
        score += 25;
      } else {
        score += 12;
      }
    }

    // Education (weight: 15%)
    if (cvData.education && cvData.education.length > 0) {
      const hasCompleteEducation = cvData.education.some(
        (edu) => edu.degree && edu.institution && edu.graduationDate
      );
      if (hasCompleteEducation) {
        score += 15;
      } else {
        score += 8;
      }
    }

    // Skills (weight: 10%)
    if (cvData.skills && cvData.skills.length >= 5) {
      score += 10;
    } else if (cvData.skills && cvData.skills.length > 0) {
      score += 5;
    }

    // Additional content (weight: 5%)
    if (
      (cvData.accomplishments && cvData.accomplishments.length > 0) ||
      (cvData.additionalSections && cvData.additionalSections.length > 0)
    ) {
      score += 5;
    }

    return Math.min(score, 100);
  };

  const completeness = calculateCompleteness();
  const isComplete = completeness === 100;
  const isAlmostComplete = completeness >= 80;

  // Get suggestions for improvement
  const getSuggestions = (): string[] => {
    const suggestions: string[] = [];

    if (!cvData.personalDetails?.firstName || !cvData.personalDetails?.lastName) {
      suggestions.push("Add your full name");
    }
    if (!cvData.personalDetails?.email || !cvData.personalDetails?.phone) {
      suggestions.push("Add contact information");
    }
    if (!cvData.professionalSummary || cvData.professionalSummary.replace(/<[^>]*>/g, "").length < 150) {
      suggestions.push("Write a professional summary (150+ characters)");
    }
    if (!cvData.professionalExperience || cvData.professionalExperience.length === 0) {
      suggestions.push("Add work experience");
    }
    if (!cvData.education || cvData.education.length === 0) {
      suggestions.push("Add education");
    }
    if (!cvData.skills || cvData.skills.length < 5) {
      suggestions.push("Add at least 5 skills");
    }

    return suggestions;
  };

  const suggestions = getSuggestions();

  return (
    <div className="w-full">
      {/* Completeness Badge */}
      <div
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
          isComplete
            ? "bg-green-500/10 text-green-700 border border-green-500/20"
            : isAlmostComplete
            ? "bg-blue-500/10 text-blue-700 border border-blue-500/20"
            : "bg-orange-500/10 text-orange-700 border border-orange-500/20"
        }`}
      >
        {isComplete ? (
          <CheckCircle2 className="w-5 h-5" />
        ) : (
          <AlertCircle className="w-5 h-5" />
        )}
        <div className="flex-1">
          <span className="font-medium">
            {completeness}% Resume Completeness
          </span>
        </div>
      </div>

      {/* Suggestions */}
      {!isComplete && suggestions.length > 0 && (
        <div className="mt-3 p-3 bg-muted rounded-lg">
          <p className="text-sm font-medium text-foreground mb-2">
            To reach 100%:
          </p>
          <ul className="space-y-1">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="text-sm text-muted-foreground flex items-start gap-2"
              >
                <span className="text-primary mt-0.5">•</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}