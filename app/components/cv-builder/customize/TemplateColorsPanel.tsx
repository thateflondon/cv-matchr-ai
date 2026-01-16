import type { CVCustomization, CVTemplate } from "~/types/cv-builder";
import { Check, Search } from "lucide-react";
import { useState } from "react";
import { getTemplatesByCategory } from "~/constants/templates";

interface TemplateColorsPanelProps {
  customization: CVCustomization;
  onUpdate: (customization: CVCustomization) => void;
}

const colorPresets = [
  { name: "Blue", value: "#2563eb" },
  { name: "Purple", value: "#7c3aed" },
  { name: "Green", value: "#059669" },
  { name: "Red", value: "#dc2626" },
  { name: "Orange", value: "#ea580c" },
  { name: "Pink", value: "#db2777" },
  { name: "Teal", value: "#0d9488" },
  { name: "Indigo", value: "#4f46e5" },
  { name: "Gray", value: "#4b5563" },
  { name: "Black", value: "#000000" },
];

const categories = [
  { id: "all", label: "All" },
  { id: "ats", label: "ATS Friendly" },
  { id: "classic", label: "Classic" },
  { id: "modern", label: "Modern" },
  { id: "creative", label: "Creative" },
  { id: "two-column", label: "Two Column" },
  { id: "professional", label: "Professional" },
  { id: "specialist", label: "Specialist" },
];

export default function TemplateColorsPanel({
  customization,
  onUpdate,
}: TemplateColorsPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTemplates = getTemplatesByCategory(selectedCategory).filter(
    (template) =>
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Debug logging
  console.log("🔍 Debug Template Selection:");
  console.log("Selected category:", selectedCategory);
  console.log("Total templates:", getTemplatesByCategory(selectedCategory).length);
  console.log("Filtered templates:", filteredTemplates.length);
  console.log("Current template:", customization.template.id);

  const handleColorChange = (color: string) => {
    // Don't allow color change if template doesn't support it
    if (customization.template.supportsColorCustomization === false) {
      return;
    }
    
    onUpdate({
      ...customization,
      primaryColor: color,
    });
  };

  const handleTemplateChange = (template: CVTemplate) => {
    console.log("🎯 Template change requested:");
    console.log("  From:", customization.template.id);
    console.log("  To:", template.id);
    console.log("  onUpdate function:", typeof onUpdate);
    
    const newCustomization = {
      ...customization,
      template,
    };
    
    console.log("  New customization:", newCustomization);
    onUpdate(newCustomization);
  };

  return (
    <div className="space-y-8">
      {/* Primary Color */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-3">
          Primary Color
        </label>
        <p className="text-sm text-gray-600 mb-4">
          This color will be used for section titles and accents throughout
          your resume.
        </p>
        
        {customization.template.supportsColorCustomization === false && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              ⚠️ This template does not support color customization to maintain ATS compatibility.
            </p>
          </div>
        )}
        
        <div className="grid grid-cols-5 gap-3">
          {colorPresets.map((color) => (
            <button
              key={color.value}
              onClick={() => handleColorChange(color.value)}
              disabled={customization.template.supportsColorCustomization === false}
              className={`relative w-12 h-12 rounded-full border-2 transition-all flex items-center justify-center ${
                customization.primaryColor === color.value
                  ? "border-gray-900 scale-110 shadow-lg"
                  : "border-gray-300 hover:border-gray-500 hover:scale-105"
              } ${
                customization.template.supportsColorCustomization === false
                  ? "opacity-30 cursor-not-allowed"
                  : ""
              }`}
              style={{ backgroundColor: color.value }}
              title={customization.template.supportsColorCustomization === false ? "Color customization disabled for this template" : color.name}
            >
              {customization.primaryColor === color.value && (
                <Check className="w-5 h-5 text-white drop-shadow-lg" />
              )}
            </button>
          ))}
        </div>

        {/* Custom Color Input */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Or choose a custom color:
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={customization.primaryColor}
              onChange={(e) => handleColorChange(e.target.value)}
              className="h-10 w-20 rounded-lg border border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={customization.primaryColor}
              onChange={(e) => handleColorChange(e.target.value)}
              placeholder="#000000"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Template Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-3">
          Resume Template ({filteredTemplates.length} templates)
        </label>
        <p className="text-sm text-gray-600 mb-4">
          Choose a template that best fits your industry and personal style.
        </p>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-2 gap-4 max-h-[600px] overflow-y-auto">
          {filteredTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() => handleTemplateChange(template)}
              className={`p-4 border-2 rounded-lg text-left transition-all ${
                customization.template.id === template.id
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              {/* Template Preview */}
              <div
                className={`w-full h-32 rounded mb-3 overflow-hidden ${
                  customization.template.id === template.id
                    ? "ring-2 ring-blue-600"
                    : ""
                }`}
              >
                {template.thumbnail ? (
                  <img
                    src={template.thumbnail}
                    alt={`${template.name} preview`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400 text-xs">Preview</span>
                  </div>
                )}
              </div>

              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900 mb-1">
                    {template.name}
                  </h4>
                  {template.description && (
                    <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                      {template.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-1">
                    {template.hasPhoto && (
                      <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded">
                        Photo
                      </span>
                    )}
                    {template.columns === 2 && (
                      <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded">
                        2 Col
                      </span>
                    )}
                    <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded capitalize">
                      {template.category}
                    </span>
                  </div>
                </div>
                {customization.template.id === template.id && (
                  <Check className="w-5 h-5 text-blue-600 flex-shrink-0 ml-2" />
                )}
              </div>
            </button>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No templates found matching "{searchQuery}"
          </div>
        )}
      </div>

      {/* Template Info */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">
          About {customization.template.name}
        </h4>
        {customization.template.description && (
          <p className="text-sm text-blue-800 mb-3">
            {customization.template.description}
          </p>
        )}
        <ul className="text-sm text-blue-800 space-y-1">
          <li>
            • <strong>Columns:</strong> {customization.template.columns}{" "}
            column{customization.template.columns > 1 ? "s" : ""}
          </li>
          <li>
            • <strong>Photo Support:</strong>{" "}
            {customization.template.hasPhoto ? "Yes" : "No"}
          </li>
          <li>
            • <strong>Category:</strong>{" "}
            <span className="capitalize">{customization.template.category}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}