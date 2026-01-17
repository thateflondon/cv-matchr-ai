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
  { name: "Green", value: "#059669" },
  { name: "Purple", value: "#7c3aed" },
  { name: "Orange", value: "#ea580c" },
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
        
        {/* Color Picker - Centered with 5 presets + 1 custom */}
        <div className="flex items-center justify-center gap-3">
          {/* Preset Colors */}
          {colorPresets.map((color) => (
            <button
              key={color.value}
              onClick={() => handleColorChange(color.value)}
              disabled={customization.template.supportsColorCustomization === false}
              className={`relative w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${
                customization.primaryColor === color.value
                  ? "border-gray-900"
                  : "border-gray-300 hover:border-gray-500"
              } ${
                customization.template.supportsColorCustomization === false
                  ? "opacity-30 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
              style={{ backgroundColor: color.value }}
              title={customization.template.supportsColorCustomization === false ? "Color customization disabled for this template" : color.name}
            >
              {customization.primaryColor === color.value && (
                <Check className="w-4 h-4 text-white drop-shadow-lg" />
              )}
            </button>
          ))}
          
          {/* Custom Color Picker */}
          <div className="relative">
            <input
              type="color"
              value={customization.primaryColor}
              onChange={(e) => handleColorChange(e.target.value)}
              disabled={customization.template.supportsColorCustomization === false}
              className="absolute inset-0 w-8 h-8 opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />
            <div
              className={`w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center transition-all ${
                customization.template.supportsColorCustomization === false
                  ? "opacity-30 cursor-not-allowed"
                  : "hover:border-gray-500 cursor-pointer"
              }`}
              style={{
                background: `conic-gradient(from 0deg, red, yellow, lime, aqua, blue, magenta, red)`
              }}
            >
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
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
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === category.id
                  ? "primary-gradient text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2">
          {filteredTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() => handleTemplateChange(template)}
              className={`group relative flex flex-col border-2 rounded-xl overflow-hidden transition-all hover:shadow-md ${
                customization.template.id === template.id
                  ? "border-primary bg-white ring-2 ring-primary/20"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              {/* Template Name at Top */}
              <div className="px-3 py-2 border-b border-gray-100 bg-gray-50/50">
                <h4 className="text-sm font-medium text-gray-900 text-left truncate">
                  {template.name}
                </h4>
              </div>

              {/* Template Preview with Overlay Badges */}
              <div className="relative w-full h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                {template.thumbnail ? (
                  <img
                    src={template.thumbnail}
                    alt={`${template.name} preview`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 text-xs">Preview</span>
                  </div>
                )}

                {/* Badges Overlay - Top Left */}
                <div className="absolute top-2 left-2 flex flex-col gap-1.5">
                  {/* Format badges */}
                  <div className="flex flex-wrap gap-1">
                    <span className="text-[10px] font-semibold px-2 py-0.5 bg-amber-500 text-white rounded shadow-sm">
                      pdf
                    </span>
                    {template.category !== "specialist" && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 bg-amber-500 text-white rounded shadow-sm">
                        docx
                      </span>
                    )}
                  </div>

                  {/* Additional badges */}
                  <div className="flex flex-wrap gap-1">
                    {template.hasPhoto && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 bg-purple-500 text-white rounded shadow-sm">
                        Photo
                      </span>
                    )}
                    {template.columns === 2 && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 bg-emerald-500 text-white rounded shadow-sm">
                        2 Col
                      </span>
                    )}
                  </div>
                </div>

                {/* Check Icon - Top Right (when selected) */}
                {customization.template.id === template.id && (
                  <div className="absolute top-2 right-2 w-7 h-7 primary-gradient rounded-full flex items-center justify-center shadow-lg">
                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                  </div>
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
      <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-primary/20 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-2">
          About {customization.template.name}
        </h4>
        {customization.template.description && (
          <p className="text-sm text-gray-700 mb-3">
            {customization.template.description}
          </p>
        )}
        <ul className="text-sm text-gray-700 space-y-1">
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