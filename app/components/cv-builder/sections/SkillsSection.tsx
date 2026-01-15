import type { CVData, Skill } from "~/types/cv-builder";
import { Plus, Sparkles } from "lucide-react";
import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
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

  const handleAIClick = () => {
    // TODO: Implement AI writer functionality
    console.log("AI writer clicked for skills");
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
        <span className="text-sm font-medium">+ Add one more skill</span>
      </button>

      {/* Ask AI Writer Button */}
      <div className="flex justify-center pt-4">
        <button
          type="button"
          onClick={handleAIClick}
          className="flex items-center gap-2 px-6 py-3 rounded-lg transition-colors"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
          }}
        >
          <Sparkles className="w-5 h-5" />
          <span className="font-medium">Ask AI writer</span>
        </button>
      </div>
    </div>
  );
}
