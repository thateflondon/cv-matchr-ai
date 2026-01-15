import { forwardRef } from "react";
import type { CVData, CVCustomization } from "types/cv-builder";
import TemplateRenderer from "./templates/TemplateRenderer";

interface CVPreviewProps {
  data: CVData;
  customization: CVCustomization;
}

const CVPreview = forwardRef<HTMLDivElement, CVPreviewProps>(({
  data,
  customization,
}, ref) => {
  return (
    <div className="h-full bg-gray-100 p-4 md:p-8 overflow-auto">
      <div className="max-w-[595px] mx-auto">
        {/* Template Renderer - Handles all template rendering */}
        <TemplateRenderer
          ref={ref}
          data={data}
          customization={customization}
        />
      </div>
    </div>
  );
});

CVPreview.displayName = "CVPreview";

export default CVPreview;