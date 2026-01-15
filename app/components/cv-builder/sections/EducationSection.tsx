import type { CVData, CVEducation } from "types/cv-builder";
import { Plus, Trash2, GripVertical } from "lucide-react";
import FormInput from "~/components/common/FormInput";
import {
  validateRequired,
  validateGPA,
  validateLength,
  sanitizeInput,
} from "~/utils/formValidation";
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

interface EducationSectionProps {
  data: CVData;
  onUpdate: (data: CVData) => void;
  aiSuggestions?: any;
}

interface SortableEducationItemProps {
  id: string;
  index: number;
  edu: CVEducation;
  onUpdate: (index: number, field: keyof CVEducation, value: string | boolean) => void;
  onRemove: (index: number) => void;
}

function SortableEducationItem({
  id,
  index,
  edu,
  onUpdate,
  onRemove,
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
            onChange={(e) => onUpdate(index, "degree", e.target.value)}
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
              onChange={(e) => onUpdate(index, "institution", e.target.value)}
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
              onChange={(e) => onUpdate(index, "location", e.target.value)}
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
              onChange={(value) => onUpdate(index, "graduationDate", value)}
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
                  onUpdate(index, "isCurrentlyStudying", e.target.checked)
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
            onChange={(value) => onUpdate(index, "gpa", value)}
            placeholder="3.8"
            optional
            validate={validateGPA}
            description="Out of 4.0"
            maxLength={5}
          />
        </div>
      </div>
    </div>
  );
}

export default function EducationSection({
  data,
  onUpdate,
  aiSuggestions,
}: EducationSectionProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const educationList = data.education || [];
      const oldIndex = educationList.findIndex(
        (_, i) => `edu-${i}` === active.id
      );
      const newIndex = educationList.findIndex((_, i) => `edu-${i}` === over.id);

      const reordered = arrayMove(educationList, oldIndex, newIndex);
      onUpdate({
        ...data,
        education: reordered,
      });
    }
  };

  const education = data.education || [];
  const educationIds = education.map((_, index) => `edu-${index}`);

  return (
    <div className="space-y-6">
      {/* Education List */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={educationIds} strategy={verticalListSortingStrategy}>
          {education.map((edu, index) => (
            <SortableEducationItem
              key={`edu-${index}`}
              id={`edu-${index}`}
              index={index}
              edu={edu}
              onUpdate={handleUpdateEducation}
              onRemove={handleRemoveEducation}
            />
          ))}
        </SortableContext>
      </DndContext>

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