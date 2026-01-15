import { forwardRef } from "react";
import type { CVData, CVCustomization } from "types/cv-builder";

export interface BaseTemplateProps {
  data: CVData;
  customization: CVCustomization;
}

/**
 * Base template component that all CV templates extend from.
 * Provides common styling and structure.
 */
const BaseTemplate = forwardRef<HTMLDivElement, BaseTemplateProps>(
  ({ data, customization }, ref) => {
    const { primaryColor, fonts, spacing, fontSize, fontWeight } = customization;

    // A4 dimensions in pixels (at 72 DPI)
    const a4Width = 595;
    const a4Height = 842;

    return (
      <div
        ref={ref}
        data-cv-preview="true"
        className="bg-white"
        style={{
          width: `${a4Width}px`,
          minHeight: `${a4Height}px`,
          fontFamily: fonts.primary,
          lineHeight: `${spacing.lineHeight}%`,
          fontSize: `${fontSize.body}px`,
          fontWeight: fontWeight.body,
          color: "#000000",
        }}
      >
        {/* Template content goes here */}
        <div className="p-8">
          <p className="text-gray-500">Base template - extend this for specific templates</p>
        </div>
      </div>
    );
  }
);

BaseTemplate.displayName = "BaseTemplate";

export default BaseTemplate;