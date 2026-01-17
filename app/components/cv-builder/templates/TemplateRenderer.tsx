import { forwardRef } from "react";
import type { CVData, CVCustomization, TemplateID } from "~/types/cv-builder";
import HelsinkiTemplate from "./HelsinkiTemplate";
import SeoulTemplate from "./SeoulTemplate";
import AcademicTemplate from "./AcademicTemplate";
import EntryLevelTemplate from "./EntryLevelTemplate";
import SpecialistTemplate from "./SpecialistTemplate";
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

      // Specialist Templates
      case "template-academic":
        return <AcademicTemplate ref={ref} data={data} customization={customization} />;
      
      case "template-entry_level":
        return <EntryLevelTemplate ref={ref} data={data} customization={customization} />;
      
      case "template-specialist_traditional1":
        return <SpecialistTemplate ref={ref} data={data} customization={customization} />;

      // All other templates use BaseTemplate which adapts to the template config
      default:
        return <BaseTemplate ref={ref} data={data} customization={customization} />;
    }
  }
);

TemplateRenderer.displayName = "TemplateRenderer";

export default TemplateRenderer;