import type { CVData, Language } from "~/types/cv-builder";
import { Plus } from "lucide-react";
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

interface LanguagesSectionProps {
  data: CVData;
  onUpdate: (data: CVData) => void;
  aiSuggestions?: any;
}

const proficiencyLevels = [
  { value: "", label: "Select level" },
  { value: "native", label: "Native or Bilingual" },
  { value: "fluent", label: "Fluent" },
  { value: "advanced", label: "Advanced" },
  { value: "intermediate", label: "Intermediate" },
  { value: "basic", label: "Basic" },
];

interface SortableLanguageItemProps {
  lang: Language;
  isExpanded: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onUpdate: (field: keyof Language, value: string) => void;
  getTitle: (lang: Language) => string;
}

function SortableLanguageItem({
  lang,
  isExpanded,
  onToggle,
  onDelete,
  onUpdate,
  getTitle,
}: SortableLanguageItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lang.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <CollapsibleSection
        title={getTitle(lang)}
        isExpanded={isExpanded}
        onToggle={onToggle}
        onDelete={onDelete}
        isDraggable={true}
        dragHandleProps={{ ...attributes, ...listeners }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            id={`lang-name-${lang.id}`}
            label="Language"
            value={lang.language}
            onChange={(value) => onUpdate("language", value)}
            placeholder="e.g., Spanish, French, Mandarin"
            maxLength={50}
          />

          <div>
            <label
              htmlFor={`lang-level-${lang.id}`}
              className="block text-sm font-medium text-foreground mb-2"
            >
              Level
            </label>
            <select
              id={`lang-level-${lang.id}`}
              value={lang.level}
              onChange={(e) => onUpdate("level", e.target.value)}
              className="w-full px-3 py-2.5 border border-border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-input-background"
            >
              {proficiencyLevels.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );
}

export default function LanguagesSection({
  data,
  onUpdate,
  aiSuggestions,
}: LanguagesSectionProps) {
  const [expandedLanguages, setExpandedLanguages] = useState<Set<string>>(
    new Set()
  );

  const languages = data.languages || [];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const toggleLanguage = (id: string) => {
    const newExpanded = new Set(expandedLanguages);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedLanguages(newExpanded);
  };

  const handleAddLanguage = () => {
    const newLanguage: Language = {
      id: Date.now().toString(),
      language: "",
      level: "",
    };
    onUpdate({
      ...data,
      languages: [...languages, newLanguage],
    });
    setExpandedLanguages(new Set([...expandedLanguages, newLanguage.id]));
  };

  const handleRemoveLanguage = (id: string) => {
    const updated = languages.filter((lang) => lang.id !== id);
    onUpdate({
      ...data,
      languages: updated,
    });
    const newExpanded = new Set(expandedLanguages);
    newExpanded.delete(id);
    setExpandedLanguages(newExpanded);
  };

  const handleUpdateLanguage = (
    id: string,
    field: keyof Language,
    value: string
  ) => {
    const updated = languages.map((lang) =>
      lang.id === id ? { ...lang, [field]: value } : lang
    );
    onUpdate({
      ...data,
      languages: updated,
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = languages.findIndex((lang) => lang.id === active.id);
      const newIndex = languages.findIndex((lang) => lang.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const updated = arrayMove(languages, oldIndex, newIndex);
        onUpdate({
          ...data,
          languages: updated,
        });
      }
    }
  };

  const getLanguageTitle = (lang: Language) => {
    if (lang.language && lang.level) {
      return `${lang.language} (${proficiencyLevels.find(l => l.value === lang.level)?.label || lang.level})`;
    }
    if (lang.language) {
      return lang.language;
    }
    return "(Not specified)";
  };

  return (
    <div className="space-y-4">
      <SectionHeader
        title="Langues"
        description="List the languages you speak and your proficiency level in each."
      />

      {/* Languages List */}
      <div className="space-y-3">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={languages.map((lang) => lang.id)}
            strategy={verticalListSortingStrategy}
          >
            {languages.map((lang) => {
              const isExpanded = expandedLanguages.has(lang.id);
              return (
                <SortableLanguageItem
                  key={lang.id}
                  lang={lang}
                  isExpanded={isExpanded}
                  onToggle={() => toggleLanguage(lang.id)}
                  onDelete={() => handleRemoveLanguage(lang.id)}
                  onUpdate={(field, value) =>
                    handleUpdateLanguage(lang.id, field, value)
                  }
                  getTitle={getLanguageTitle}
                />
              );
            })}
          </SortableContext>
        </DndContext>
      </div>

      {/* Add Button */}
      <button
        type="button"
        onClick={handleAddLanguage}
        className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
      >
        <Plus className="w-4 h-4" />
        <span className="text-sm font-medium">+ Add one more language</span>
      </button>
    </div>
  );
}
