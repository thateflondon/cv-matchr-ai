import type { CVData, CVAdditionalSection } from "types/cv-builder";
import { Plus, X, Edit2 } from "lucide-react";
import { useState } from "react";

interface AdditionalSectionsManagerProps {
  data: CVData;
  onUpdate: (data: CVData) => void;
  aiSuggestions?: any;
}

const sectionTemplates = [
  { id: "languages", label: "Languages" },
  { id: "certifications", label: "Certifications" },
  { id: "volunteer", label: "Volunteer Work" },
  { id: "interests", label: "Interests & Hobbies" },
  { id: "references", label: "References" },
  { id: "publications", label: "Publications" },
  { id: "projects", label: "Projects" },
  { id: "custom", label: "Custom Section" },
];

export default function AdditionalSectionsManager({
  data,
  onUpdate,
  aiSuggestions,
}: AdditionalSectionsManagerProps) {
  const [showTemplates, setShowTemplates] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const handleAddSection = (template: { id: string; label: string }) => {
    const newSection: CVAdditionalSection = {
      id: `${template.id}-${Date.now()}`,
      title: template.label,
      content: "",
    };
    onUpdate({
      ...data,
      additionalSections: [...(data.additionalSections || []), newSection],
    });
    setShowTemplates(false);
  };

  const handleRemoveSection = (id: string) => {
    const updated = (data.additionalSections || []).filter(
      (section) => section.id !== id
    );
    onUpdate({
      ...data,
      additionalSections: updated,
    });
  };

  const handleUpdateContent = (id: string, content: string) => {
    const updated = (data.additionalSections || []).map((section) =>
      section.id === id ? { ...section, content } : section
    );
    onUpdate({
      ...data,
      additionalSections: updated,
    });
  };

  const handleStartEditTitle = (section: CVAdditionalSection) => {
    setEditingId(section.id);
    setEditingTitle(section.title);
  };

  const handleSaveTitle = (id: string) => {
    if (editingTitle.trim()) {
      const updated = (data.additionalSections || []).map((section) =>
        section.id === id
          ? { ...section, title: editingTitle.trim() }
          : section
      );
      onUpdate({
        ...data,
        additionalSections: updated,
      });
    }
    setEditingId(null);
    setEditingTitle("");
  };

  const sections = data.additionalSections || [];

  return (
    <div className="space-y-6">
      {/* Add Section Button */}
      {!showTemplates && (
        <button
          onClick={() => setShowTemplates(true)}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">Add Additional Section</span>
        </button>
      )}

      {/* Section Templates */}
      {showTemplates && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900">
              Choose a section type:
            </h3>
            <button
              onClick={() => setShowTemplates(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {sectionTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleAddSection(template)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:border-blue-500 hover:text-blue-700 transition-colors text-left"
              >
                {template.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Existing Sections */}
      {sections.map((section) => (
        <div
          key={section.id}
          className="p-4 bg-gray-50 border border-gray-200 rounded-lg"
        >
          {/* Section Header */}
          <div className="flex items-center justify-between mb-3">
            {editingId === section.id ? (
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  className="flex-1 px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                  onBlur={() => handleSaveTitle(section.id)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSaveTitle(section.id);
                    }
                  }}
                />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium text-gray-900">
                  {section.title}
                </h3>
                <button
                  onClick={() => handleStartEditTitle(section)}
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="Edit section title"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
              </div>
            )}
            <button
              onClick={() => handleRemoveSection(section.id)}
              className="text-red-600 hover:text-red-800"
              aria-label="Remove section"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Section Content */}
          <textarea
            value={section.content as string}
            onChange={(e) => handleUpdateContent(section.id, e.target.value)}
            placeholder={`Enter content for ${section.title}...`}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>
      ))}

      {/* Info */}
      {sections.length === 0 && !showTemplates && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Why add additional sections?
          </h4>
          <p className="text-sm text-gray-600 mb-3">
            Additional sections help you stand out by showcasing unique aspects
            of your background that don't fit into standard categories.
          </p>
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Popular options:
          </h4>
          <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
            <li>Languages - especially important for international roles</li>
            <li>Certifications - validate your expertise</li>
            <li>Volunteer Work - demonstrate your values and commitment</li>
            <li>Publications - show thought leadership</li>
            <li>Projects - highlight side projects or portfolio work</li>
          </ul>
        </div>
      )}
    </div>
  );
}