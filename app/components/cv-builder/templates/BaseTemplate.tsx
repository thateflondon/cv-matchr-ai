import { forwardRef } from "react";
import type { CVData, CVCustomization } from "~/types/cv-builder";

export interface BaseTemplateProps {
  data: CVData;
  customization: CVCustomization;
}

/**
 * Base template component that all CV templates extend from.
 * Provides common styling and structure with full CV rendering.
 */
const BaseTemplate = forwardRef<HTMLDivElement, BaseTemplateProps>(
  ({ data, customization }, ref) => {
    const { primaryColor, fonts, spacing, fontSize, fontWeight, template } = customization;
    const { personalDetails, professionalSummary, professionalExperience, education, skillsData } = data;

    // A4 dimensions in pixels (at 72 DPI)
    const a4Width = 595;
    const a4Height = 842;

    // Determine layout based on template config
    const isOneColumn = template.columns === 1;
    const hasPhoto = template.hasPhoto && personalDetails?.photoUrl;

    return (
      <div
        ref={ref}
        data-cv-preview="true"
        className="bg-white w-full"
        style={{
          minHeight: `${a4Height}px`,
          fontFamily: fonts.secondary, // Body text uses secondary font
          lineHeight: `${spacing.lineHeight}%`,
          fontSize: `${fontSize.body}px`,
          fontWeight: fontWeight.body,
          color: "#000000",
          padding: "40px",
        }}
      >
        {/* Header Section */}
        <div style={{ marginBottom: spacing.sections + "px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "20px" }}>
            {/* Photo (if supported) */}
            {hasPhoto && (
              <div style={{ flexShrink: 0 }}>
                <img
                  src={personalDetails.photoUrl}
                  alt="Profile"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "4px",
                  }}
                />
              </div>
            )}

            {/* Name and Contact */}
            <div style={{ flex: 1 }}>
              <h1
                style={{
                  fontFamily: fonts.primary, // Primary font for main heading
                  fontSize: `${fontSize.primaryHeading}px`,
                  fontWeight: fontWeight.primaryHeading,
                  marginBottom: "8px",
                  color: primaryColor,
                }}
              >
                {personalDetails?.firstName} {personalDetails?.lastName}
              </h1>

              {personalDetails?.jobTitle && (
                <div
                  style={{
                    fontFamily: fonts.primary, // Primary font for job title
                    fontSize: `${fontSize.secondaryHeading}px`,
                    fontWeight: fontWeight.secondaryHeading,
                    marginBottom: "8px",
                    color: "#333333",
                  }}
                >
                  {personalDetails.jobTitle}
                </div>
              )}

              {/* Contact Info */}
              <div
                style={{
                  fontSize: `${fontSize.body}px`,
                  color: "#666666",
                  marginTop: "8px",
                }}
              >
                {personalDetails?.email && <div>{personalDetails.email}</div>}
                {personalDetails?.phone && <div>{personalDetails.phone}</div>}
                {personalDetails?.location && <div>{personalDetails.location}</div>}
                {personalDetails?.linkedin && <div>{personalDetails.linkedin}</div>}
              </div>
            </div>
          </div>
        </div>

        {/* Professional Summary */}
        {professionalSummary && (
          <div style={{ marginBottom: spacing.sections + "px" }}>
            <h2
              style={{
                fontFamily: fonts.primary, // Primary font for section titles
                fontSize: `${fontSize.sectionTitles}px`,
                fontWeight: fontWeight.sectionTitles,
                color: primaryColor,
                marginBottom: "12px",
                paddingBottom: "4px",
                borderBottom: `2px solid ${primaryColor}`,
              }}
            >
              Professional Summary
            </h2>
            <p style={{ textAlign: "justify" }}>{professionalSummary}</p>
          </div>
        )}

        {/* Professional Experience */}
        {professionalExperience && professionalExperience.length > 0 && (
          <div style={{ marginBottom: spacing.sections + "px" }}>
            <h2
              style={{
                fontFamily: fonts.primary, // Primary font for section titles
                fontSize: `${fontSize.sectionTitles}px`,
                fontWeight: fontWeight.sectionTitles,
                color: primaryColor,
                marginBottom: "12px",
                paddingBottom: "4px",
                borderBottom: `2px solid ${primaryColor}`,
              }}
            >
              Professional Experience
            </h2>

            {professionalExperience.map((exp, index) => (
              <div key={index} style={{ marginBottom: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div>
                    <strong style={{ fontSize: `${fontSize.body}px` }}>
                      {exp.jobTitle}
                    </strong>
                  </div>
                  <div
                    style={{
                      fontSize: `${fontSize.body - 1}px`,
                      color: "#666666",
                      whiteSpace: "nowrap",
                      marginLeft: "16px",
                    }}
                  >
                    {exp.startDate} - {exp.endDate || "Present"}
                  </div>
                </div>

                <div style={{ color: "#666666", marginBottom: "6px" }}>
                  {exp.company}
                  {exp.location && `, ${exp.location}`}
                </div>

                {/* Achievements/Responsibilities */}
                {exp.achievements && exp.achievements.length > 0 && (
                  <ul style={{ paddingLeft: "20px", margin: "4px 0" }}>
                    {exp.achievements.map((achievement, i) => (
                      <li key={i} style={{ marginBottom: "2px" }}>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Fallback: Show description if no achievements (for backward compatibility) */}
                {(!exp.achievements || exp.achievements.length === 0) && exp.description && (
                  <p style={{ marginBottom: "6px" }}>{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <div style={{ marginBottom: spacing.sections + "px" }}>
            <h2
              style={{
                fontFamily: fonts.primary, // Primary font for section titles
                fontSize: `${fontSize.sectionTitles}px`,
                fontWeight: fontWeight.sectionTitles,
                color: primaryColor,
                marginBottom: "12px",
                paddingBottom: "4px",
                borderBottom: `2px solid ${primaryColor}`,
              }}
            >
              Education
            </h2>

            {education.map((edu, index) => (
              <div key={index} style={{ marginBottom: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div>
                    <strong style={{ fontSize: `${fontSize.body}px` }}>
                      {edu.degree}
                    </strong>
                  </div>
                  <div
                    style={{
                      fontSize: `${fontSize.body - 1}px`,
                      color: "#666666",
                      whiteSpace: "nowrap",
                      marginLeft: "16px",
                    }}
                  >
                    {edu.graduationDate}
                  </div>
                </div>

                <div style={{ color: "#666666" }}>
                  {edu.institution}
                  {edu.location && `, ${edu.location}`}
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
          <div style={{ marginBottom: spacing.sections + "px" }}>
            <h2
              style={{
                fontFamily: fonts.primary, // Primary font for section titles
                fontSize: `${fontSize.sectionTitles}px`,
                fontWeight: fontWeight.sectionTitles,
                color: primaryColor,
                marginBottom: "12px",
                paddingBottom: "4px",
                borderBottom: `2px solid ${primaryColor}`,
              }}
            >
              Skills
            </h2>

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

BaseTemplate.displayName = "BaseTemplate";

export default BaseTemplate;