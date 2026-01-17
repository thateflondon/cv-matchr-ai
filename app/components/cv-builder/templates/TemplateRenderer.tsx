import { forwardRef } from "react";
import type { CVData, CVCustomization, TemplateID } from "~/types/cv-builder";
import HelsinkiTemplate from "./HelsinkiTemplate";
import SeoulTemplate from "./SeoulTemplate";
import TokyoTemplate from "./TokyoTemplate";
import LondonTemplate from "./LondonTemplate";
import PragueTemplate from "./PragueTemplate";
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
      // ATS Templates - specific implementations
      case "template-helsinki":
        return <HelsinkiTemplate ref={ref} data={data} customization={customization} />;
      
      case "template-seoul":
        return <SeoulTemplate ref={ref} data={data} customization={customization} />;
      
      case "template-prague":
        return <PragueTemplate ref={ref} data={data} customization={customization} />;

      // Modern Templates - specific implementations
      case "template-tokyo":
        return <TokyoTemplate ref={ref} data={data} customization={customization} />;

      // Classic Templates - specific implementations
      case "template-london":
        return <LondonTemplate ref={ref} data={data} customization={customization} />;

      // All other templates use BaseTemplate which adapts to the template config
      default:
        return <BaseTemplate ref={ref} data={data} customization={customization} />;
    }
  }
);

TemplateRenderer.displayName = "TemplateRenderer";

export default TemplateRenderer;