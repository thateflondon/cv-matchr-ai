import type { CVData } from "~/types/cv-builder";

interface ResumeCompletenessProps {
  cvData: CVData;
}

export default function ResumeCompleteness({ cvData }: ResumeCompletenessProps) {
  // Calculate completeness score
  const calculateCompleteness = (): number => {
    let score = 0;

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

  return (
    <div className="w-full">
      {/* Progress Bar Section */}
      <div className="bg-white rounded-xl">
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
    </div>
  );
}