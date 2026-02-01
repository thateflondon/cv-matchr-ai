import { forwardRef, useRef, useState, useEffect, useCallback } from "react";
import type { CVData, CVCustomization } from "~/types/cv-builder";
import TemplateRenderer from "./templates/TemplateRenderer";
import ErrorBoundary from "~/components/common/ErrorBoundary";
import { FileWarning, ZoomIn, ZoomOut } from "lucide-react";

interface CVPreviewProps {
  data: CVData;
  customization: CVCustomization;
}

const TemplateErrorFallback = () => (
  <div className="flex flex-col items-center justify-center p-12 h-full min-h-[400px]">
    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
      <FileWarning className="w-8 h-8 text-amber-600" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">
      Template Error
    </h3>
    <p className="text-gray-600 text-sm text-center max-w-md">
      Unable to render the CV preview. Try selecting a different template or check your data.
    </p>
  </div>
);

const CVPreview = forwardRef<HTMLDivElement, CVPreviewProps>(({
  data,
  customization,
}, ref) => {
  // A4 dimensions scaled for better preview quality (at ~96 DPI)
  // Original A4 at 72 DPI: 595x842, scaled to ~96 DPI: 952x1346
  const A4_WIDTH = 952;
  const A4_HEIGHT = 1346;

  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [pageCount, setPageCount] = useState(1);
  const [scale, setScale] = useState(1);
  const [autoScale, setAutoScale] = useState(1);

  // Calculate auto-scale based on container width
  const calculateAutoScale = useCallback(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const padding = 48; // 24px on each side
      const availableWidth = containerWidth - padding;

      // On desktop (>= 1024px), use 1:1 or scale down if needed
      // On tablet (768-1023px), scale to fit
      // On mobile (< 768px), scale to fit with more padding
      if (availableWidth >= A4_WIDTH) {
        return 1;
      } else {
        return Math.max(0.4, availableWidth / A4_WIDTH);
      }
    }
    return 1;
  }, [A4_WIDTH]);

  // Handle window resize for responsive scaling
  useEffect(() => {
    const handleResize = () => {
      const newAutoScale = calculateAutoScale();
      setAutoScale(newAutoScale);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [calculateAutoScale]);

  // Detect content height and calculate page count
  useEffect(() => {
    const checkHeight = () => {
      if (contentRef.current) {
        const contentHeight = contentRef.current.scrollHeight;
        const pages = Math.max(1, Math.ceil(contentHeight / A4_HEIGHT));
        setPageCount(pages);
      }
    };

    checkHeight();

    const observer = new ResizeObserver(checkHeight);
    if (contentRef.current) {
      observer.observe(contentRef.current);
    }

    return () => observer.disconnect();
  }, [data, customization, A4_HEIGHT]);

  // Combined scale (auto + manual zoom)
  const effectiveScale = autoScale * scale;

  // Zoom controls - adjust relative to autoScale so 100% means actual size
  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.5));
  const handleResetZoom = () => setScale(1 / autoScale); // Reset to 100% actual size

  return (
    <div ref={containerRef} className="w-full h-full overflow-auto bg-gray-100 relative">
      {/* Zoom Controls - Fixed position */}
      <div className="sticky top-4 right-4 z-20 flex justify-end px-4 mb-2">
        <div className="bg-white rounded-lg shadow-md flex items-center gap-1 p-1">
          <button
            onClick={handleZoomOut}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={handleResetZoom}
            className="px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded transition-colors min-w-[48px]"
          >
            {Math.round(effectiveScale * 100)}%
          </button>
          <button
            onClick={handleZoomIn}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Pages Container - Stacked vertically with spacing */}
      <div className="flex flex-col items-center pb-8" style={{ gap: '20px' }}>
        {/* Page count indicator */}
        {pageCount > 1 && (
          <div className="text-sm text-gray-500 mb-2">
            {pageCount} page{pageCount > 1 ? 's' : ''} detected
          </div>
        )}

        {/* Scaled Container */}
        <div
          style={{
            transform: `scale(${effectiveScale})`,
            transformOrigin: 'top center',
            transition: 'transform 0.2s ease-out',
          }}
        >
          {/* Template Content with Page Boundaries */}
          <div
            ref={contentRef}
            style={{
              width: `${A4_WIDTH}px`,
              minHeight: `${A4_HEIGHT}px`,
              // Visual page boundaries using repeating gradient
              backgroundImage: pageCount > 1
                ? `repeating-linear-gradient(
                    to bottom,
                    transparent 0px,
                    transparent ${A4_HEIGHT - 2}px,
                    #e5e7eb ${A4_HEIGHT - 2}px,
                    #e5e7eb ${A4_HEIGHT}px,
                    transparent ${A4_HEIGHT}px,
                    transparent ${A4_HEIGHT + 20}px
                  )`
                : 'none',
              backgroundSize: `100% ${A4_HEIGHT + 20}px`,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            }}
            className="bg-white relative"
          >
            {/* Page break overlay indicators */}
            {pageCount > 1 && Array.from({ length: pageCount - 1 }).map((_, index) => (
              <div
                key={index}
                className="absolute left-0 right-0 pointer-events-none"
                style={{
                  top: `${(index + 1) * A4_HEIGHT}px`,
                  height: '20px',
                  marginTop: '-10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10,
                }}
              >
                <div
                  className="bg-gray-200 text-gray-500 text-xs px-3 py-1 rounded-full"
                  style={{ fontSize: '10px' }}
                >
                  Page {index + 2}
                </div>
              </div>
            ))}

            <ErrorBoundary fallback={<TemplateErrorFallback />}>
              <TemplateRenderer
                ref={ref}
                data={data}
                customization={customization}
              />
            </ErrorBoundary>
          </div>
        </div>

        {/* Spacer for scaled content height adjustment */}
        {effectiveScale < 1 && (
          <div
            style={{
              height: `${(1 - effectiveScale) * (pageCount * A4_HEIGHT + (pageCount - 1) * 20)}px`,
              marginTop: `-${(1 - effectiveScale) * (pageCount * A4_HEIGHT + (pageCount - 1) * 20)}px`,
            }}
          />
        )}
      </div>

      {/* Page break CSS for print/export */}
      <style>{`
        @media print {
          .cv-section {
            break-inside: avoid;
            page-break-inside: avoid;
          }
          .cv-page-break {
            break-after: page;
            page-break-after: always;
          }
        }

        /* Ensure sections don't break awkwardly */
        [data-cv-preview="true"] > div {
          break-inside: avoid;
        }

        /* Responsive adjustments */
        @media (max-width: 1024px) {
          .cv-preview-container {
            padding: 12px;
          }
        }

        @media (max-width: 768px) {
          .cv-preview-container {
            padding: 8px;
          }
        }
      `}</style>
    </div>
  );
});

CVPreview.displayName = "CVPreview";

export default CVPreview;
