import type { CVData, CVSkillGroup } from "types/cv-builder";
import { Plus, X, Lightbulb, Trash2 } from "lucide-react";
import { useState } from "react";
import FormInput from "~/components/common/FormInput";
import { validateLength } from "~/utils/formValidation";

interface SkillsSectionProps {
  data: CVData;
  onUpdate: (data: CVData) => void;
  aiSuggestions?: any;
}

export default function SkillsSection({
  data,
  onUpdate,
  aiSuggestions,
}: SkillsSectionProps) {
  const [skillInput, setSkillInput] = useState("");
  const [groupTitleInput, setGroupTitleInput] = useState("");

  const skillGroups = data.skillGroups || [];

  const handleAddGroup = () => {
    const newGroup: CVSkillGroup = {
      title: groupTitleInput.trim() || undefined,
      skills: [],
    };
    onUpdate({
      ...data,
      skillGroups: [...skillGroups, newGroup],
    });
    setGroupTitleInput("");
  };

  const handleRemoveGroup = (groupIndex: number) => {
    const updated = [...skillGroups];
    updated.splice(groupIndex, 1);
    onUpdate({
      ...data,
      skillGroups: updated,
    });
  };

  const handleUpdateGroupTitle = (groupIndex: number, title: string) => {
    const updated = [...skillGroups];
    updated[groupIndex] = {
      ...updated[groupIndex],
      title: title.trim() || undefined,
    };
    onUpdate({
      ...data,
      skillGroups: updated,
    });
  };

  const handleAddSkillToGroup = (groupIndex: number, skill: string) => {
    if (skill.trim()) {
      const updated = [...skillGroups];
      updated[groupIndex] = {
        ...updated[groupIndex],
        skills: [...updated[groupIndex].skills, skill.trim()],
      };
      onUpdate({
        ...data,
        skillGroups: updated,
      });
    }
  };

  const handleRemoveSkillFromGroup = (
    groupIndex: number,
    skillIndex: number
  ) => {
    const updated = [...skillGroups];
    const updatedSkills = [...updated[groupIndex].skills];
    updatedSkills.splice(skillIndex, 1);
    updated[groupIndex] = {
      ...updated[groupIndex],
      skills: updatedSkills,
    };
    onUpdate({
      ...data,
      skillGroups: updated,
    });
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-600">
        Organize your skills into groups (e.g., "Programming Languages", "Tools
        & Technologies"). Groups with titles help structure your CV better.
      </p>

      {/* Skill Groups */}
      {skillGroups.map((group, groupIndex) => (
        <div
          key={groupIndex}
          className="p-4 bg-gray-50 border border-gray-200 rounded-lg relative"
        >
          {/* Delete Group Button */}
          <button
            onClick={() => handleRemoveGroup(groupIndex)}
            className="absolute right-3 top-3 p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            aria-label="Remove skill group"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <div className="space-y-4 pr-8">
            {/* Group Title (Optional) */}
            <FormInput
              id={`group-title-${groupIndex}`}
              label="Group Title"
              value={group.title || ""}
              onChange={(value) => handleUpdateGroupTitle(groupIndex, value)}
              placeholder="e.g., Programming Languages, Tools & Technologies"
              optional
              validate={(value) =>
                validateLength(value, 0, 50, "Group title")
              }
              maxLength={50}
              description="Leave blank for a single ungrouped skills list"
            />

            {/* Skills Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skills
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddSkillToGroup(groupIndex, skillInput);
                      setSkillInput("");
                    }
                  }}
                  placeholder="e.g., JavaScript, Python, React"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={() => {
                    handleAddSkillToGroup(groupIndex, skillInput);
                    setSkillInput("");
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Add</span>
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Press Enter or click Add
              </p>
            </div>

            {/* Skills List */}
            {group.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill, skillIndex) => (
                  <div
                    key={skillIndex}
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg border border-blue-200"
                  >
                    <span className="text-sm font-medium">{skill}</span>
                    <button
                      onClick={() =>
                        handleRemoveSkillFromGroup(groupIndex, skillIndex)
                      }
                      className="text-blue-600 hover:text-blue-800"
                      aria-label={`Remove ${skill}`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Add Skill Group Button */}
      <button
        onClick={handleAddGroup}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" />
        <span className="font-medium">Add Skill Group</span>
      </button>

      {/* AI Suggestions */}
      {aiSuggestions?.skills && aiSuggestions.skills.length > 0 && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">
                AI Suggested Skills
              </h4>
              <p className="text-sm text-blue-800 mb-3">
                Based on your experience, consider adding these skills:
              </p>
              <div className="flex flex-wrap gap-2">
                {aiSuggestions.skills.map((skill: string, index: number) => {
                  const allSkills = skillGroups.flatMap((g) => g.skills);
                  const isAdded = allSkills.includes(skill);
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        if (!isAdded && skillGroups.length > 0) {
                          handleAddSkillToGroup(0, skill);
                        }
                      }}
                      className="px-3 py-1 bg-white border border-blue-300 text-blue-700 rounded-lg text-sm hover:bg-blue-100 transition-colors"
                      disabled={isAdded}
                    >
                      {isAdded ? "✓ " : "+ "}
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Tips:</h4>
        <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
          <li>Group similar skills together (e.g., "Programming Languages", "Design Tools")</li>
          <li>Use industry-standard terms for ATS optimization</li>
          <li>Prioritize skills mentioned in job descriptions</li>
          <li>Be honest - only list skills you can demonstrate</li>
          <li>Leave group title blank if you prefer an ungrouped list</li>
        </ul>
      </div>
    </div>
  );
}