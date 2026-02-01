import { ChevronDown, Download, Globe } from "lucide-react";
import { useState } from "react";

interface CVBuilderNavbarProps {
  activeMode: "edit" | "customize";
  onModeChange: (mode: "edit" | "customize") => void;
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
  onExport: () => void | Promise<void>;
  onExportDocx?: () => void | Promise<void>;
}

const languages = [
  { code: "en", label: "English", flag: "/icons/lang_uk.svg" },
  { code: "fr", label: "Français", flag: "/icons/lang_fr.svg" },
];

export default function CVBuilderNavbar({
  activeMode,
  onModeChange,
  selectedLanguage,
  onLanguageChange,
  onExport,
  onExportDocx,
}: CVBuilderNavbarProps) {
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [downloadDropdownOpen, setDownloadDropdownOpen] = useState(false);

  // Default to English if no language is selected
  const currentLang = languages.find((lang) => lang.code === selectedLanguage) || languages[0];

  const modes = [
    { id: "edit", label: "Edit" },
    { id: "customize", label: "Customize" },
  ];

  return (
    <nav className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Language Selector */}
        <div className="relative">
          <button
            onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
            className="flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl hover:from-gray-100 hover:to-gray-150 hover:border-gray-300 transition-all duration-200 shadow-sm"
          >
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-gray-500" />
              <img
                src={currentLang.flag}
                alt={currentLang.label}
                className="w-6 h-4 object-cover rounded-sm shadow-sm"
              />
            </div>
            <span className="text-sm font-medium text-gray-700">
              {currentLang.label}
            </span>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${languageDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {languageDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setLanguageDropdownOpen(false)}
              />
              <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-20 overflow-hidden">
                <div className="p-2">
                  <div className="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Select Language
                  </div>
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        onLanguageChange(lang.code);
                        setLanguageDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 text-sm rounded-lg flex items-center gap-3 transition-colors ${
                        currentLang.code === lang.code
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <img
                        src={lang.flag}
                        alt={lang.label}
                        className="w-6 h-4 object-cover rounded-sm shadow-sm"
                      />
                      <span>{lang.label}</span>
                      {currentLang.code === lang.code && (
                        <svg className="w-4 h-4 ml-auto text-primary" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
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
            onClick={() => onModeChange(mode.id as "edit" | "customize")}
            className={`px-4 py-2 text-sm font-medium transition-colors rounded-lg ${
              activeMode === mode.id
                ? "text-primary bg-primary/10"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            {mode.label}
          </button>
        ))}

        {/* Download Button with Dropdown */}
        <div className="relative ml-2">
          <button
            onClick={() => setDownloadDropdownOpen(!downloadDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 primary-gradient text-white rounded-lg hover:opacity-90 transition-opacity shadow-sm"
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
                    onExportDocx?.();
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

      </div>

      {/* Right Section - removed, content moved to center */}
      <div className="w-0" />
    </nav>
  );
}