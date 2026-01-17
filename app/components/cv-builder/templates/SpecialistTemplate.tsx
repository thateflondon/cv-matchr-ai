import { forwardRef } from "react";
import type { CVData, CVCustomization } from "~/types/cv-builder";

export interface SpecialistTemplateProps {
  data: CVData;
  customization: CVCustomization;
}

/**
 * Specialist Template - Traditional professional format with two-column layout
 * Features: Two columns, structured layout, professional appearance
 */
const SpecialistTemplate = forwardRef<HTMLDivElement, SpecialistTemplateProps>(
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
          padding: "0",
        }}
      >
        {/* Header Section with Background */}
        <div
          style={{
            backgroundColor: primaryColor,
            color: "#FFFFFF",
            padding: "40px 50px",
            marginBottom: spacing.sections + "px",
          }}
        >
          <h1
            style={{
              fontFamily: fonts.primary,
              fontSize: `${fontSize.primaryHeading + 4}px`,
              fontWeight: fontWeight.primaryHeading,
              marginBottom: "8px",
              color: "#FFFFFF",
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
                color: "#FFFFFF",
                opacity: 0.95,
              }}
            >
              {personalDetails.jobTitle}
            </div>
          )}
        </div>

        {/* Two Column Layout */}
        <div
          style={{
            display: "flex",
            gap: "30px",
            padding: "0 50px 50px 50px",
          }}
        >
          {/* Left Column - Sidebar */}
          <div style={{ width: "35%", flexShrink: 0 }}>
            {/* Contact Information */}
            <div style={{ marginBottom: spacing.sections + "px" }}>
              <h2
                style={{
                  fontFamily: fonts.primary,
                  fontSize: `${fontSize.secondaryHeading - 1}px`,
                  fontWeight: fontWeight.secondaryHeading,
                  marginBottom: "12px",
                  color: primaryColor,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Contact
              </h2>
              <div
                style={{
                  fontSize: `${fontSize.body - 1}px`,
                  color: "#444444",
                  lineHeight: "1.8",
                }}
              >
                {personalDetails?.email && (
                  <div style={{ marginBottom: "6px", wordBreak: "break-word" }}>
                    {personalDetails.email}
                  </div>
                )}
                {personalDetails?.phone && (
                  <div style={{ marginBottom: "6px" }}>{personalDetails.phone}</div>
                )}
                {personalDetails?.location && (
                  <div style={{ marginBottom: "6px" }}>{personalDetails.location}</div>
                )}
                {personalDetails?.linkedin && (
                  <div style={{ marginBottom: "6px", wordBreak: "break-word" }}>
                    {personalDetails.linkedin}
                  </div>
                )}
              </div>
            </div>

            {/* Skills */}
            {skillsData && skillsData.length > 0 && (
              <div style={{ marginBottom: spacing.sections + "px" }}>
                <h2
                  style={{
                    fontFamily: fonts.primary,
                    fontSize: `${fontSize.secondaryHeading - 1}px`,
                    fontWeight: fontWeight.secondaryHeading,
                    marginBottom: "12px",
                    color: primaryColor,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Skills
                </h2>
                <div>
                  {skillsData.map((skillGroup, index) => (
                    <div key={index} style={{ marginBottom: "12px" }}>
                      {skillGroup.category && (
                        <div
                          style={{
                            fontWeight: fontWeight.sectionHeading,
                            color: "#000000",
                            marginBottom: "4px",
                            fontSize: `${fontSize.body - 1}px`,
                          }}
                        >
                          {skillGroup.category}
                        </div>
                      )}
                      <div
                        style={{
                          color: "#555555",
                          fontSize: `${fontSize.body - 1}px`,
                          lineHeight: "1.6",
                        }}
                      >
                        {skillGroup.items.join(", ")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {education && education.length > 0 && (
              <div style={{ marginBottom: spacing.sections + "px" }}>
                <h2
                  style={{
                    fontFamily: fonts.primary,
                    fontSize: `${fontSize.secondaryHeading - 1}px`,
                    fontWeight: fontWeight.secondaryHeading,
                    marginBottom: "12px",
                    color: primaryColor,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Education
                </h2>
                {education.map((edu, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: spacing.items + "px",
                    }}
                  >
                    <strong
                      style={{
                        fontFamily: fonts.primary,
                        fontSize: `${fontSize.body - 1}px`,
                        fontWeight: fontWeight.sectionHeading,
                        color: "#000000",
                        display: "block",
                        marginBottom: "2px",
                      }}
                    >
                      {edu.degree}
                    </strong>
                    {edu.institution && (
                      <div
                        style={{
                          color: "#555555",
                          fontSize: `${fontSize.body - 2}px`,
                          marginBottom: "2px",
                        }}
                      >
                        {edu.institution}
                      </div>
                    )}
                    {(edu.startDate || edu.endDate) && (
                      <div
                        style={{
                          color: "#777777",
                          fontSize: `${fontSize.body - 2}px`,
                          fontStyle: "italic",
                        }}
                      >
                        {edu.startDate} {edu.endDate && `- ${edu.endDate}`}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Main Content */}
          <div style={{ flex: 1 }}>
            {/* Professional Summary */}
            {professionalSummary && (
              <div style={{ marginBottom: spacing.sections + "px" }}>
                <h2
                  style={{
                    fontFamily: fonts.primary,
                    fontSize: `${fontSize.secondaryHeading}px`,
                    fontWeight: fontWeight.secondaryHeading,
                    marginBottom: "12px",
                    color: primaryColor,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Profile
                </h2>
                <div style={{ color: "#333333", lineHeight: "1.7" }}>
                  {professionalSummary}
                </div>
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
                    color: primaryColor,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Professional Experience
                </h2>
                {professionalExperience.map((exp, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: spacing.items + "px",
                    }}
                  >
                    <div style={{ marginBottom: "4px" }}>
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
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "6px",
                        fontSize: `${fontSize.body - 1}px`,
                      }}
                    >
                      {exp.company && (
                        <div style={{ color: "#555555", fontStyle: "italic" }}>
                          {exp.company}
                        </div>
                      )}
                      {(exp.startDate || exp.endDate) && (
                        <div style={{ color: "#777777", fontStyle: "italic" }}>
                          {exp.startDate} {exp.endDate && `- ${exp.endDate}`}
                        </div>
                      )}
                    </div>
                    {exp.description && (
                      <div
                        style={{
                          color: "#444444",
                          marginTop: "6px",
                          lineHeight: "1.6",
                        }}
                      >
                        {exp.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

SpecialistTemplate.displayName = "SpecialistTemplate";

export default SpecialistTemplate;
