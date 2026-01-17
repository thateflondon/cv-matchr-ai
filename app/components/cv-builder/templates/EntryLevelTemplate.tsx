import { forwardRef } from "react";
import type { CVData, CVCustomization } from "~/types/cv-builder";

export interface EntryLevelTemplateProps {
  data: CVData;
  customization: CVCustomization;
}

/**
 * Entry Level Template - Clean and simple format for early career professionals
 * Features: Single column, modern and minimal, easy to read
 */
const EntryLevelTemplate = forwardRef<HTMLDivElement, EntryLevelTemplateProps>(
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
          padding: "50px 45px",
        }}
      >
        {/* Header - Name and Contact */}
        <div style={{ marginBottom: spacing.sections + "px" }}>
          <h1
            style={{
              fontFamily: fonts.primary,
              fontSize: `${fontSize.primaryHeading + 6}px`,
              fontWeight: fontWeight.primaryHeading,
              marginBottom: "8px",
              color: primaryColor,
              letterSpacing: "0px",
            }}
          >
            {personalDetails?.firstName} {personalDetails?.lastName}
          </h1>

          {personalDetails?.jobTitle && (
            <div
              style={{
                fontFamily: fonts.primary,
                fontSize: `${fontSize.secondaryHeading}px`,
                fontWeight: fontWeight.secondaryHeading,
                marginBottom: "12px",
                color: "#444444",
              }}
            >
              {personalDetails.jobTitle}
            </div>
          )}

          {/* Contact Info - Inline */}
          <div
            style={{
              fontSize: `${fontSize.body - 1}px`,
              color: "#666666",
              display: "flex",
              flexWrap: "wrap",
              gap: "16px",
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
                marginBottom: "10px",
                color: primaryColor,
                paddingBottom: "6px",
                borderBottom: `2px solid ${primaryColor}`,
              }}
            >
              Summary
            </h2>
            <div style={{ marginTop: "12px", color: "#333333" }}>
              {professionalSummary}
            </div>
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
                marginBottom: "10px",
                color: primaryColor,
                paddingBottom: "6px",
                borderBottom: `2px solid ${primaryColor}`,
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
                    alignItems: "baseline",
                    marginBottom: "4px",
                  }}
                >
                  <strong
                    style={{
                      fontFamily: fonts.primary,
                      fontSize: `${fontSize.body}px`,
                      fontWeight: fontWeight.sectionHeading,
                      color: "#000000",
                    }}
                  >
                    {edu.degree}
                  </strong>
                  {(edu.startDate || edu.endDate) && (
                    <div
                      style={{
                        color: "#666666",
                        fontSize: `${fontSize.body - 1}px`,
                        fontStyle: "italic",
                      }}
                    >
                      {edu.startDate} {edu.endDate && `- ${edu.endDate}`}
                    </div>
                  )}
                </div>
                {edu.institution && (
                  <div
                    style={{
                      color: "#444444",
                      marginBottom: "4px",
                      fontStyle: "italic",
                    }}
                  >
                    {edu.institution}
                  </div>
                )}
                {edu.description && (
                  <div style={{ color: "#555555", marginTop: "6px" }}>
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
                marginBottom: "10px",
                color: primaryColor,
                paddingBottom: "6px",
                borderBottom: `2px solid ${primaryColor}`,
              }}
            >
              Experience
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
                    alignItems: "baseline",
                    marginBottom: "4px",
                  }}
                >
                  <strong
                    style={{
                      fontFamily: fonts.primary,
                      fontSize: `${fontSize.body}px`,
                      fontWeight: fontWeight.sectionHeading,
                      color: "#000000",
                    }}
                  >
                    {exp.jobTitle}
                  </strong>
                  {(exp.startDate || exp.endDate) && (
                    <div
                      style={{
                        color: "#666666",
                        fontSize: `${fontSize.body - 1}px`,
                        fontStyle: "italic",
                      }}
                    >
                      {exp.startDate} {exp.endDate && `- ${exp.endDate}`}
                    </div>
                  )}
                </div>
                {exp.company && (
                  <div
                    style={{
                      color: "#444444",
                      marginBottom: "4px",
                      fontStyle: "italic",
                    }}
                  >
                    {exp.company}
                  </div>
                )}
                {exp.description && (
                  <div style={{ color: "#555555", marginTop: "6px" }}>
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
                marginBottom: "10px",
                color: primaryColor,
                paddingBottom: "6px",
                borderBottom: `2px solid ${primaryColor}`,
              }}
            >
              Skills
            </h2>
            <div style={{ marginTop: "12px" }}>
              {skillsData.map((skillGroup, index) => (
                <div key={index} style={{ marginBottom: "10px" }}>
                  {skillGroup.category && (
                    <strong
                      style={{
                        fontWeight: fontWeight.sectionHeading,
                        color: "#000000",
                      }}
                    >
                      {skillGroup.category}:{" "}
                    </strong>
                  )}
                  <span style={{ color: "#444444" }}>
                    {skillGroup.items.join(", ")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
);

EntryLevelTemplate.displayName = "EntryLevelTemplate";

export default EntryLevelTemplate;
