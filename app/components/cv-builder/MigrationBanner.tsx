import { AlertCircle, RefreshCw } from "lucide-react";
import { useState } from "react";

interface MigrationBannerProps {
  onMigrate: () => Promise<void>;
}

export default function MigrationBanner({ onMigrate }: MigrationBannerProps) {
  const [isMigrating, setIsMigrating] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  const handleMigrate = async () => {
    setIsMigrating(true);
    try {
      await onMigrate();
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-primary/20 rounded-lg p-4 mb-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">
            🆕 Enhanced PDF Data Extraction Available
          </h3>
          <p className="text-xs text-gray-600 mb-3">
            This resume was uploaded before our new AI-powered PDF extraction feature. 
            Click "Extract Data" to automatically fill in all your information (name, 
            experience, education, skills, etc.) from the PDF.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleMigrate}
              disabled={isMigrating}
              className="flex items-center gap-2 px-4 py-2 primary-gradient text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium shadow-sm"
            >
              {isMigrating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Extracting...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Extract Data from PDF
                </>
              )}
            </button>
            <button
              onClick={() => setIsDismissed(true)}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors text-xs font-medium"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}