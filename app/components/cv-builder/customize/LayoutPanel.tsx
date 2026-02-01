import type { CVCustomization, CVMargins } from "~/types/cv-builder";
import { AlignLeft, AlignCenter, AlignRight, Minus, Plus } from "lucide-react";

interface LayoutPanelProps {
  customization: CVCustomization;
  onUpdate: (customization: CVCustomization) => void;
}

type MarginField = keyof CVMargins;

interface MarginConfig {
  label: string;
  field: MarginField;
  min: number;
  max: number;
  step: number;
  unit: string;
}

const marginConfigs: MarginConfig[] = [
  { label: "Header & Footer", field: "headerFooter", min: 0, max: 2, step: 0.1, unit: "in" },
  { label: "Top & bottom", field: "topBottom", min: 0, max: 2, step: 0.1, unit: "in" },
  { label: "Left & right", field: "leftRight", min: 0, max: 2, step: 0.1, unit: "in" },
  { label: "Between sections", field: "betweenSections", min: 0, max: 48, step: 1, unit: "pt" },
  { label: "Between Titles & Content", field: "betweenTitleContent", min: 0, max: 24, step: 1, unit: "pt" },
  { label: "Between Content blocks", field: "betweenContentBlocks", min: 0, max: 24, step: 1, unit: "pt" },
];

