import TextPanel from "./customize/TextPanel";
import LayoutPanel from "./customize/LayoutPanel";
import type { CVCustomization } from "~/types/cv-builder";

interface CustomizeModeProps {
  customization: CVCustomization;
  onUpdate: (customization: CVCustomization) => void;
}

const panels = [
  { id: "template", label: "Template & Colors", icon: Palette },
  { id: "text", label: "Text", icon: Type },
  { id: "layout", label: "Layout", icon: Layout },
];

export default function CustomizeMode({
  customization,
  onUpdate,
}: CustomizeModeProps) {
  const [activePanel, setActivePanel] = useState<"template" | "text" | "layout">(
    "template"
  );

  return (
    <div className="h-full flex flex-col">
      {/* Panel Selector */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Customize Your Resume
        </h2>
        <div className="flex flex-wrap gap-2">
          {panels.map((panel) => {
            const Icon = panel.icon;
            const isActive = activePanel === panel.id;

            return (
              <button
                key={panel.id}
                onClick={() => setActivePanel(panel.id as any)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border transition-colors flex-1 sm:flex-initial justify-center sm:justify-start min-w-0 ${
                  isActive
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:border-blue-500"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="font-medium text-sm truncate">{panel.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Panel Content */}
      <div className="flex-1 overflow-auto">
        {activePanel === "template" && (
          <TemplateColorsPanel
            customization={customization}
            onUpdate={onUpdate}
          />
        )}
        {activePanel === "text" && (
          <TextPanel customization={customization} onUpdate={onUpdate} />
        )}
        {activePanel === "layout" && (
          <LayoutPanel customization={customization} onUpdate={onUpdate} />
        )}
      </div>
    </div>
  );
}