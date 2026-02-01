import type { CVData, Skill } from "~/types/cv-builder";
import { Plus, Sparkles, Loader2, Check } from "lucide-react";
import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import CollapsibleSection from "../common/CollapsibleSection";
import FormInput from "~/components/common/FormInput";
import SectionHeader from "../common/SectionHeader";
import { usePuterStore } from "~/lib/puter";
import { generateSkillsSuggestions } from "~/utils/aiWriter";

interface SkillsSectionProps {
  data: CVData;
  onUpdate: (data: CVData) => void;
  aiSuggestions?: any;
}

interface SortableSkillItemProps {
  skill: Skill;
  isExpanded: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onUpdate: (field: keyof Skill, value: string) => void;
  getTitle: (skill: Skill) => string;
  showExperienceLevel: boolean;
}

function SortableSkillItem({
  skill,
  isExpanded,
  onToggle,
  onDelete,
  onUpdate,
  getTitle,
  showExperienceLevel,
}: SortableSkillItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: skill.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <CollapsibleSection
        title={getTitle(skill)}
        isExpanded={isExpanded}
        onToggle={onToggle}
        onDelete={onDelete}
        isDraggable={true}
        dragHandleProps={{ ...attributes, ...listeners }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            id={`skill-name-${skill.id}`}
            label="Skill"
            value={skill.name}
            onChange={(value) => onUpdate("name", value)}
            placeholder="e.g., JavaScript, React, Python"
            maxLength={50}
          />

          {showExperienceLevel && (
            <div>
              <label
                htmlFor={`skill-level-${skill.id}`}
                className="block text-sm font-medium text-foreground mb-2"
              >
                Level
              </label>
              <select
                id={`skill-level-${skill.id}`}
                value={skill.level || ""}
                onChange={(e) => onUpdate("level", e.target.value)}
                className="w-full px-3 py-2.5 border border-border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-input-background"
              >
                <option value="">Select level</option>
                <option value="novice">Novice</option>
                <option value="beginner">Beginner</option>
                <option value="skillful">Skillful</option>
                <option value="experienced">Experienced</option>
                <option value="expert">Expert</option>
              </select>
            </div>
          )}
        </div>
      </CollapsibleSection>
    </div>
  );
}

