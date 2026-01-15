import type { CVData } from "types/cv-builder";
import { Plus, Trash2, GripVertical } from "lucide-react";
import FormInput from "~/components/common/FormInput";
import { validateRequired, validateLength } from "~/utils/formValidation";
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

interface LanguagesSectionProps {
  data: CVData;
  onUpdate: (data: CVData) => void;
  aiSuggestions?: any;
}

interface Language {
  name: string;
  proficiency: string;
}

const proficiencyLevels = [
  { value: "native", label: "Native or Bilingual" },
  { value: "fluent", label: "Fluent" },
  { value: "advanced", label: "Advanced" },
  { value: "intermediate", label: "Intermediate" },
  { value: "basic", label: "Basic" },
];

interface SortableLanguageItemProps {
  id: string;
  index: number;
  language: Language;
  onUpdate: (index: number, field: keyof Language, value: string) => void;
  onRemove: (index: number) => void;
}

function SortableLanguageItem({
  id,
  index,
  language,
  onUpdate,
  onRemove,
}: SortableLanguageItemProps) {
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
      className="p-4 bg-gray-50 border border-gray-200 rounded-lg relative"
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute left-2 top-4 cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="w-5 h-5 text-gray-400 hover:text-gray-600" />
      </div>

      {/* Delete Button */}
      <button
        onClick={() => onRemove(index)}
        className="absolute right-3 top-3 p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        aria-label="Remove language"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      <div className="ml-6 grid grid-cols-1 sm:grid-cols-2 gap-4 pr-8">
        <FormInput
          id={`language-name-${index}`}
          label="Language"
          value={language.name}
          onChange={(value) => onUpdate(index, "name", value)}
          placeholder="e.g., Spanish, French, Mandarin"
          required
          validate={(value) => {
            const requiredCheck = validateRequired(value, "Language");
            if (!requiredCheck.isValid) return requiredCheck;
            return validateLength(value, 1, 50, "Language");
          }}
          maxLength={50}
        />

        <div>
          <label
            htmlFor={`language-proficiency-${index}`}
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Proficiency Level <span className="text-red-500">*</span>
          </label>
          <select
            id={`language-proficiency-${index}`}
            value={language.proficiency}
            onChange={(e) => onUpdate(index, "proficiency", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            {proficiencyLevels.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default function LanguagesSection({
  data,
  onUpdate,
  aiSuggestions,
}: LanguagesSectionProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Store languages in accomplishments temporarily for backward compatibility
  const languages: Language[] = (data.accomplishments || [])
    .map((item) => {
      try {
        return JSON.parse(item) as Language;
      } catch {
        return null;
      }
    })
    .filter((item): item is Language => item !== null);

  const handleAddLanguage = () => {
    const newLanguages = [
      ...languages,
      { name: "", proficiency: "intermediate" },
    ];
    updateLanguages(newLanguages);
  };

  const handleRemoveLanguage = (index: number) => {
    const newLanguages = languages.filter((_, i) => i !== index);
    updateLanguages(newLanguages);
  };

  const handleUpdateLanguage = (
    index: number,
    field: keyof Language,
    value: string
  ) => {
    const newLanguages = [...languages];
    newLanguages[index] = {
      ...newLanguages[index],
      [field]: value,
    };
    updateLanguages(newLanguages);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = languages.findIndex((_, i) => `lang-${i}` === active.id);
      const newIndex = languages.findIndex((_, i) => `lang-${i}` === over.id);

      const reordered = arrayMove(languages, oldIndex, newIndex);
      updateLanguages(reordered);
    }
  };

  const updateLanguages = (newLanguages: Language[]) => {
    onUpdate({
      ...data,
      accomplishments: newLanguages.map((lang) => JSON.stringify(lang)),
    });
  };

  const languageIds = languages.map((_, index) => `lang-${index}`);

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-600">
        List the languages you speak and your proficiency level in each.
      </p>

      {/* Languages List */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={languageIds} strategy={verticalListSortingStrategy}>
          {languages.map((language, index) => (
            <SortableLanguageItem
              key={`lang-${index}`}
              id={`lang-${index}`}
              index={index}
              language={language}
              onUpdate={handleUpdateLanguage}
              onRemove={handleRemoveLanguage}
            />
          ))}
        </SortableContext>
      </DndContext>

      {/* Add Language Button */}
      <button
        onClick={handleAddLanguage}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" />
        <span className="font-medium">Add Language</span>
      </button>

      {/* Tips */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Tips:</h4>
        <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
          <li>Only include languages you can actively use</li>
          <li>Be honest about your proficiency level</li>
          <li>Native/Bilingual: Spoke from childhood</li>
          <li>Fluent: Can speak, read, and write with ease</li>
          <li>Advanced: Professional working proficiency</li>
          <li>Intermediate: Can handle basic conversations</li>
          <li>Basic: Elementary knowledge</li>
        </ul>
      </div>
    </div>
  );
}