import { Plus, GripVertical, Trash2, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import type { CVData } from "~/types/cv-builder";

interface SelectedAchievementsSectionProps {
  data: CVData;
  onUpdate: (data: CVData) => void;
}

export default function SelectedAchievementsSection({
  data,
  onUpdate,
}: SelectedAchievementsSectionProps) {
  const [isVisible, setIsVisible] = useState(
    data.selectedAchievements ? data.selectedAchievements.length > 0 : true
  );
  const [achievements, setAchievements] = useState<string[]>(
    data.selectedAchievements || []
  );

  const handleToggleVisibility = () => {
    const newVisibility = !isVisible;
    setIsVisible(newVisibility);
    
    // If hiding, clear achievements from data
    if (!newVisibility) {
      onUpdate({
        ...data,
        selectedAchievements: [],
      });
      setAchievements([]);
    }
  };

  const handleAddAchievement = () => {
    const newAchievements = [...achievements, ""];
    setAchievements(newAchievements);
    onUpdate({
      ...data,
      selectedAchievements: newAchievements,
    });
  };

  const handleUpdateAchievement = (index: number, value: string) => {
    const newAchievements = [...achievements];
    newAchievements[index] = value;
    setAchievements(newAchievements);
    onUpdate({
      ...data,
      selectedAchievements: newAchievements,
    });
  };

  const handleDeleteAchievement = (index: number) => {
    const newAchievements = achievements.filter((_, i) => i !== index);
    setAchievements(newAchievements);
    onUpdate({
      ...data,
      selectedAchievements: newAchievements,
    });
  };

  return (
    <div className="space-y-6">
      {/* Section Header with Visibility Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Selected Achievements
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Highlight your most impressive achievements for the Academic template
          </p>
        </div>
        <button
          onClick={handleToggleVisibility}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
            isVisible
              ? "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              : "border-gray-300 bg-gray-50 text-gray-500"
          }`}
        >
          {isVisible ? (
            <>
              <Eye className="w-4 h-4" />
              <span className="text-sm font-medium">Visible</span>
            </>
          ) : (
            <>
              <EyeOff className="w-4 h-4" />
              <span className="text-sm font-medium">Hidden</span>
            </>
          )}
        </button>
      </div>

      {isVisible && (
        <>
          {/* Info Banner */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 <strong>Academic Template Only:</strong> This section is
              specifically designed for the Academic template and will appear
              between your Professional Summary and Education sections.
            </p>
          </div>

          {/* Achievements List */}
          <div className="space-y-3">
            {achievements.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500 mb-4">No achievements added yet</p>
                <button
                  onClick={handleAddAchievement}
                  className="inline-flex items-center gap-2 px-4 py-2 primary-gradient text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  <Plus className="w-4 h-4" />
                  Add First Achievement
                </button>
              </div>
            ) : (
              <>
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                  >
                    {/* Drag Handle */}
                    <div className="pt-2">
                      <GripVertical className="w-5 h-5 text-gray-400" />
                    </div>

                    {/* Achievement Input */}
                    <div className="flex-1">
                      <textarea
                        value={achievement}
                        onChange={(e) =>
                          handleUpdateAchievement(index, e.target.value)
                        }
                        placeholder="Describe your achievement (e.g., Published 15+ peer-reviewed articles in top-tier journals)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        rows={2}
                      />
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteAchievement(index)}
                      className="mt-2 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {/* Add More Button */}
                <button
                  onClick={handleAddAchievement}
                  className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-700 hover:border-primary hover:text-primary hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Another Achievement
                </button>
              </>
            )}
          </div>

          {/* Tips Section */}
          {achievements.length > 0 && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="text-sm font-semibold text-green-900 mb-2">
                ✨ Writing Tips:
              </h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Start with strong action verbs (Led, Developed, Achieved)</li>
                <li>• Include quantifiable metrics when possible</li>
                <li>• Focus on outcomes and impact</li>
                <li>• Keep each achievement concise (1-2 lines)</li>
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
