import { forwardRef } from "react";
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
  // A4 dimensions in pixels at 72 DPI (standard for screen)
  const A4_WIDTH = 595;
  const A4_HEIGHT = 842;

  return (
    <div className="w-full h-full overflow-auto bg-gray-100">
      {/* Pages Container - Stacked vertically with spacing */}
      <div className="flex flex-col items-center gap-6 py-8">
        {/* Template Renderer - Content flows across multiple pages naturally */}
        <div 
          style={{
            width: `${A4_WIDTH}px`,
            minHeight: `${A4_HEIGHT}px`,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          }}
          className="bg-white"
        >
          <TemplateRenderer
            ref={ref}
            data={data}
            customization={customization}
          />
        </div>
      </div>
    </div>
  );
});

CVPreview.displayName = "CVPreview";

export default CVPreview;