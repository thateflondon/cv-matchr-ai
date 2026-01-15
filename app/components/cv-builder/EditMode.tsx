import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CVData } from "~/types/cv-builder";
import PersonalDetailsSection from "./sections/PersonalDetailsSection";
import ProfessionalSummarySection from "./sections/ProfessionalSummarySection";
import WebsitesAndSocialLinksSection from "./sections/WebsitesAndSocialLinksSection";
import ProfessionalExperienceSection from "./sections/ProfessionalExperienceSection";
import EducationSection from "./sections/EducationSection";
import SkillsSection from "./sections/SkillsSection";
import LanguagesSection from "./sections/LanguagesSection";
import AdditionalSectionsManager from "./sections/AdditionalSectionsManager";
import ResumeCompleteness from "./ResumeCompleteness";

interface EditModeProps {
  cvData: CVData;
  onChange: (data: CVData) => void;
  aiSuggestions?: any; // TODO: Define AI suggestions type
}

const sections = [
  { id: "personal", label: "Personal Details", component: PersonalDetailsSection },
  { id: "summary", label: "Professional Summary", component: ProfessionalSummarySection },
  { id: "websites", label: "Websites & Social Links", component: WebsitesAndSocialLinksSection },
  { id: "experience", label: "Professional Experience", component: ProfessionalExperienceSection },
  { id: "education", label: "Education", component: EducationSection },
  { id: "skills", label: "Areas of Expertise", component: SkillsSection },
  { id: "languages", label: "Languages", component: LanguagesSection },
  { id: "additional", label: "Additional Sections", component: AdditionalSectionsManager },
];

export default function EditMode({
  cvData,
  onChange,
  aiSuggestions,
}: EditModeProps) {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const currentSection = sections[currentSectionIndex];
  const SectionComponent = currentSection.component;

  const handleNext = () => {
    if (currentSectionIndex < sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Resume Completeness Badge */}
      <div className="mb-6">
        <ResumeCompleteness cvData={cvData} />
      </div>

      {/* Section Title */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {currentSection.label}
      </h2>

      {/* Section Content */}
      <div className="flex-1 overflow-auto">
        <SectionComponent
          data={cvData}
          onUpdate={onChange}
          aiSuggestions={aiSuggestions}
        />
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-6">
        <button
          onClick={handleBack}
          disabled={currentSectionIndex === 0}
          className={`flex items-center gap-2 px-4 py-2.5 sm:py-2 rounded-lg transition-colors touch-manipulation ${
            currentSectionIndex === 0
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="font-medium hidden sm:inline">Back</span>
        </button>

        <div className="flex gap-2">
          {sections.map((section, index) => (
            <button
              key={section.id}
              onClick={() => setCurrentSectionIndex(index)}
              className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-colors touch-manipulation ${
                index === currentSectionIndex
                  ? "bg-blue-600 w-6 sm:w-8"
                  : index < currentSectionIndex
                  ? "bg-blue-300"
                  : "bg-gray-300"
              }`}
              aria-label={`Go to ${section.label}`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={currentSectionIndex === sections.length - 1}
          className={`flex items-center gap-2 px-4 py-2.5 sm:py-2 rounded-lg transition-colors touch-manipulation ${
            currentSectionIndex === sections.length - 1
              ? "text-gray-400 cursor-not-allowed"
              : "text-white bg-blue-600 hover:bg-blue-700"
          }`}
        >
          <span className="font-medium hidden sm:inline">
            {currentSectionIndex === sections.length - 1
              ? "Finish"
              : `Next: ${sections[currentSectionIndex + 1].label}`}
          </span>
          <span className="font-medium sm:hidden">
            {currentSectionIndex === sections.length - 1 ? "Finish" : "Next"}
          </span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}