import type { CVData } from "~/types/cv-builder";
import { Sparkles } from "lucide-react";

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
    <div className="w-full space-y-3">
      {/* Progress Bar Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        {/* Header with Score */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold text-primary">{completeness}%</div>
            <p className="text-sm font-medium text-gray-600">complete</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-out primary-gradient"
            style={{
              width: `${completeness}%`,
            }}
          />
        </div>
      </div>

      {/* Suggestions with Sparkles Icon */}
      {!isComplete && suggestions.length > 0 && (
        <div className="space-y-2">
          {suggestions.slice(0, 3).map((suggestion, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100/50 hover:border-blue-200/70 transition-colors"
            >
              <div className="flex-shrink-0 w-8 h-5 bg-blue-100 rounded flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-sm text-gray-700 font-medium">{suggestion}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}