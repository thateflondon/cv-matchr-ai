import { useState, useRef, useEffect } from "react";
import EditMode from "../cv-builder/EditMode";
import CustomizeMode from "../cv-builder/CustomizeMode";
import CVPreview from "../cv-builder/CVPreview";
import CVBuilderNavbar from "../cv-builder/CVBuilderNavbar";
import BottomActionBar from "../cv-builder/BottomActionBar";
import MigrationBanner from "../cv-builder/MigrationBanner";
import ErrorBoundary from "~/components/common/ErrorBoundary";
import type { CVData, CVCustomization } from "~/types/cv-builder";
import { defaultCVData, defaultCustomization } from "~/types/cv-builder";
import {
  saveCVData,
  loadCVData,
  saveCVCustomization,
  loadCVCustomization,
} from "~/utils/cvStorage";
import {
  extractCVDataFromResume,
  convertFeedbackToSuggestions,
} from "~/utils/cvDataExtractor";
import { exportCVToPDF } from "~/utils/pdfExport";
import { exportCVToDocx } from "~/utils/docxExport";
import { toast } from "sonner";
import {
  saveResumeToPuter,
  updateResumeInPuter,
  generateResumeId,
} from "~/utils/puterCVStorage";
import { migrateResumeData } from "~/utils/migrateResume";
import { usePuterStore } from "~/lib/puter";

interface BuilderTabProps {
  resume: Resume | null;
  onSave: (updatedResume: Resume) => void;
  onBack: () => void;
}