export default function SkillsSection({
  data,
  onUpdate,
  aiSuggestions,
}: SkillsSectionProps) {
  const [expandedSkills, setExpandedSkills] = useState<Set<string>>(new Set());
  const [showExperienceLevel, setShowExperienceLevel] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [suggestedSkills, setSuggestedSkills] = useState<Skill[]>([]);
  const { ai } = usePuterStore();

  const skills = data.skillsData || [];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const toggleSkill = (id: string) => {
    const newExpanded = new Set(expandedSkills);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedSkills(newExpanded);
  };

  const handleAddSkill = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: "",
      level: "",
    };
    onUpdate({
      ...data,
      skillsData: [...skills, newSkill],
    });
    setExpandedSkills(new Set([...expandedSkills, newSkill.id]));
  };

  const handleRemoveSkill = (id: string) => {
    const updated = skills.filter((skill) => skill.id !== id);
    onUpdate({
      ...data,
      skillsData: updated,
    });
    const newExpanded = new Set(expandedSkills);
    newExpanded.delete(id);
    setExpandedSkills(newExpanded);
  };

  const handleUpdateSkill = (id: string, field: keyof Skill, value: string) => {
    const updated = skills.map((skill) =>
      skill.id === id ? { ...skill, [field]: value } : skill
    );
    onUpdate({
      ...data,
      skillsData: updated,
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = skills.findIndex((skill) => skill.id === active.id);
      const newIndex = skills.findIndex((skill) => skill.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const updated = arrayMove(skills, oldIndex, newIndex);
        onUpdate({
          ...data,
          skillsData: updated,
        });
      }
    }
  };

  const getSkillTitle = (skill: Skill) => {
    if (skill.name && skill.level && showExperienceLevel) {
      return `${skill.name} (${skill.level})`;
    }
    if (skill.name) {
      return skill.name;
    }
    return "(Not specified)";
  };

  const handleAIClick = async () => {
    setIsGenerating(true);
    setAiError(null);

    try {
      const result = await generateSkillsSuggestions(ai.chat, data);

      if (result.success && result.data) {
        setSuggestedSkills(result.data);
      } else {
        setAiError(result.error || "Failed to generate skills suggestions");
      }
    } catch (error) {
      setAiError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsGenerating(false);
    }
  };

  const addSuggestedSkill = (skill: Skill) => {
    // Check if skill already exists
    const exists = skills.some(
      (s) => s.name.toLowerCase() === skill.name.toLowerCase()
    );
    if (exists) {
      setAiError(`"${skill.name}" is already in your skills list`);
      return;
    }

    onUpdate({
      ...data,
      skillsData: [...skills, skill],
    });
    setExpandedSkills(new Set([...expandedSkills, skill.id]));
    // Remove from suggestions
    setSuggestedSkills(suggestedSkills.filter((s) => s.id !== skill.id));
  };

  const addAllSuggestedSkills = () => {
    const existingNames = new Set(skills.map((s) => s.name.toLowerCase()));
    const newSkills = suggestedSkills.filter(
      (s) => !existingNames.has(s.name.toLowerCase())
    );

    if (newSkills.length === 0) {
      setAiError("All suggested skills are already in your list");
      return;
    }

    onUpdate({
      ...data,
      skillsData: [...skills, ...newSkills],
    });
    setSuggestedSkills([]);
  };

  return (
    <div className="space-y-4">
      <SectionHeader
        title="Expertises"
        description="Choose 5 important skills that show you fit the position. Make sure they match the key skills mentioned in the job listing (especially when applying via an online system)."
      />

      {/* Toggle Experience Level */}
      <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
        <label className="flex items-center gap-3 cursor-pointer flex-1">
          <input
            type="checkbox"
            checked={!showExperienceLevel}
            onChange={(e) => setShowExperienceLevel(!e.target.checked)}
            className="w-5 h-5 text-primary border-border rounded focus:ring-primary"
          />
          <span className="text-sm font-medium text-foreground">
            Don't show experience level
          </span>
        </label>
      </div>

      {/* Skills List */}
      <div className="space-y-3">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={skills.map((skill) => skill.id)}
            strategy={verticalListSortingStrategy}
          >
            {skills.map((skill) => {
              const isExpanded = expandedSkills.has(skill.id);
              return (
                <SortableSkillItem
                  key={skill.id}
                  skill={skill}
                  isExpanded={isExpanded}
                  onToggle={() => toggleSkill(skill.id)}
                  onDelete={() => handleRemoveSkill(skill.id)}
                  onUpdate={(field, value) =>
                    handleUpdateSkill(skill.id, field, value)
                  }
                  getTitle={getSkillTitle}
                  showExperienceLevel={showExperienceLevel}
                />
              );
            })}
          </SortableContext>
        </DndContext>
      </div>

      {/* Add Button */}
      <button
        type="button"
        onClick={handleAddSkill}
        className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
      >
        <Plus className="w-4 h-4" />
        <span className="text-sm font-medium">Add one more skill</span>
      </button>

      {/* AI Error */}
      {aiError && (
        <div className="w-full px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{aiError}</p>
          <button
            onClick={() => setAiError(null)}
            className="text-sm text-red-500 hover:underline mt-1"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* AI Suggested Skills */}
      {suggestedSkills.length > 0 && (
        <div className="w-full px-4 py-3 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0" />
            <h4 className="text-sm font-semibold text-foreground">
              AI-Suggested Skills
            </h4>
            <button
              onClick={() => setSuggestedSkills([])}
              className="ml-auto text-sm text-gray-400 hover:underline"
            >
              Dismiss
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {suggestedSkills.map((skill) => (
              <button
                key={skill.id}
                onClick={() => addSuggestedSkill(skill)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-purple-200 rounded-full text-sm text-foreground hover:bg-purple-50 hover:border-purple-300 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-purple-600" />
                <span>{skill.name}</span>
                {skill.level && (
                  <span className="text-xs text-muted-foreground">
                    ({skill.level})
                  </span>
                )}
              </button>
            ))}
          </div>
          <button
            onClick={addAllSuggestedSkills}
            className="flex items-center gap-2 text-sm text-purple-600 font-medium hover:underline"
          >
            <Check className="w-4 h-4" />
            Add all suggested skills
          </button>
        </div>
      )}

      {/* Ask AI Writer Button */}
      <div className="flex justify-center pt-4">
        <button
          type="button"
          onClick={handleAIClick}
          disabled={isGenerating}
          className="flex items-center gap-2 px-6 py-3 rounded-lg transition-colors disabled:opacity-70"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
          }}
        >
          {isGenerating ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Sparkles className="w-5 h-5" />
          )}
          <span className="font-medium">
            {isGenerating ? "Generating..." : "Suggest skills with AI"}
          </span>
        </button>
      </div>
    </div>
  );
}