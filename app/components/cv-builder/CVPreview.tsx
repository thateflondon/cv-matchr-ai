import { forwardRef, useState, useEffect, useRef } from "react";
import type { CVData, CVCustomization } from "~/types/cv-builder";
import TemplateRenderer from "./templates/TemplateRenderer";

interface CVPreviewProps {
  data: CVData;
  customization: CVCustomization;
}

const CVPreview = forwardRef<HTMLDivElement, CVPreviewProps>(({
  data,
  customization,
}, ref) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  // A4 dimensions in pixels at 72 DPI (standard for screen)
  const A4_HEIGHT = 842;

  useEffect(() => {
    // Calculate total pages based on content height
    const calculatePages = () => {
      if (containerRef.current) {
        const contentHeight = containerRef.current.scrollHeight;
        const pages = Math.ceil(contentHeight / A4_HEIGHT);
        setTotalPages(pages);
        
        // Reset to page 1 if current page exceeds total
        if (currentPage > pages) {
          setCurrentPage(1);
        }
      }
    };

    // Initial calculation
    calculatePages();

    // Recalculate on data changes
    const timeoutId = setTimeout(calculatePages, 100);

    return () => clearTimeout(timeoutId);
  }, [data, customization, currentPage]);

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  // Calculate scroll position for current page
  const scrollToPage = () => {
    if (containerRef.current) {
      const scrollTop = (currentPage - 1) * A4_HEIGHT;
      containerRef.current.scrollTop = scrollTop;
    }
  };

  useEffect(() => {
    scrollToPage();
  }, [currentPage]);

  return (
    <div className="w-full h-full flex flex-col items-center">
      {/* Preview Container with scroll */}
      <div 
        ref={containerRef}
        className="w-full flex-1 overflow-auto flex items-start justify-center"
        style={{ 
          maxHeight: `${A4_HEIGHT}px`,
          scrollBehavior: 'smooth',
        }}
      >
        {/* Template Renderer - Handles all template rendering */}
        <TemplateRenderer
          ref={ref}
          data={data}
          customization={customization}
        />
      </div>

      {/* Pagination Controls - Only show if more than 1 page */}
      {totalPages > 1 && (
        <div className="flex items-center gap-3 py-4 px-6 bg-white border-t border-gray-200">
          {/* Previous Button */}
          <button
            aria-label="Previous page"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="p-2 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              version="1.1" 
              xmlns="http://www.w3.org/2000/svg"
              className="text-gray-700"
            >
              <path 
                fillRule="evenodd" 
                clipRule="evenodd" 
                d="M14.5684 16.743L13.2169 18.2173L7.32379 12.7371C6.89142 12.3408 6.89142 11.6591 7.32379 11.2628L13.2169 5.81372L14.5684 7.28803L9.4794 11.9999L14.5684 16.743Z" 
                fill="currentColor"
              />
            </svg>
          </button>

          {/* Page Indicator */}
          <div className="text-sm font-medium text-gray-700 min-w-[60px] text-center">
            {currentPage} / {totalPages}
          </div>

          {/* Next Button */}
          <button
            aria-label="Next page"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="p-2 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              version="1.1" 
              xmlns="http://www.w3.org/2000/svg"
              className="text-gray-700"
            >
              <path 
                fillRule="evenodd" 
                clipRule="evenodd" 
                d="M9.42969 7.25556L10.7811 5.78125L16.6743 11.2614C17.1066 11.6578 17.1066 12.3394 16.6743 12.7358L10.7811 18.1848L9.42969 16.7105L14.5186 11.9986L9.42969 7.25556Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
});

CVPreview.displayName = "CVPreview";

export default CVPreview;