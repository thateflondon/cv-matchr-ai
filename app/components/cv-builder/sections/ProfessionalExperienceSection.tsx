import type { CVData, CVProfessionalExperience } from "types/cv-builder";
import { Plus, Trash2, GripVertical, Lightbulb } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ProfessionalExperienceSectionProps {
  data: CVData;
  onUpdate: (data: CVData) => void;
  aiSuggestions?: any;
}

interface SortableExperienceItemProps {
  id: string;
  index: number;
  exp: CVProfessionalExperience;
  onUpdate: (index: number, field: keyof CVProfessionalExperience, value: string) => void;
  onRemove: (index: number) => void;
  aiSuggestion?: any;
}

function SortableExperienceItem({
  id,
  index,
  exp,
  onUpdate,
  onRemove,
  aiSuggestion,
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
    <div
      ref={setNodeRef}
      style={style}
      className="p-6 bg-gray-50 border border-gray-200 rounded-lg relative"
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute left-2 top-6 cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="w-5 h-5 text-gray-400 hover:text-gray-600" />
      </div>

      {/* Delete Button */}
      <button
        onClick={() => onRemove(index)}
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
              onChange={(e) => onUpdate(index, "jobTitle", e.target.value)}
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
              onChange={(e) => onUpdate(index, "company", e.target.value)}
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
            onChange={(e) => onUpdate(index, "location", e.target.value)}
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
              onChange={(e) => onUpdate(index, "startDate", e.target.value)}
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
              onChange={(e) => onUpdate(index, "endDate", e.target.value)}
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
            onChange={(e) => onUpdate(index, "description", e.target.value)}
            placeholder="Describe your responsibilities and achievements. Use action verbs and quantify results when possible."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        {/* AI Suggestion for this experience */}
        {aiSuggestion && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-blue-900">
                  <strong>AI Suggestion:</strong> {aiSuggestion.text}
                </p>
                <button
                  onClick={() => onUpdate(index, "description", aiSuggestion.text)}
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
  );
}

export default function ProfessionalExperienceSection({
  data,
  onUpdate,
  aiSuggestions,
}: ProfessionalExperienceSectionProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const experiences = data.professionalExperience || [];
      const oldIndex = experiences.findIndex((_, i) => `exp-${i}` === active.id);
      const newIndex = experiences.findIndex((_, i) => `exp-${i}` === over.id);

      const reordered = arrayMove(experiences, oldIndex, newIndex);
      onUpdate({
        ...data,
        professionalExperience: reordered,
      });
    }
  };

  const experiences = data.professionalExperience || [];
  const experienceIds = experiences.map((_, index) => `exp-${index}`);

  return (
    <div className="space-y-6">
      {/* Experiences List */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={experienceIds} strategy={verticalListSortingStrategy}>
          {experiences.map((exp, index) => (
            <SortableExperienceItem
              key={`exp-${index}`}
              id={`exp-${index}`}
              index={index}
              exp={exp}
              onUpdate={handleUpdateExperience}
              onRemove={handleRemoveExperience}
              aiSuggestion={aiSuggestions?.experience?.[index]}
            />
          ))}
        </SortableContext>
      </DndContext>

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