export default function BuilderTab({
  resume,
  onSave,
  onBack,
}: BuilderTabProps) {
  const [activeMode, setActiveMode] = useState<"edit" | "customize">("edit");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Resume Data State
  const [cvData, setCvData] = useState<CVData>(defaultCVData);
  const [customization, setCustomization] = useState<CVCustomization>(defaultCustomization);
  const [aiSuggestions, setAiSuggestions] = useState<any>(undefined);
  const [customizePanelOpen, setCustomizePanelOpen] = useState(false);
  const [currentResumeId, setCurrentResumeId] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSavedData, setLastSavedData] = useState<string>("");
  const [showMigrationBanner, setShowMigrationBanner] = useState(false);
  
  const { fs, ai, kv } = usePuterStore();
  const previewRef = useRef<HTMLDivElement>(null);

  // Load resume data when resume is selected
  useEffect(() => {
    // Try to load from localStorage first
    const storedData = loadCVData(resume?.id || null);
    const storedCustomization = loadCVCustomization(resume?.id || null);

    if (resume) {
      // Check if stored data is meaningful (has personal details or experience)
      const hasStoredContent = storedData && (
        storedData.personalDetails?.firstName ||
        storedData.professionalExperience?.length > 0 ||
        storedData.education?.length > 0
      );

      // Priority 1: Use stored data if it has meaningful content (user has edited)
      if (hasStoredContent) {
        setCvData(storedData);
      }
      // Priority 2: Use parsed data from AI if available (most complete)
      else if (resume.parsedData) {
        setCvData(resume.parsedData);
      }
      // Priority 3: Extract what we can from resume object (fallback)
      else {
        const extractedData = extractCVDataFromResume(resume);
        setCvData(extractedData);
      }
      
      if (storedCustomization) {
        setCustomization(storedCustomization);
      }

      const suggestions = convertFeedbackToSuggestions(resume.feedback);
      setAiSuggestions(suggestions);
      setCurrentResumeId(resume.id);
      
      // Show migration banner if resume doesn't have parsedData
      setShowMigrationBanner(!resume.parsedData && !storedData);
    } else {
      // Creating new CV
      if (storedData) {
        setCvData(storedData);
      } else {
        setCvData(defaultCVData);
      }
      
      if (storedCustomization) {
        setCustomization(storedCustomization);
      } else {
        setCustomization(defaultCustomization);
      }
      
      setAiSuggestions(undefined);
      setShowMigrationBanner(false);
    }

    // Set initial saved data
    const initialData = JSON.stringify({
      cvData: storedData || (resume?.parsedData) || (resume ? extractCVDataFromResume(resume) : defaultCVData),
      customization: storedCustomization || defaultCustomization,
    });
    setLastSavedData(initialData);
    setHasUnsavedChanges(false);
  }, [resume]);

  // Detect unsaved changes
  useEffect(() => {
    const currentData = JSON.stringify({ cvData, customization });
    setHasUnsavedChanges(currentData !== lastSavedData);
  }, [cvData, customization, lastSavedData]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Auto-save to localStorage when data changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Only save if we have meaningful content
      const hasContent =
        cvData.personalDetails?.firstName ||
        cvData.professionalExperience?.length > 0 ||
        cvData.education?.length > 0 ||
        cvData.professionalSummary;

      if (hasContent) {
        saveCVData(resume?.id || null, cvData);
      }
    }, 500); // Debounce 500ms

    return () => clearTimeout(timeoutId);
  }, [cvData, resume?.id]);

  // Auto-save customization to localStorage when it changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveCVCustomization(resume?.id || null, customization);
    }, 500); // Debounce 500ms

    return () => clearTimeout(timeoutId);
  }, [customization, resume?.id]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (currentResumeId || resume) {
        const id = currentResumeId || resume!.id;
        await updateResumeInPuter(id, cvData, customization);
        toast.success("Resume updated successfully!");
        
        // Update last saved data
        const savedData = JSON.stringify({ cvData, customization });
        setLastSavedData(savedData);
        setHasUnsavedChanges(false);
      } else {
        const newId = generateResumeId();
        await saveResumeToPuter(newId, cvData, customization);
        toast.success("Resume saved successfully!");
        setCurrentResumeId(newId);
        
        // Update last saved data
        const savedData = JSON.stringify({ cvData, customization });
        setLastSavedData(savedData);
        setHasUnsavedChanges(false);
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save resume. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = async () => {
    if (previewRef.current) {
      try {
        const fileName = `${cvData.personalDetails?.firstName || 'Resume'}_${cvData.personalDetails?.lastName || ''}_CV.pdf`.trim();
        await exportCVToPDF(previewRef.current, fileName);
        toast.success("PDF exported successfully!");
      } catch (error) {
        console.error("Failed to export PDF:", error);
        toast.error("Failed to export PDF. Please try again.");
      }
    }
  };

  const handleExportDocx = async () => {
    try {
      const fileName = `${cvData.personalDetails?.firstName || 'Resume'}_${cvData.personalDetails?.lastName || ''}_CV.docx`.trim();
      await exportCVToDocx(cvData, fileName);
      toast.success("DOCX exported successfully!");
    } catch (error) {
      console.error("Failed to export DOCX:", error);
      toast.error("Failed to export DOCX. Please try again.");
    }
  };

  const handleMigrate = async () => {
    if (!resume) return;
    
    try {
      toast.info("Extracting data from PDF...");
      
      // Migrate the resume data
      const migratedResume = await migrateResumeData(resume, fs, ai);
      
      if (migratedResume.parsedData) {
        // Update the CV data with migrated data
        setCvData(migratedResume.parsedData);
        
        // Update in Puter KV store
        await kv.set(`resume:${resume.id}`, JSON.stringify(migratedResume));
        
        // Hide the migration banner
        setShowMigrationBanner(false);
        
        // Notify the parent component
        onSave(migratedResume);
        
        toast.success("PDF data extracted successfully! Your resume is now fully populated.");
      } else {
        toast.error("Failed to extract data from PDF. Please try again.");
      }
    } catch (error) {
      console.error("Migration failed:", error);
      toast.error("Failed to extract data. Please try again.");
    }
  };

  // Mobile view toggle between editor and preview
  const [mobileView, setMobileView] = useState<"editor" | "preview">("editor");

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Migration Banner */}
      {showMigrationBanner && (
        <MigrationBanner onMigrate={handleMigrate} />
      )}

      {/* CV Builder Navbar */}
      <CVBuilderNavbar
        activeMode={activeMode}
        onModeChange={setActiveMode}
        selectedLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
        onExport={handleExport}
        onExportDocx={handleExportDocx}
      />

      {/* Mobile View Toggle - Only visible on mobile/tablet */}
      <div className="lg:hidden flex border-b border-gray-200">
        <button
          onClick={() => setMobileView("editor")}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            mobileView === "editor"
              ? "text-primary border-b-2 border-primary bg-primary/5"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          {activeMode === "edit" ? "Edit" : "Customize"}
        </button>
        <button
          onClick={() => setMobileView("preview")}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            mobileView === "preview"
              ? "text-primary border-b-2 border-primary bg-primary/5"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Preview
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {activeMode === "edit" ? (
          <>
            {/* Edit Mode - Left Panel */}
            <div className={`lg:w-1/2 w-full border-r border-gray-200 overflow-y-auto ${
              mobileView === "editor" ? "block" : "hidden lg:block"
            }`}>
              <ErrorBoundary>
                <EditMode
                  cvData={cvData}
                  onChange={setCvData}
                  aiSuggestions={aiSuggestions}
                  customization={customization}
                />
              </ErrorBoundary>
            </div>

            {/* Preview - Right Panel */}
            <div className={`lg:w-1/2 w-full bg-gray-50 overflow-y-auto flex justify-center ${
              mobileView === "preview" ? "block" : "hidden lg:block"
            }`}>
              <CVPreview
                ref={previewRef}
                data={cvData}
                customization={customization}
              />
            </div>
          </>
        ) : (
          <>
            {/* Customize Mode - Left Panel */}
            <div className={`lg:w-1/2 w-full border-r border-gray-200 overflow-y-auto ${
              mobileView === "editor" ? "block" : "hidden lg:block"
            }`}>
              <ErrorBoundary>
                <CustomizeMode
                  customization={customization}
                  onChange={setCustomization}
                />
              </ErrorBoundary>
            </div>

            {/* Preview - Right Panel */}
            <div className={`lg:w-1/2 w-full bg-gray-50 overflow-y-auto flex justify-center ${
              mobileView === "preview" ? "block" : "hidden lg:block"
            }`}>
              <CVPreview
                ref={previewRef}
                data={cvData}
                customization={customization}
              />
            </div>
          </>
        )}
      </div>

      {/* Bottom Action Bar */}
      <BottomActionBar
        onSave={handleSave}
        onExport={handleExport}
        isSaving={isSaving}
        hasUnsavedChanges={hasUnsavedChanges}
      />
    </div>
  );
}