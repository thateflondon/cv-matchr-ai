import type { CVCustomization } from "types/cv-builder";
import { AlignLeft, AlignCenter, AlignRight, Plus, Minus } from "lucide-react";

interface LayoutPanelProps {
  customization: CVCustomization;
  onUpdate: (customization: CVCustomization) => void;
}

export default function LayoutPanel({
  customization,
  onUpdate,
}: LayoutPanelProps) {
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

  const educationLayouts = [
    { value: "institution-degree", label: "Institution name + Degree" },
    { value: "degree-institution", label: "Degree + Institution name" },
  ];

  const handleMarginChange = (field: string, value: number) => {
    // In a real implementation, this would update margin values
    console.log(`Update ${field} to ${value}`);
  };

  return (
    <div className="space-y-6">
      {/* Format */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Format
        </label>
        <select
          value="a4"
          className="w-full px-3 py-2.5 border border-border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-input-background"
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
          {[
            { label: "Header & Footer", value: 0.5 },
            { label: "Top & bottom", value: 1.0 },
            { label: "Left & right", value: 1.0 },
            { label: "Between sections", value: 24 },
            { label: "Between Titles & Content", value: 24 },
            { label: "Between Content blocks", value: 12 },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-foreground">
                  {item.label}
                </label>
                <span className="text-sm text-muted-foreground">
                  {item.value}
                  {item.value < 10 ? " in" : " pt"}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={item.value < 10 ? 2 : 48}
                step={item.value < 10 ? 0.1 : 1}
                value={item.value}
                onChange={(e) =>
                  handleMarginChange(item.label, parseFloat(e.target.value))
                }
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Date Format */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Date format
        </label>
        <select
          value={customization.dateFormat}
          onChange={(e) =>
            onUpdate({
              ...customization,
              dateFormat: e.target.value as any,
            })
          }
          className="w-full px-3 py-2.5 border border-border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-input-background"
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
                onClick={() =>
                  onUpdate({
                    ...customization,
                    headerAlignment: option.value as any,
                  })
                }
                className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-colors ${
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
                onClick={() =>
                  onUpdate({
                    ...customization,
                    dateAlignment: option.value as any,
                  })
                }
                className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-colors ${
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
          <div className="p-3 border border-border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <input
                type="radio"
                id="skills-comma"
                name="skills-layout"
                className="w-4 h-4 text-primary"
              />
              <label htmlFor="skills-comma" className="text-sm font-medium">
                Comma
              </label>
            </div>
            <p className="text-xs text-muted-foreground">
              Skill 1, Skill 2, Skill 3
            </p>
          </div>

          {/* Columns */}
          <div className="p-3 border border-border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="skills-columns"
                  name="skills-layout"
                  defaultChecked
                  className="w-4 h-4 text-primary"
                />
                <label htmlFor="skills-columns" className="text-sm font-medium">
                  Columns
                </label>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-1 hover:bg-muted rounded">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-sm font-medium w-8 text-center">4</span>
                <button className="p-1 hover:bg-muted rounded">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 text-xs text-muted-foreground">
              <div>Skill 1</div>
              <div>Skill 2</div>
              <div>Skill 3</div>
              <div>Skill 4</div>
            </div>
          </div>

          {/* Categories */}
          <div className="p-3 border border-border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <input
                type="radio"
                id="skills-categories"
                name="skills-layout"
                className="w-4 h-4 text-primary"
              />
              <label
                htmlFor="skills-categories"
                className="text-sm font-medium"
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
            { label: "Institution name", value: "institution", year: "2020" },
            { label: "Degree", value: "degree", year: "2020" },
          ].map((option) => (
            <button
              key={option.value}
              className="flex flex-col items-center gap-2 p-3 rounded-lg border border-border bg-card hover:bg-muted transition-colors"
            >
              <span className="text-xs font-medium">{option.label}</span>
              <span className="text-xs text-muted-foreground">
                {option.year}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Education Layout */}
      <div>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          EDUCATION LAYOUT
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {["Stacked", "Inline"].map((layout) => {
            const isActive = layout === "Stacked";
            return (
              <button
                key={layout}
                className={`p-3 rounded-lg border transition-colors ${
                  isActive
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border bg-card hover:bg-muted"
                }`}
              >
                <span className="text-sm font-medium">{layout}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
