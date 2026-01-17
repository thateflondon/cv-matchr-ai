import { Save, Download, Loader2 } from "lucide-react";

interface BottomActionBarProps {
  onSave: () => void | Promise<void>;
  onExport: () => void | Promise<void>;
  isSaving?: boolean;
  hasUnsavedChanges?: boolean;
}

export default function BottomActionBar({
  onSave,
  onExport,
  isSaving = false,
  hasUnsavedChanges = false,
}: BottomActionBarProps) {
  return (
    <div className="border-t border-gray-200 bg-white px-8 py-4 flex items-center justify-between">
      {/* Status Indicator */}
      <div className="flex items-center gap-2">
        {isSaving && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Saving...</span>
          </div>
        )}
        {!isSaving && hasUnsavedChanges && (
          <div className="flex items-center gap-2 text-sm text-amber-600">
            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
            <span>Unsaved changes</span>
          </div>
        )}
        {!isSaving && !hasUnsavedChanges && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>All changes saved</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        {/* Save Button */}
        <button
          onClick={onSave}
          disabled={isSaving || !hasUnsavedChanges}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span className="text-sm font-medium">
            {isSaving ? "Saving..." : "Save"}
          </span>
        </button>

        {/* Export PDF Button */}
        <button
          onClick={onExport}
          className="flex items-center justify-center gap-2 px-6 py-2.5 primary-gradient text-white rounded-lg hover:opacity-90 transition-opacity shadow-sm"
        >
          <Download className="w-4 h-4" />
          <span className="text-sm font-medium">Export PDF</span>
        </button>
      </div>
    </div>
  );
}