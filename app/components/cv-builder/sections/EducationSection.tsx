import type { CVData, CVEducation } from "types/cv-builder";
import { Plus, Trash2, GripVertical } from "lucide-react";
import FormInput from "~/components/common/FormInput";
import {
  validateRequired,
  validateGPA,
  validateLength,
  sanitizeInput,
} from "~/utils/formValidation";

interface EducationSectionProps {
  data: CVData;
  onUpdate: (data: CVData) => void;
  aiSuggestions?: any;
}

export default function EducationSection({
  data,
  onUpdate,
  aiSuggestions,
}: EducationSectionProps) {
  const handleAddEducation = () => {
    const newEducation: CVEducation = {
      degree: "",
      institution: "",
      location: "",
      graduationDate: "",
      gpa: "",
      achievements: [],
    };
    onUpdate({
      ...data,
      education: [...(data.education || []), newEducation],
    });
  };

  const handleRemoveEducation = (index: number) => {
    const updated = [...(data.education || [])];
    updated.splice(index, 1);
    onUpdate({
      ...data,
      education: updated,
    });
  };

  const handleUpdateEducation = (
    index: number,
    field: keyof CVEducation,
    value: string | boolean
  ) => {
    const updated = [...(data.education || [])];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    onUpdate({
      ...data,
      education: updated,
    });
  };

  const education = data.education || [];

  return (
    <div className="space-y-6">
      {/* Education List */}
      {education.map((edu, index) => (
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
            onClick={() => handleRemoveEducation(index)}
            className="absolute right-4 top-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            aria-label="Remove education"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <div className="ml-6 space-y-4">
            {/* Degree */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Degree <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={edu.degree}
                onChange={(e) =>
                  handleUpdateEducation(index, "degree", e.target.value)
                }
                placeholder="Bachelor of Science in Computer Science"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Institution & Location */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Institution <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={edu.institution}
                  onChange={(e) =>
                    handleUpdateEducation(index, "institution", e.target.value)
                  }
                  placeholder="Stanford University"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={edu.location || ""}
                  onChange={(e) =>
                    handleUpdateEducation(index, "location", e.target.value)
                  }
                  placeholder="Stanford, CA"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Graduation Date & GPA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-3">
                <FormInput
                  id={`graduationDate-${index}`}
                  label="Graduation Date"
                  value={edu.graduationDate}
                  onChange={(value) =>
                    handleUpdateEducation(index, "graduationDate", value)
                  }
                  placeholder="MM/YYYY"
                  required={!edu.isCurrentlyStudying}
                  disabled={edu.isCurrentlyStudying}
                  description="Format: MM/YYYY"
                  validate={(value) => {
                    if (edu.isCurrentlyStudying) return { isValid: true };
                    const requiredCheck = validateRequired(value, "Graduation date");
                    if (!requiredCheck.isValid) return requiredCheck;
                    return validateLength(value, 0, 20, "Graduation date");
                  }}
                  maxLength={20}
                />
                
                {/* Currently Studying Checkbox */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={edu.isCurrentlyStudying || false}
                    onChange={(e) =>
                      handleUpdateEducation(
                        index,
                        "isCurrentlyStudying",
                        e.target.checked
                      )
                    }
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Currently studying</span>
                </label>
              </div>
              
              <FormInput
                id={`gpa-${index}`}
                label="GPA"
                value={edu.gpa || ""}
                onChange={(value) => handleUpdateEducation(index, "gpa", value)}
                placeholder="3.8"
                optional
                validate={validateGPA}
                description="Out of 4.0"
                maxLength={5}
              />
            </div>
          </div>
        </div>
      ))}

      {/* Add Education Button */}
      <button
        onClick={handleAddEducation}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" />
        <span className="font-medium">Add Education</span>
      </button>

      {/* Tips */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Tips:</h4>
        <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
          <li>List education in reverse chronological order</li>
          <li>Include honors, awards, or relevant coursework if applicable</li>
          <li>Only include GPA if it's 3.5 or higher</li>
          <li>For recent graduates, education can go before experience</li>
        </ul>
      </div>
    </div>
  );
}