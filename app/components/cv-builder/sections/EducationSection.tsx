import type { CVData, CVEducation } from "~/types/cv-builder";
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
import RichTextEditor from "~/components/common/RichTextEditor";
import SectionHeader from "../common/SectionHeader";

interface EducationSectionProps {
  data: CVData;
  onUpdate: (data: CVData) => void;
  aiSuggestions?: any;
}

interface SortableEducationItemProps {
  edu: CVEducation;
  index: number;
  id: string;
  isExpanded: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onUpdate: (field: keyof CVEducation, value: string | boolean) => void;
  getTitle: (edu: CVEducation) => string;
  onAIClick: () => void;
}

function SortableEducationItem({
  edu,
  index,
  id,
  isExpanded,
  onToggle,
  onDelete,
  onUpdate,
  getTitle,
  onAIClick,
}: SortableEducationItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <CollapsibleSection
        title={getTitle(edu)}
        isExpanded={isExpanded}
        onToggle={onToggle}
        onDelete={onDelete}
        isDraggable={true}
        dragHandleProps={{ ...attributes, ...listeners }}
      >
        <div className="space-y-4">
          {/* School & Degree */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              id={`edu-school-${index}`}
              label="School"
              value={edu.institution}
              onChange={(value) => onUpdate("institution", value)}
              placeholder="e.g., University of California"
              maxLength={200}
            />
            <FormInput
              id={`edu-degree-${index}`}
              label="Degree"
              value={edu.degree}
              onChange={(value) => onUpdate("degree", value)}
              placeholder="e.g., Bachelor of Science"
              maxLength={200}
            />
          </div>

          {/* Start & End Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              id={`edu-start-date-${index}`}
              label="Start & End Date"
              value={edu.graduationDate}
              onChange={(value) => onUpdate("graduationDate", value)}
              placeholder="YYYY"
              maxLength={20}
            />
            <FormInput
              id={`edu-end-date-${index}`}
              label=" "
              value=""
              onChange={() => {}}
              placeholder="YYYY"
              maxLength={20}
              optional
            />
          </div>

          {/* City */}
          <FormInput
            id={`edu-city-${index}`}
            label="City"
            value={edu.location || ""}
            onChange={(value) => onUpdate("location", value)}
            placeholder="e.g., Berkeley, CA"
            optional
            maxLength={100}
          />

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Description
            </label>
            <RichTextEditor
              value={edu.achievements?.join("\n") || ""}
              onChange={(value) => onUpdate("achievements", [value])}
              placeholder="e.g., Graduated with honors, Dean's List"
              minHeight="120px"
              showAIButton={true}
              onAIClick={onAIClick}
            />
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );
}

export default function EducationSection({
  data,
  onUpdate,
  aiSuggestions,
}: EducationSectionProps) {
  const [expandedEducation, setExpandedEducation] = useState<Set<number>>(
    new Set([0])
  );

  const education = data.education || [];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const toggleEducation = (index: number) => {
    const newExpanded = new Set(expandedEducation);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedEducation(newExpanded);
  };

  const handleAddEducation = () => {
    const newEducation: CVEducation = {
      degree: "",
      institution: "",
      location: "",
      graduationDate: "",
      isCurrentlyStudying: false,
      gpa: "",
      achievements: [],
    };
    onUpdate({
      ...data,
      education: [...education, newEducation],
    });
    setExpandedEducation(new Set([...expandedEducation, education.length]));
  };

  const handleRemoveEducation = (index: number) => {
    const updated = [...education];
    updated.splice(index, 1);
    onUpdate({
      ...data,
      education: updated,
    });
    const newExpanded = new Set(expandedEducation);
    newExpanded.delete(index);
    setExpandedEducation(newExpanded);
  };

  const handleUpdateEducation = (
    index: number,
    field: keyof CVEducation,
    value: string | boolean
  ) => {
    const updated = [...education];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    onUpdate({
      ...data,
      education: updated,
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = education.findIndex((_, i) => `edu-${i}` === active.id);
      const newIndex = education.findIndex((_, i) => `edu-${i}` === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const updated = arrayMove(education, oldIndex, newIndex);
        onUpdate({
          ...data,
          education: updated,
        });
      }
    }
  };

  const getEducationTitle = (edu: CVEducation) => {
    if (edu.degree && edu.institution) {
      const dateRange = edu.graduationDate || "";
      return `${edu.degree} at ${edu.institution}${dateRange ? ` (${dateRange})` : ""}`;
    }
    if (edu.degree) {
      return edu.degree;
    }
    if (edu.institution) {
      return edu.institution;
    }
    return "(Not specified)";
  };

  const handleAIClick = () => {
    // TODO: Implement AI writer functionality
    console.log("AI writer clicked for education");
  };

  return (
    <div className="space-y-4">
      <SectionHeader
        title="Formations"
        description="A varied education on your resume sums up the value that your learnings and background will bring to job."
      />

      {/* Education List */}
      <div className="space-y-3">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={education.map((_, index) => `edu-${index}`)}
            strategy={verticalListSortingStrategy}
          >
            {education.map((edu, index) => {
              const isExpanded = expandedEducation.has(index);
              return (
                <SortableEducationItem
                  key={index}
                  edu={edu}
                  index={index}
                  id={`edu-${index}`}
                  isExpanded={isExpanded}
                  onToggle={() => toggleEducation(index)}
                  onDelete={() => handleRemoveEducation(index)}
                  onUpdate={(field, value) =>
                    handleUpdateEducation(index, field, value)
                  }
                  getTitle={getEducationTitle}
                  onAIClick={handleAIClick}
                />
              );
            })}
          </SortableContext>
        </DndContext>
      </div>

      {/* Add Button */}
      <button
        type="button"
        onClick={handleAddEducation}
        className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
      >
        <Plus className="w-4 h-4" />
        <span className="text-sm font-medium">+ Add one more education</span>
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
