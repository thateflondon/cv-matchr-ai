import { forwardRef } from "react";
import type { CVData, CVCustomization, TemplateID } from "~/types/cv-builder";
import HelsinkiTemplate from "./HelsinkiTemplate";
import BaseTemplate from "./BaseTemplate";

export interface TemplateRendererProps {
  data: CVData;
  customization: CVCustomization;
}

/**
 * Template Renderer component that dynamically renders the correct template
 * based on the selected template ID from customization.
 */
const TemplateRenderer = forwardRef<HTMLDivElement, TemplateRendererProps>(
  ({ data, customization }, ref) => {
    const templateId = customization.template.id;

    switch (templateId) {
      // ATS Templates
      case "template-helsinki":
        return <HelsinkiTemplate ref={ref} data={data} customization={customization} />;

      // Default case
      default:
        return <BaseTemplate ref={ref} data={data} customization={customization} />;
    }
  }
);

TemplateRenderer.displayName = "TemplateRenderer";

export default TemplateRenderer;