import type { CVData, CVProfessionalExperience } from "~/types/cv-builder";
import { Plus, Sparkles, Loader2 } from "lucide-react";
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
import RichTextEditor from "~/components/common/RichTextEditor";
import SectionHeader from "../common/SectionHeader";
import { usePuterStore } from "~/lib/puter";
import { generateExperienceDescription } from "~/utils/aiWriter";

interface ProfessionalExperienceSectionProps {
  data: CVData;
  onUpdate: (data: CVData) => void;
  aiSuggestions?: any;
}

interface SortableExperienceItemProps {
  exp: CVProfessionalExperience;
  index: number;
  id: string;
  isExpanded: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onUpdate: (field: keyof CVProfessionalExperience, value: string) => void;
  getTitle: (exp: CVProfessionalExperience) => string;
  onAIClick: () => void;
  isAILoading?: boolean;
}

function SortableExperienceItem({
  exp,
  index,
  id,
  isExpanded,
  onToggle,
  onDelete,
  onUpdate,
  getTitle,
  onAIClick,
  isAILoading = false,
}: SortableExperienceItemProps) {
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
        title={getTitle(exp)}
        isExpanded={isExpanded}
        onToggle={onToggle}
        onDelete={onDelete}
        isDraggable={true}
        dragHandleProps={{ ...attributes, ...listeners }}
      >
        <div className="space-y-4">
          {/* Job Title & Employer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              id={`exp-job-title-${index}`}
              label="Job title"
              value={exp.jobTitle}
              onChange={(value) => onUpdate("jobTitle", value)}
              placeholder="e.g., Senior Software Engineer"
              maxLength={100}
            />
            <FormInput
              id={`exp-employer-${index}`}
              label="Employer"
              value={exp.company}
              onChange={(value) => onUpdate("company", value)}
              placeholder="e.g., Tech Corp"
              maxLength={100}
            />
          </div>

          {/* Start & End Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              id={`exp-start-date-${index}`}
              label="Start & End Date"
              value={exp.startDate}
              onChange={(value) => onUpdate("startDate", value)}
              placeholder="MM/YYYY"
              maxLength={20}
            />
            <FormInput
              id={`exp-end-date-${index}`}
              label=" "
              value={exp.endDate || ""}
              onChange={(value) => onUpdate("endDate", value)}
              placeholder="MM/YYYY or Present"
              maxLength={20}
            />
          </div>

          {/* City, State */}
          <FormInput
            id={`exp-location-${index}`}
            label="City, State"
            value={exp.location || ""}
            onChange={(value) => onUpdate("location", value)}
            placeholder="e.g., San Francisco, CA"
            optional
            maxLength={100}
          />

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Description
            </label>
            <RichTextEditor
              value={exp.description || ""}
              onChange={(value) => onUpdate("description", value)}
              placeholder="e.g., Created and implemented lesson plans based on child-led interests and curiosities."
              minHeight="150px"
              showAIButton={true}
              onAIClick={onAIClick}
              isAILoading={isAILoading}
              showCharacterCount={true}
              minCharacters={200}
              recruiterTip="Recruiters read on average 6 seconds per resume: write 200+ characters to increase interview chances"
            />
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );
}

