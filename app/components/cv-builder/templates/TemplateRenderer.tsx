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

    // Add console log to track template rendering
    console.log("🎨 Rendering template:", templateId, customization.template.name);

    switch (templateId) {
      // ATS Templates - using specific implementations
      case "template-helsinki":
        return <HelsinkiTemplate ref={ref} data={data} customization={customization} />;

      // All other templates use BaseTemplate which adapts to the template config
      default:
        return <BaseTemplate ref={ref} data={data} customization={customization} />;
    }
  }
);

TemplateRenderer.displayName = "TemplateRenderer";

export default TemplateRenderer;