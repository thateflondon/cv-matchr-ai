import { forwardRef } from "react";
import type { CVData, CVCustomization, TemplateID } from "types/cv-builder";
import BaseTemplate from "./BaseTemplate";

// Import all templates
import HelsinkiTemplate from "./HelsinkiTemplate";
import TokyoTemplate from "./TokyoTemplate";
import PragueTemplate from "./PragueTemplate";
import LondonTemplate from "./LondonTemplate";
import SeoulTemplate from "./SeoulTemplate";

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

      case "template-seoul":
        return <SeoulTemplate ref={ref} data={data} customization={customization} />;

      case "template-prague":
        return <PragueTemplate ref={ref} data={data} customization={customization} />;

      // Classic Templates
      case "template-london":
        return <LondonTemplate ref={ref} data={data} customization={customization} />;

      // Modern Templates
      case "template-tokyo":
        return <TokyoTemplate ref={ref} data={data} customization={customization} />;

      case "template-santiago":
      case "template-dublin":
      case "template-berlin":
      case "template-vienna":
      case "template-stockholm":

      // More Modern Templates
      case "template-sydney":
      case "template-paris":
      case "template-madrid":
      case "template-singapore":

      // Creative Templates
      case "template-lisbon":
      case "template-rome":
      case "template-milan":
      case "template-oslo":
      case "template-moscow":
      case "template-rio":
      case "template-vancouver":
      case "template-cape_town":

      // Two-Column Templates
      case "template-athens":
      case "template-brussels":
      case "template-shanghai":
      case "template-copenhagen":
      case "template-amsterdam":
      case "template-barcelona":

      // Professional Templates
      case "template-new_york":
      case "template-toronto":
      case "template-chicago":
      case "template-boston":
      case "template-geneva":

      // Specialist Templates
      case "template-specialist_traditional1":
      case "template-rirekisho":
      case "template-shokumukeirekisho":
      case "template-academic":
      case "template-entry_level":

      // Default case
      default:
        return <BaseTemplate ref={ref} data={data} customization={customization} />;
    }
  }
);

TemplateRenderer.displayName = "TemplateRenderer";

export default TemplateRenderer;