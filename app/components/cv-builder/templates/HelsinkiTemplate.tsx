import { forwardRef } from "react";
import type { BaseTemplateProps } from "./BaseTemplate";

/**
 * Helsinki Template (Prime ATS)
 * - Clean ATS-friendly layout with golden horizontal lines
 * - Single column design
 * - Contact info on one line
 * - Dates aligned right in italics
 */
const HelsinkiTemplate = forwardRef<HTMLDivElement, BaseTemplateProps>(
  ({ data, customization }, ref) => {
    const { primaryColor, fontSize, fontWeight, spacing, fonts } = customization;
    const { personalDetails, professionalSummary, professionalExperience, education, skillsData } = data;

    // A4 dimensions
    const a4Width = 595;
    const a4Height = 842;

    const goldenLine = "#d4af37"; // Golden color for section lines

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
          color: "#000000",
        }}
      >
        {/* Header */}
        <div className="mb-6">
          <h1
            style={{
              fontSize: `${fontSize.primaryHeading}px`,
              fontWeight: fontWeight.primaryHeading,
              marginBottom: "8px",
              color: "#000000",
            }}
          >
            {personalDetails?.firstName} {personalDetails?.lastName}
          </h1>
          
          {/* Contact Info - Single Line */}
          <div
            style={{
              fontSize: `${fontSize.body}px`,
              color: "#333333",
              marginBottom: "4px",
            }}
          >
            {personalDetails?.location && <span>{personalDetails.location} | </span>}
            {personalDetails?.email && <span>{personalDetails.email} | </span>}
            {personalDetails?.phone && <span>{personalDetails.phone}</span>}
            {personalDetails?.linkedin && <span> | {personalDetails.linkedin}</span>}
          </div>
        </div>

        {/* Professional Summary */}
        {professionalSummary && (
          <div className="mb-6">
            <div
              style={{
                borderBottom: `1px solid ${goldenLine}`,
                paddingBottom: "4px",
                marginBottom: "8px",
              }}
            >
              <h2
                style={{
                  fontSize: `${fontSize.sectionTitles}px`,
                  fontWeight: fontWeight.sectionTitles,
                  color: "#000000",
                }}
              >
                Professional Summary
              </h2>
            </div>
            <p style={{ textAlign: "justify" }}>{professionalSummary}</p>
          </div>
        )}

        {/* Professional Experience */}
        {professionalExperience && professionalExperience.length > 0 && (
          <div className="mb-6">
            <div
              style={{
                borderBottom: `1px solid ${goldenLine}`,
                paddingBottom: "4px",
                marginBottom: "8px",
              }}
            >
              <h2
                style={{
                  fontSize: `${fontSize.sectionTitles}px`,
                  fontWeight: fontWeight.sectionTitles,
                  color: "#000000",
                }}
              >
                Professional Experience
              </h2>
            </div>
            
            {professionalExperience.map((exp, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-baseline mb-1">
                  <div>
                    <strong style={{ fontSize: `${fontSize.body}px` }}>
                      {exp.company}, {exp.jobTitle}
                      {exp.location && `, ${exp.location}`}
                    </strong>
                  </div>
                  <div
                    style={{
                      fontSize: `${fontSize.body - 1}px`,
                      fontStyle: "italic",
                      color: "#666666",
                      whiteSpace: "nowrap",
                      marginLeft: "16px",
                    }}
                  >
                    {exp.startDate} - {exp.endDate || "Present"}
                  </div>
                </div>
                
                {exp.description && (
                  <p style={{ marginBottom: "6px" }}>{exp.description}</p>
                )}
                
                {exp.achievements && exp.achievements.length > 0 && (
                  <ul style={{ paddingLeft: "20px", margin: "4px 0" }}>
                    {exp.achievements.map((achievement, i) => (
                      <li key={i} style={{ marginBottom: "2px" }}>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <div className="mb-6">
            <div
              style={{
                borderBottom: `1px solid ${goldenLine}`,
                paddingBottom: "4px",
                marginBottom: "8px",
              }}
            >
              <h2
                style={{
                  fontSize: `${fontSize.sectionTitles}px`,
                  fontWeight: fontWeight.sectionTitles,
                  color: "#000000",
                }}
              >
                Education
              </h2>
            </div>
            
            {education.map((edu, index) => (
              <div key={index} className="mb-3">
                <div className="flex justify-between items-baseline">
                  <div>
                    <strong style={{ fontSize: `${fontSize.body}px` }}>
                      {edu.degree}, {edu.institution}
                    </strong>
                    {edu.location && (
                      <span style={{ color: "#666666" }}>, {edu.location}</span>
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: `${fontSize.body - 1}px`,
                      fontStyle: "italic",
                      color: "#666666",
                      whiteSpace: "nowrap",
                      marginLeft: "16px",
                    }}
                  >
                    {edu.graduationDate}
                  </div>
                </div>
                
                {edu.gpa && (
                  <div style={{ fontSize: `${fontSize.body - 1}px`, color: "#666666" }}>
                    GPA: {edu.gpa}
                  </div>
                )}
                
                {edu.achievements && edu.achievements.length > 0 && (
                  <ul style={{ paddingLeft: "20px", margin: "4px 0" }}>
                    {edu.achievements.map((achievement, i) => (
                      <li key={i} style={{ marginBottom: "2px" }}>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {skillsData && skillsData.length > 0 && (
          <div className="mb-6">
            <div
              style={{
                borderBottom: `1px solid ${goldenLine}`,
                paddingBottom: "4px",
                marginBottom: "8px",
              }}
            >
              <h2
                style={{
                  fontSize: `${fontSize.sectionTitles}px`,
                  fontWeight: fontWeight.sectionTitles,
                  color: "#000000",
                }}
              >
                Skills
              </h2>
            </div>
            
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {skillsData.map((skill, index) => (
                <span key={skill.id || index}>
                  {skill.name}
                  {index < skillsData.length - 1 && ", "}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
);

HelsinkiTemplate.displayName = "HelsinkiTemplate";

export default HelsinkiTemplate;