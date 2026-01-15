import { X } from "lucide-react";
import { useEffect } from "react";
import CustomizeMode from "./CustomizeMode";
import type { CVCustomization } from "types/cv-builder";

interface CustomizeSlidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  customization: CVCustomization;
  onUpdate: (customization: CVCustomization) => void;
}

export default function CustomizeSlidePanel({
  isOpen,
  onClose,
  customization,
  onUpdate,
}: CustomizeSlidePanelProps) {
  // Prevent body scroll when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Slide-up Panel */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-50 lg:hidden transition-transform duration-300 ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ height: "80vh", maxHeight: "800px" }}
      >
        {/* Handle Bar */}
        <div className="flex items-center justify-center py-2 border-b border-gray-200">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Customize Your Resume
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="overflow-auto" style={{ height: "calc(80vh - 120px)", maxHeight: "calc(800px - 120px)" }}>
          <div className="p-4">
            <CustomizeMode
              customization={customization}
              onUpdate={onUpdate}
            />
          </div>
        </div>
      </div>
    </>
  );
}