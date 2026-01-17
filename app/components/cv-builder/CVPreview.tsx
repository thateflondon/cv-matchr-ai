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
  return (
    <div className="w-full h-full flex items-start justify-center">
      {/* Template Renderer - Handles all template rendering */}
      <TemplateRenderer
        ref={ref}
        data={data}
        customization={customization}
      />
    </div>
  );
});

CVPreview.displayName = "CVPreview";

export default CVPreview;