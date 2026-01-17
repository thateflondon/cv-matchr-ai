import { Menu, ChevronDown, Save, Download, Loader2, Settings, Sparkles } from "lucide-react";
import { useState } from "react";

interface CVBuilderNavbarProps {
  onToggleSidebar: () => void;
  activeMode: "edit" | "customize" | "ai-review" | "tailor";
  onModeChange: (mode: "edit" | "customize" | "ai-review" | "tailor") => void;
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
  onSave: () => void | Promise<void>;
  onExport: () => void | Promise<void>;
  resumeName?: string;
  isSaving?: boolean;
  hasUnsavedChanges?: boolean;
}

const languages = [
  { code: "en", label: "English", flag: "/icons/lang_uk.svg" },
  { code: "fr", label: "Français", flag: "/icons/lang_fr.svg" },
  { code: "es", label: "Español", flag: "/icons/lang_es.svg" },
  { code: "de", label: "Deutsch", flag: "/icons/lang_de.svg" },
];

export default function CVBuilderNavbar({
  onToggleSidebar,
  activeMode,
  onModeChange,
  selectedLanguage,
  onLanguageChange,
  onSave,
  onExport,
  resumeName = "Untitled Resume",
  isSaving = false,
  hasUnsavedChanges = false,
}: CVBuilderNavbarProps) {
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [downloadDropdownOpen, setDownloadDropdownOpen] = useState(false);

  const modes = [
    { id: "edit", label: "Edit" },
    { id: "customize", label: "Customize" },
    { id: "ai-review", label: "AI Review" },
    { id: "tailor", label: "Tailor", badge: "NEW" },
  ];

  return (
    <nav className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>

        {/* Language Selector */}
        <div className="relative">
          <button
            onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
            className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <img
              src={languages.find((lang) => lang.code === selectedLanguage)?.flag}
              alt={languages.find((lang) => lang.code === selectedLanguage)?.label}
              className="w-5 h-5"
            />
            <span className="text-sm font-medium text-gray-700">
              {languages.find((lang) => lang.code === selectedLanguage)?.label}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>

          {languageDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setLanguageDropdownOpen(false)}
              />
              <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      onLanguageChange(lang.code);
                      setLanguageDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg flex items-center gap-2 ${
                      selectedLanguage === lang.code
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-700"
                    }`}
                  >
                    <img
                      src={lang.flag}
                      alt={lang.label}
                      className="w-5 h-5"
                    />
                    {lang.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Center Section - Mode Tabs */}
      <div className="flex items-center gap-1">
        {modes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => onModeChange(mode.id as any)}
            className={`relative px-4 py-2 text-sm font-medium transition-colors ${
              activeMode === mode.id
                ? "text-primary border-b-2 border-primary"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {mode.label}
            {mode.badge && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                {mode.badge}
              </span>
            )}
          </button>
        ))}

        {/* Download Button with Dropdown */}
        <div className="relative ml-2">
          <button
            onClick={() => setDownloadDropdownOpen(!downloadDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm font-medium">Download</span>
            <ChevronDown className="w-4 h-4" />
          </button>

          {downloadDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setDownloadDropdownOpen(false)}
              />
              <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                <button
                  onClick={() => {
                    onExport();
                    setDownloadDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 rounded-t-lg"
                >
                  Download PDF
                </button>
                <button
                  onClick={() => {
                    // TODO: Implement DOCX export
                    setDownloadDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 rounded-b-lg"
                >
                  Download DOCX
                </button>
              </div>
            </>
          )}
        </div>

        {/* Settings Button */}
        <button
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors ml-1"
          aria-label="Settings"
        >
          <Settings className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Right Section - removed, content moved to center */}
      <div className="w-0" />
    </nav>
  );
}