import { forwardRef } from "react";
import type { BaseTemplateProps } from "./BaseTemplate";

/**
 * Prague Template (Precision ATS)
 * - Thick vertical blue bar on the left
 * - Contact info aligned right in header
 * - Page number at bottom
 * - Clean ATS-friendly layout
 */
const PragueTemplate = forwardRef<HTMLDivElement, BaseTemplateProps>(
  ({ data, customization }, ref) => {
    const { primaryColor, fontSize, fontWeight, spacing, fonts } = customization;
    const { personalDetails, professionalSummary, professionalExperience, education, skillsData } = data;

    // A4 dimensions
    const a4Width = 595;
    const a4Height = 842;

    return (
      <div
        ref={ref}
        data-cv-preview="true"
        style={{
          width: `${a4Width}px`,
          minHeight: `${a4Height}px`,
          fontFamily: fonts.primary,
          lineHeight: `${spacing.lineHeight}%`,
          fontSize: `${fontSize.body}px`,
          color: "#000000",
        }}
      >
        {/* Left Vertical Bar */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "8px",
            backgroundColor: primaryColor,
          }}
        />

        {/* Content Container */}
        <div style={{ marginLeft: "24px", padding: "40px 48px 40px 32px" }}>
          {/* Header */}
          <div className="mb-6">
            <div className="flex justify-between items-start mb-3">
              <h1
                style={{
                  fontSize: `${fontSize.primaryHeading}px`,
                  fontWeight: fontWeight.primaryHeading,
                  color: "#000000",
                }}
              >
                {personalDetails?.firstName} {personalDetails?.lastName}
              </h1>

              {/* Contact Info - Right Aligned */}
              <div
                style={{
                  textAlign: "right",
                  fontSize: `${fontSize.body - 1}px`,
                  color: "#333333",
                  marginLeft: "24px",
                }}
              >
                {personalDetails?.location && (
                  <div>{personalDetails.location}</div>
                )}
                {personalDetails?.phone && (
                  <div>{personalDetails.phone}</div>
                )}
                {personalDetails?.email && (
                  <div>{personalDetails.email}</div>
                )}
                {personalDetails?.linkedin && (
                  <div>{personalDetails.linkedin}</div>
                )}
              </div>
            </div>

            {personalDetails?.jobTitle && (
              <div
                style={{
                  fontSize: `${fontSize.secondaryHeading}px`,
                  fontWeight: fontWeight.secondaryHeading,
                  color: primaryColor,
                }}
              >
                {personalDetails.jobTitle}
              </div>
            )}
          </div>

          {/* Professional Summary */}
          {professionalSummary && (
            <div className="mb-5">
              <h2
                style={{
                  fontSize: `${fontSize.sectionTitles}px`,
                  fontWeight: fontWeight.sectionTitles,
                  color: "#000000",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                  letterSpacing: "0.5px",
                }}
              >
                Professional Summary
              </h2>
              <p style={{ textAlign: "justify" }}>{professionalSummary}</p>
            </div>
          )}

          {/* Professional Experience */}
          {professionalExperience && professionalExperience.length > 0 && (
            <div className="mb-5">
              <h2
                style={{
                  fontSize: `${fontSize.sectionTitles}px`,
                  fontWeight: fontWeight.sectionTitles,
                  color: "#000000",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                  letterSpacing: "0.5px",
                }}
              >
                Professional Experience
              </h2>
              
              {professionalExperience.map((exp, index) => (
                <div key={index} className="mb-4">
                  <div className="mb-1">
                    <div
                      style={{
                        fontSize: `${fontSize.body}px`,
                        fontWeight: "700",
                      }}
                    >
                      {exp.jobTitle}
                    </div>
                    <div className="flex justify-between items-baseline">
                      <div
                        style={{
                          fontSize: `${fontSize.body}px`,
                          fontWeight: "600",
                          color: primaryColor,
                        }}
                      >
                        {exp.company}
                        {exp.location && ` • ${exp.location}`}
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
                  </div>
                  
                  {exp.description && (
                    <p style={{ marginBottom: "6px" }}>{exp.description}</p>
                  )}
                  
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul style={{ paddingLeft: "20px", margin: "4px 0" }}>
                      {exp.achievements.map((achievement, i) => (
                        <li key={i} style={{ marginBottom: "3px" }}>
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
            <div className="mb-5">
              <h2
                style={{
                  fontSize: `${fontSize.sectionTitles}px`,
                  fontWeight: fontWeight.sectionTitles,
                  color: "#000000",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                  letterSpacing: "0.5px",
                }}
              >
                Education
              </h2>
              
              {education.map((edu, index) => (
                <div key={index} className="mb-3">
                  <div className="flex justify-between items-baseline mb-1">
                    <div>
                      <div
                        style={{
                          fontSize: `${fontSize.body}px`,
                          fontWeight: "700",
                        }}
                      >
                        {edu.degree}
                      </div>
                      <div
                        style={{
                          fontSize: `${fontSize.body}px`,
                          fontWeight: "600",
                          color: primaryColor,
                        }}
                      >
                        {edu.institution}
                        {edu.location && ` • ${edu.location}`}
                      </div>
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
            <div className="mb-5">
              <h2
                style={{
                  fontSize: `${fontSize.sectionTitles}px`,
                  fontWeight: fontWeight.sectionTitles,
                  color: "#000000",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                  letterSpacing: "0.5px",
                }}
              >
                Skills
              </h2>
              
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {skillsData.map((skill, index) => (
                  <span key={skill.id || index}>
                    {skill.name}
                    {index < skillsData.length - 1 && " • "}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Page Number */}
        <div
          style={{
            position: "absolute",
            bottom: "24px",
            right: "48px",
            fontSize: `${fontSize.body - 2}px`,
            color: "#999999",
          }}
        >
          Page 1
        </div>
      </div>
    );
  }
);

PragueTemplate.displayName = "PragueTemplate";

export default PragueTemplate;