export default function LayoutPanel({
  customization,
  onUpdate,
}: LayoutPanelProps) {
  const layoutCustomizationDisabled = customization.template.supportsLayoutCustomization === false;

  const formats = [
    { value: "a4", label: 'A4 (8.27" x 11.69")' },
    { value: "letter", label: 'Letter (8.5" x 11")' },
    { value: "legal", label: 'Legal (8.5" x 14")' },
  ];

  const dateFormats = [
    { value: "short", label: "01/2020" },
    { value: "long", label: "January 2020" },
    { value: "numeric", label: "01.2020" },
    { value: "year", label: "2020" },
  ];

  const handleMarginChange = (field: MarginField, value: number) => {
    onUpdate({
      ...customization,
      margins: {
        ...customization.margins,
        [field]: value,
      },
    });
  };

  const handleSkillsLayoutChange = (layout: "comma" | "columns" | "categories") => {
    onUpdate({
      ...customization,
      skillsLayout: layout,
    });
  };

  const handleSkillsColumnsChange = (delta: number) => {
    const newValue = Math.max(1, Math.min(6, customization.skillsColumns + delta));
    onUpdate({
      ...customization,
      skillsColumns: newValue,
    });
  };

  const handleEducationLayoutChange = (layout: "stacked" | "inline") => {
    onUpdate({
      ...customization,
      educationLayout: layout,
    });
  };

  const handleEducationOrderChange = (order: "institution" | "degree") => {
    onUpdate({
      ...customization,
      educationOrder: order,
    });
  };

  return (
    <div className="space-y-6">
      {/* Warning Banner */}
      {layoutCustomizationDisabled && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            ⚠️ This template does not support layout customization to maintain its structure.
          </p>
        </div>
      )}

      {/* Format */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Format
        </label>
        <select
          value="a4"
          disabled={layoutCustomizationDisabled}
          className="w-full px-3 py-2.5 border border-border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-input-background disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {formats.map((format) => (
            <option key={format.value} value={format.value}>
              {format.label}
            </option>
          ))}
        </select>
      </div>

      {/* Margins & Paddings */}
      <div>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          MARGINS & PADDINGS
        </h3>
        <div className="space-y-4">
          {marginConfigs.map((config) => {
            const value = customization.margins?.[config.field] ?? 0;
            return (
              <div key={config.field}>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-foreground">
                    {config.label}
                  </label>
                  <span className="text-sm text-muted-foreground">
                    {value.toFixed(config.unit === "in" ? 1 : 0)} {config.unit}
                  </span>
                </div>
                <input
                  type="range"
                  min={config.min}
                  max={config.max}
                  step={config.step}
                  value={value}
                  disabled={layoutCustomizationDisabled}
                  onChange={(e) =>
                    handleMarginChange(config.field, parseFloat(e.target.value))
                  }
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Date Format */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Date format
        </label>
        <select
          value={customization.dateFormat}
          disabled={layoutCustomizationDisabled}
          onChange={(e) =>
            onUpdate({
              ...customization,
              dateFormat: e.target.value as CVCustomization["dateFormat"],
            })
          }
          className="w-full px-3 py-2.5 border border-border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-input-background disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {dateFormats.map((format) => (
            <option key={format.value} value={format.value}>
              {format.label}
            </option>
          ))}
        </select>
      </div>

      {/* Header Alignment */}
      <div>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          HEADER ALIGNMENT
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: "left", icon: AlignLeft, label: "Left" },
            { value: "center", icon: AlignCenter, label: "Center" },
            { value: "right", icon: AlignRight, label: "Right" },
          ].map((option) => {
            const Icon = option.icon;
            const isActive = customization.headerAlignment === option.value;
            return (
              <button
                key={option.value}
                disabled={layoutCustomizationDisabled}
                onClick={() =>
                  onUpdate({
                    ...customization,
                    headerAlignment: option.value as CVCustomization["headerAlignment"],
                  })
                }
                className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  isActive
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border bg-card hover:bg-muted"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Date Alignment */}
      <div>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          DATE ALIGNMENT
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: "left", label: "Left", preview: "• 01.2020 - Present" },
            { value: "right", label: "Right", preview: "01.2020 - Present" },
          ].map((option) => {
            const isActive = customization.dateAlignment === option.value;
            return (
              <button
                key={option.value}
                disabled={layoutCustomizationDisabled}
                onClick={() =>
                  onUpdate({
                    ...customization,
                    dateAlignment: option.value as CVCustomization["dateAlignment"],
                  })
                }
                className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  isActive
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border bg-card hover:bg-muted"
                }`}
              >
                <span className="text-xs font-medium">{option.label}</span>
                <span className="text-xs text-muted-foreground">
                  {option.preview}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Skills Layout */}
      <div>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          SKILLS LAYOUT
        </h3>
        <div className="space-y-3">
          {/* Comma */}
          <div
            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
              customization.skillsLayout === "comma"
                ? "border-primary bg-primary/5"
                : "border-border hover:bg-muted"
            } ${layoutCustomizationDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => !layoutCustomizationDisabled && handleSkillsLayoutChange("comma")}
          >
            <div className="flex items-center gap-2 mb-2">
              <input
                type="radio"
                id="skills-comma"
                name="skills-layout"
                checked={customization.skillsLayout === "comma"}
                onChange={() => handleSkillsLayoutChange("comma")}
                disabled={layoutCustomizationDisabled}
                className="w-4 h-4 text-primary"
              />
              <label htmlFor="skills-comma" className="text-sm font-medium cursor-pointer">
                Comma
              </label>
            </div>
            <p className="text-xs text-muted-foreground">
              Skill 1, Skill 2, Skill 3
            </p>
          </div>

          {/* Columns */}
          <div
            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
              customization.skillsLayout === "columns"
                ? "border-primary bg-primary/5"
                : "border-border hover:bg-muted"
            } ${layoutCustomizationDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => !layoutCustomizationDisabled && handleSkillsLayoutChange("columns")}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="skills-columns"
                  name="skills-layout"
                  checked={customization.skillsLayout === "columns"}
                  onChange={() => handleSkillsLayoutChange("columns")}
                  disabled={layoutCustomizationDisabled}
                  className="w-4 h-4 text-primary"
                />
                <label htmlFor="skills-columns" className="text-sm font-medium cursor-pointer">
                  Columns
                </label>
              </div>
              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <button
                  className="p-1 hover:bg-muted rounded disabled:opacity-50"
                  onClick={() => handleSkillsColumnsChange(-1)}
                  disabled={layoutCustomizationDisabled || customization.skillsColumns <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-sm font-medium w-8 text-center">
                  {customization.skillsColumns}
                </span>
                <button
                  className="p-1 hover:bg-muted rounded disabled:opacity-50"
                  onClick={() => handleSkillsColumnsChange(1)}
                  disabled={layoutCustomizationDisabled || customization.skillsColumns >= 6}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div
              className="grid gap-2 text-xs text-muted-foreground"
              style={{ gridTemplateColumns: `repeat(${Math.min(customization.skillsColumns, 4)}, 1fr)` }}
            >
              {Array.from({ length: Math.min(customization.skillsColumns, 4) }).map((_, i) => (
                <div key={i}>Skill {i + 1}</div>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div
            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
              customization.skillsLayout === "categories"
                ? "border-primary bg-primary/5"
                : "border-border hover:bg-muted"
            } ${layoutCustomizationDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => !layoutCustomizationDisabled && handleSkillsLayoutChange("categories")}
          >
            <div className="flex items-center gap-2 mb-2">
              <input
                type="radio"
                id="skills-categories"
                name="skills-layout"
                checked={customization.skillsLayout === "categories"}
                onChange={() => handleSkillsLayoutChange("categories")}
                disabled={layoutCustomizationDisabled}
                className="w-4 h-4 text-primary"
              />
              <label
                htmlFor="skills-categories"
                className="text-sm font-medium cursor-pointer"
              >
                Categories
              </label>
            </div>
            <p className="text-xs text-muted-foreground">
              Category 1, Category 2, Category 3
            </p>
          </div>
        </div>
      </div>

      {/* Show Education By */}
      <div>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          SHOW EDUCATION BY
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Institution name", value: "institution" as const, year: "2020" },
            { label: "Degree", value: "degree" as const, year: "2020" },
          ].map((option) => {
            const isActive = customization.educationOrder === option.value;
            return (
              <button
                key={option.value}
                disabled={layoutCustomizationDisabled}
                onClick={() => handleEducationOrderChange(option.value)}
                className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  isActive
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border bg-card hover:bg-muted"
                }`}
              >
                <span className="text-xs font-medium">{option.label}</span>
                <span className="text-xs text-muted-foreground">
                  {option.year}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Education Layout */}
      <div>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          EDUCATION LAYOUT
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: "stacked" as const, label: "Stacked" },
            { value: "inline" as const, label: "Inline" },
          ].map((layout) => {
            const isActive = customization.educationLayout === layout.value;
            return (
              <button
                key={layout.value}
                disabled={layoutCustomizationDisabled}
                onClick={() => handleEducationLayoutChange(layout.value)}
                className={`p-3 rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  isActive
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border bg-card hover:bg-muted"
                }`}
              >
                <span className="text-sm font-medium">{layout.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
