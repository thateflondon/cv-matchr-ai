import type { CVData, CVProfessionalExperience } from "types/cv-builder";
import { Plus, Trash2, GripVertical, Lightbulb } from "lucide-react";

interface ProfessionalExperienceSectionProps {
  data: CVData;
  onUpdate: (data: CVData) => void;
  aiSuggestions?: any;
}

export default function ProfessionalExperienceSection({
  data,
  onUpdate,
  aiSuggestions,
}: ProfessionalExperienceSectionProps) {
  const handleAddExperience = () => {
    const newExperience: CVProfessionalExperience = {
      jobTitle: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
      achievements: [],
    };
    onUpdate({
      ...data,
      professionalExperience: [
        ...(data.professionalExperience || []),
        newExperience,
      ],
    });
  };

  const handleRemoveExperience = (index: number) => {
    const updated = [...(data.professionalExperience || [])];
    updated.splice(index, 1);
    onUpdate({
      ...data,
      professionalExperience: updated,
    });
  };

  const handleUpdateExperience = (
    index: number,
    field: keyof CVProfessionalExperience,
    value: string
  ) => {
    const updated = [...(data.professionalExperience || [])];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    onUpdate({
      ...data,
      professionalExperience: updated,
    });
  };

  const experiences = data.professionalExperience || [];

  return (
    <div className="space-y-6">
      {/* Experiences List */}
      {experiences.map((exp, index) => (
        <div
          key={index}
          className="p-6 bg-gray-50 border border-gray-200 rounded-lg relative"
        >
          {/* Drag Handle */}
          <div className="absolute left-2 top-6 cursor-grab">
            <GripVertical className="w-5 h-5 text-gray-400" />
          </div>

          {/* Delete Button */}
          <button
            onClick={() => handleRemoveExperience(index)}
            className="absolute right-4 top-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            aria-label="Remove experience"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <div className="ml-6 space-y-4">
            {/* Job Title & Company */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={exp.jobTitle}
                  onChange={(e) =>
                    handleUpdateExperience(index, "jobTitle", e.target.value)
                  }
                  placeholder="Senior Software Engineer"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) =>
                    handleUpdateExperience(index, "company", e.target.value)
                  }
                  placeholder="Tech Corp"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={exp.location || ""}
                onChange={(e) =>
                  handleUpdateExperience(index, "location", e.target.value)
                }
                placeholder="San Francisco, CA"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={exp.startDate}
                  onChange={(e) =>
                    handleUpdateExperience(index, "startDate", e.target.value)
                  }
                  placeholder="Jan 2020"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="text"
                  value={exp.endDate || ""}
                  onChange={(e) =>
                    handleUpdateExperience(index, "endDate", e.target.value)
                  }
                  placeholder="Present"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={exp.description || ""}
                onChange={(e) =>
                  handleUpdateExperience(index, "description", e.target.value)
                }
                placeholder="Describe your responsibilities and achievements. Use action verbs and quantify results when possible."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* AI Suggestion for this experience */}
            {aiSuggestions?.experience?.[index] && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-blue-900">
                      <strong>AI Suggestion:</strong>{" "}
                      {aiSuggestions.experience[index].text}
                    </p>
                    <button
                      onClick={() =>
                        handleUpdateExperience(
                          index,
                          "description",
                          aiSuggestions.experience[index].text
                        )
                      }
                      className="text-sm text-blue-600 font-medium mt-1 hover:underline"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Add Experience Button */}
      <button
        onClick={handleAddExperience}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" />
        <span className="font-medium">Add Experience</span>
      </button>

      {/* Tips */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-2">
          Writing Tips:
        </h4>
        <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
          <li>Start bullet points with strong action verbs (Led, Developed, Increased)</li>
          <li>Quantify achievements with numbers, percentages, or metrics</li>
          <li>Focus on impact and results, not just responsibilities</li>
          <li>Tailor descriptions to match the job you're applying for</li>
          <li>List experiences in reverse chronological order</li>
        </ul>
      </div>
    </div>
  );
}