export default function ProfessionalExperienceSection({
  data,
  onUpdate,
  aiSuggestions,
}: ProfessionalExperienceSectionProps) {
  const [expandedExperiences, setExpandedExperiences] = useState<Set<number>>(
    new Set([0])
  );
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const { ai } = usePuterStore();

  const experiences = data.professionalExperience || [];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const toggleExperience = (index: number) => {
    const newExpanded = new Set(expandedExperiences);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedExperiences(newExpanded);
  };

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
      professionalExperience: [...experiences, newExperience],
    });
    setExpandedExperiences(new Set([...expandedExperiences, experiences.length]));
  };

  const handleRemoveExperience = (index: number) => {
    const updated = [...experiences];
    updated.splice(index, 1);
    onUpdate({
      ...data,
      professionalExperience: updated,
    });
    const newExpanded = new Set(expandedExperiences);
    newExpanded.delete(index);
    setExpandedExperiences(newExpanded);
  };

  const handleUpdateExperience = (
    index: number,
    field: keyof CVProfessionalExperience,
    value: string
  ) => {
    const updated = [...experiences];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    onUpdate({
      ...data,
      professionalExperience: updated,
    });
  };

  const moveExperience = (dragIndex: number, hoverIndex: number) => {
    const updated = [...experiences];
    const [dragged] = updated.splice(dragIndex, 1);
    updated.splice(hoverIndex, 0, dragged);
    onUpdate({
      ...data,
      professionalExperience: updated,
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = experiences.findIndex((_, i) => `exp-${i}` === active.id);
      const newIndex = experiences.findIndex((_, i) => `exp-${i}` === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const updated = arrayMove(experiences, oldIndex, newIndex);
        onUpdate({
          ...data,
          professionalExperience: updated,
        });
      }
    }
  };

  const getExperienceTitle = (exp: CVProfessionalExperience) => {
    if (exp.jobTitle && exp.company) {
      const dateRange =
        exp.startDate && exp.endDate
          ? `${exp.startDate} - ${exp.endDate}`
          : exp.startDate
          ? `${exp.startDate} - Present`
          : "";
      return `${exp.jobTitle} at ${exp.company}${dateRange ? ` (${dateRange})` : ""}`;
    }
    if (exp.jobTitle) {
      return exp.jobTitle;
    }
    if (exp.company) {
      return exp.company;
    }
    return "(Not specified)";
  };

  const handleAIClickForItem = async (index: number) => {
    const exp = experiences[index];
    if (!exp.jobTitle && !exp.company) {
      setAiError("Please fill in at least the job title or company name first");
      return;
    }

    setLoadingIndex(index);
    setAiError(null);

    try {
      const result = await generateExperienceDescription(ai.chat, exp, data);

      if (result.success && result.data) {
        handleUpdateExperience(index, "description", result.data);
      } else {
        setAiError(result.error || "Failed to generate description");
      }
    } catch (error) {
      setAiError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoadingIndex(null);
    }
  };

  const handleAIClick = async () => {
    // Generate descriptions for all experiences that have job title or company
    const validExperiences = experiences.filter(
      (exp, i) => (exp.jobTitle || exp.company) && !exp.description
    );

    if (validExperiences.length === 0) {
      setAiError("No experiences to generate. Add job title and company, or clear existing descriptions.");
      return;
    }

    setIsGeneratingAll(true);
    setAiError(null);

    try {
      for (let i = 0; i < experiences.length; i++) {
        const exp = experiences[i];
        if ((exp.jobTitle || exp.company) && !exp.description) {
          setLoadingIndex(i);
          const result = await generateExperienceDescription(ai.chat, exp, data);
          if (result.success && result.data) {
            handleUpdateExperience(i, "description", result.data);
          }
        }
      }
    } catch (error) {
      setAiError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsGeneratingAll(false);
      setLoadingIndex(null);
    }
  };

  return (
    <div className="space-y-4">
      <SectionHeader
        title="Experiences"
        description="Show your relevant experience (last 10 years). Use bullet points to note your achievements, if possible - use numbers/facts (Achieved X, measured by Y, by doing Z)."
      />

      {/* Experiences List */}
      <div className="space-y-3">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={experiences.map((_, index) => `exp-${index}`)}
            strategy={verticalListSortingStrategy}
          >
            {experiences.map((exp, index) => {
              const isExpanded = expandedExperiences.has(index);
              return (
                <SortableExperienceItem
                  key={index}
                  exp={exp}
                  index={index}
                  id={`exp-${index}`}
                  isExpanded={isExpanded}
                  onToggle={() => toggleExperience(index)}
                  onDelete={() => handleRemoveExperience(index)}
                  onUpdate={(field, value) =>
                    handleUpdateExperience(index, field, value)
                  }
                  getTitle={getExperienceTitle}
                  onAIClick={() => handleAIClickForItem(index)}
                  isAILoading={loadingIndex === index}
                />
              );
            })}
          </SortableContext>
        </DndContext>
      </div>

      {/* Add Button */}
      <button
        type="button"
        onClick={handleAddExperience}
        className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
      >
        <Plus className="w-4 h-4" />
        <span className="text-sm font-medium">Add one more employment</span>
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

      {/* Ask AI Writer Button */}
      <div className="flex justify-center pt-4">
        <button
          type="button"
          onClick={handleAIClick}
          disabled={isGeneratingAll || loadingIndex !== null}
          className="flex items-center gap-2 px-6 py-3 rounded-lg transition-colors disabled:opacity-70"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
          }}
        >
          {isGeneratingAll ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Sparkles className="w-5 h-5" />
          )}
          <span className="font-medium">
            {isGeneratingAll ? "Generating all..." : "Generate all descriptions"}
          </span>
        </button>
      </div>
    </div>
  );
}