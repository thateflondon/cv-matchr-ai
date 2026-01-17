import { forwardRef } from "react";
import type { CVData, CVCustomization } from "~/types/cv-builder";

export interface AcademicTemplateProps {
  data: CVData;
  customization: CVCustomization;
}

/**
 * Academic Template - Traditional academic CV format
 * Features: Single column, formal layout, emphasis on publications and research
 */
const AcademicTemplate = forwardRef<HTMLDivElement, AcademicTemplateProps>(
  ({ data, customization }, ref) => {
    const { primaryColor, fonts, spacing, fontSize, fontWeight } = customization;
    const { personalDetails, professionalSummary, professionalExperience, education, skillsData } = data;

    // A4 dimensions in pixels (at 72 DPI)
    const a4Height = 842;

    return (
      <div
        ref={ref}
        data-cv-preview="true"
        className="bg-white w-full"
        style={{
          minHeight: `${a4Height}px`,
          fontFamily: fonts.secondary,
          lineHeight: `${spacing.lineHeight}%`,
          fontSize: `${fontSize.body}px`,
          fontWeight: fontWeight.body,
          color: "#000000",
          padding: "60px 50px",
        }}
      >
        {/* Header - Centered Name and Contact */}
        <div style={{ textAlign: "center", marginBottom: spacing.sections + "px" }}>
          <h1
            style={{
              fontFamily: fonts.primary,
              fontSize: `${fontSize.primaryHeading + 4}px`,
              fontWeight: fontWeight.primaryHeading,
              marginBottom: "12px",
              color: "#000000",
              letterSpacing: "0.5px",
            }}
          >
            {personalDetails?.firstName} {personalDetails?.lastName}
          </h1>

          {/* Contact Info - Centered */}
          <div
            style={{
              fontSize: `${fontSize.body - 1}px`,
              color: "#333333",
              lineHeight: "1.6",
            }}
          >
            {personalDetails?.email && <div>{personalDetails.email}</div>}
            {personalDetails?.phone && <div>{personalDetails.phone}</div>}
            {personalDetails?.location && <div>{personalDetails.location}</div>}
            {personalDetails?.linkedin && <div>{personalDetails.linkedin}</div>}
          </div>
        </div>

        {/* Professional Summary */}
        {professionalSummary && (
          <div style={{ marginBottom: spacing.sections + "px" }}>
            <h2
              style={{
                fontFamily: fonts.primary,
                fontSize: `${fontSize.secondaryHeading}px`,
                fontWeight: fontWeight.secondaryHeading,
                marginBottom: "12px",
                color: "#000000",
                textTransform: "uppercase",
                letterSpacing: "1px",
                borderBottom: "1px solid #000000",
                paddingBottom: "4px",
              }}
            >
              Research Interests
            </h2>
            <div style={{ marginTop: "12px" }}>{professionalSummary}</div>
          </div>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <div style={{ marginBottom: spacing.sections + "px" }}>
            <h2
              style={{
                fontFamily: fonts.primary,
                fontSize: `${fontSize.secondaryHeading}px`,
                fontWeight: fontWeight.secondaryHeading,
                marginBottom: "12px",
                color: "#000000",
                textTransform: "uppercase",
                letterSpacing: "1px",
                borderBottom: "1px solid #000000",
                paddingBottom: "4px",
              }}
            >
              Education
            </h2>
            {education.map((edu, index) => (
              <div
                key={index}
                style={{
                  marginBottom: spacing.items + "px",
                  marginTop: "12px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "4px",
                  }}
                >
                  <div>
                    <strong
                      style={{
                        fontFamily: fonts.primary,
                        fontSize: `${fontSize.body}px`,
                        fontWeight: fontWeight.sectionHeading,
                      }}
                    >
                      {edu.degree}
                    </strong>
                    {edu.institution && (
                      <span style={{ color: "#333333" }}>
                        {" "}
                        - {edu.institution}
                      </span>
                    )}
                  </div>
                  {(edu.startDate || edu.endDate) && (
                    <div style={{ color: "#666666", fontSize: `${fontSize.body - 1}px` }}>
                      {edu.startDate} {edu.endDate && `- ${edu.endDate}`}
                    </div>
                  )}
                </div>
                {edu.description && (
                  <div style={{ color: "#333333", marginTop: "6px" }}>
                    {edu.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Professional Experience */}
        {professionalExperience && professionalExperience.length > 0 && (
          <div style={{ marginBottom: spacing.sections + "px" }}>
            <h2
              style={{
                fontFamily: fonts.primary,
                fontSize: `${fontSize.secondaryHeading}px`,
                fontWeight: fontWeight.secondaryHeading,
                marginBottom: "12px",
                color: "#000000",
                textTransform: "uppercase",
                letterSpacing: "1px",
                borderBottom: "1px solid #000000",
                paddingBottom: "4px",
              }}
            >
              Research & Teaching Experience
            </h2>
            {professionalExperience.map((exp, index) => (
              <div
                key={index}
                style={{
                  marginBottom: spacing.items + "px",
                  marginTop: "12px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "4px",
                  }}
                >
                  <div>
                    <strong
                      style={{
                        fontFamily: fonts.primary,
                        fontSize: `${fontSize.body}px`,
                        fontWeight: fontWeight.sectionHeading,
                      }}
                    >
                      {exp.jobTitle}
                    </strong>
                    {exp.company && (
                      <span style={{ color: "#333333" }}>
                        {" "}
                        - {exp.company}
                      </span>
                    )}
                  </div>
                  {(exp.startDate || exp.endDate) && (
                    <div style={{ color: "#666666", fontSize: `${fontSize.body - 1}px` }}>
                      {exp.startDate} {exp.endDate && `- ${exp.endDate}`}
                    </div>
                  )}
                </div>
                {exp.description && (
                  <div style={{ color: "#333333", marginTop: "6px" }}>
                    {exp.description}
                  </div>
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
                fontFamily: fonts.primary,
                fontSize: `${fontSize.secondaryHeading}px`,
                fontWeight: fontWeight.secondaryHeading,
                marginBottom: "12px",
                color: "#000000",
                textTransform: "uppercase",
                letterSpacing: "1px",
                borderBottom: "1px solid #000000",
                paddingBottom: "4px",
              }}
            >
              Skills & Competencies
            </h2>
            <div style={{ marginTop: "12px" }}>
              {skillsData.map((skillGroup, index) => (
                <div key={index} style={{ marginBottom: "8px" }}>
                  {skillGroup.category && (
                    <strong style={{ fontWeight: fontWeight.sectionHeading }}>
                      {skillGroup.category}:{" "}
                    </strong>
                  )}
                  <span>{skillGroup.items.join(", ")}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
);

AcademicTemplate.displayName = "AcademicTemplate";

export default AcademicTemplate;
