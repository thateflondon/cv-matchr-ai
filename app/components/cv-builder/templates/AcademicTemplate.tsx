import { forwardRef } from "react";
import type { CVData, CVCustomization } from "~/types/cv-builder";

export interface AcademicTemplateProps {
  data: CVData;
  customization: CVCustomization;
}

/**
 * Academic Template - Single column with blue accent bar
 * Features: Name/contact header, summary, achievements, education, experience
 * Design: Blue vertical bar on left, clean professional layout
 */
const AcademicTemplate = forwardRef<HTMLDivElement, AcademicTemplateProps>(
  ({ data, customization }, ref) => {
    const { primaryColor, fonts, spacing, fontSize, fontWeight } = customization;
    const { personalDetails, professionalSummary, professionalExperience, education, skillsData, certifications } = data;

    // A4 dimensions in pixels (at 72 DPI)
    const a4Height = 842;
    
    // Use primary color or default blue
    const accentColor = primaryColor || "#0A5F8C";

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
        }}
      >
        <div style={{ position: "relative" }}>
          {/* Blue left border accent */}
          <div
            style={{
              position: "absolute",
              top: "48px",
              left: "0",
              width: "8px",
              height: "256px",
              backgroundColor: accentColor,
            }}
          />

          <div style={{ padding: "48px" }}>
            {/* Header - Name and Contact */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: spacing.sections + "px",
              }}
            >
              {/* Name and Title */}
              <div>
                <h1
                  style={{
                    fontFamily: fonts.primary,
                    fontSize: `${fontSize.primaryHeading}px`,
                    fontWeight: fontWeight.primaryHeading,
                    color: accentColor,
                    marginBottom: "8px",
                  }}
                >
                  {personalDetails?.firstName} {personalDetails?.lastName}
                </h1>
                {personalDetails?.jobTitle && (
                  <p
                    style={{
                      fontFamily: fonts.primary,
                      fontSize: `${fontSize.secondaryHeading - 4}px`,
                      color: accentColor,
                      fontWeight: fontWeight.body,
                    }}
                  >
                    {personalDetails.jobTitle}
                  </p>
                )}
              </div>

              {/* Contact Info - Right side */}
              <div style={{ textAlign: "right", fontSize: `${fontSize.body - 2}px` }}>
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "4px" }}>
                  {personalDetails?.email && (
                    <p style={{ color: accentColor }}>{personalDetails.email}</p>
                  )}
                  {personalDetails?.email && personalDetails?.phone && (
                    <span style={{ color: accentColor }}>&nbsp;•&nbsp;</span>
                  )}
                  {personalDetails?.phone && (
                    <p style={{ color: accentColor }}>{personalDetails.phone}</p>
                  )}
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  {personalDetails?.linkedin && (
                    <p style={{ color: accentColor }}>{personalDetails.linkedin}</p>
                  )}
                  {personalDetails?.linkedin && personalDetails?.location && (
                    <span style={{ color: accentColor }}>&nbsp;•&nbsp;</span>
                  )}
                  {personalDetails?.location && (
                    <p style={{ color: accentColor }}>{personalDetails.location}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Professional Summary */}
            {professionalSummary && (
              <div style={{ marginBottom: spacing.sections + "px" }}>
                <p
                  style={{
                    color: accentColor,
                    lineHeight: "1.6",
                  }}
                >
                  {professionalSummary}
                </p>
              </div>
            )}

            {/* Selected Achievements / Skills as Achievements */}
            {skillsData && skillsData.length > 0 && (
              <div style={{ marginBottom: spacing.sections + "px" }}>
                <h2
                  style={{
                    fontFamily: fonts.primary,
                    fontSize: `${fontSize.secondaryHeading}px`,
                    fontWeight: fontWeight.secondaryHeading,
                    color: accentColor,
                    marginBottom: "16px",
                  }}
                >
                  Selected Achievements
                </h2>
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {skillsData.map((skillGroup, groupIndex) =>
                    skillGroup.items?.map((item, itemIndex) => (
                      <li
                        key={`${groupIndex}-${itemIndex}`}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          marginBottom: "8px",
                        }}
                      >
                        <span style={{ color: "#4B5563", marginRight: "12px" }}>•</span>
                        <span style={{ color: "#4B5563" }}>{item}</span>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            )}

            {/* Education and Credentials */}
            {education && education.length > 0 && (
              <div style={{ marginBottom: spacing.sections + "px" }}>
                <h2
                  style={{
                    fontFamily: fonts.primary,
                    fontSize: `${fontSize.secondaryHeading}px`,
                    fontWeight: fontWeight.secondaryHeading,
                    color: accentColor,
                    marginBottom: "16px",
                  }}
                >
                  Education and Credentials
                </h2>
                {education.map((edu, index) => (
                  <div key={index} style={{ marginBottom: "16px" }}>
                    <h3
                      style={{
                        fontFamily: fonts.primary,
                        fontSize: `${fontSize.body}px`,
                        color: accentColor,
                        fontWeight: fontWeight.sectionHeading,
                        marginBottom: "4px",
                      }}
                    >
                      {edu.degree}
                    </h3>
                    <p
                      style={{
                        color: "#4B5563",
                        marginLeft: "16px",
                      }}
                    >
                      {edu.institution}
                      {edu.location && `, ${edu.location}`}
                      {(edu.graduationDate || edu.endDate) && (
                        <span> ({edu.graduationDate || edu.endDate})</span>
                      )}
                    </p>
                  </div>
                ))}

                {/* Certifications */}
                {certifications && certifications.length > 0 && (
                  <div style={{ marginTop: "16px" }}>
                    {certifications.map((cert, index) => (
                      <div key={index} style={{ marginBottom: "16px" }}>
                        <h3
                          style={{
                            fontFamily: fonts.primary,
                            fontSize: `${fontSize.body}px`,
                            color: accentColor,
                            fontWeight: fontWeight.sectionHeading,
                            marginBottom: "4px",
                          }}
                        >
                          {cert.name}
                        </h3>
                        <p
                          style={{
                            color: "#4B5563",
                            marginLeft: "16px",
                          }}
                        >
                          {cert.issuer}
                          {cert.date && ` (${cert.date})`}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
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
                    color: accentColor,
                    marginBottom: "16px",
                  }}
                >
                  Professional Experience
                </h2>

                {professionalExperience.map((exp, index) => (
                  <div key={index} style={{ marginBottom: spacing.items + "px" }}>
                    {/* Job header */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "12px",
                      }}
                    >
                      <div>
                        <h3
                          style={{
                            fontFamily: fonts.primary,
                            fontSize: `${fontSize.body}px`,
                            color: accentColor,
                            fontWeight: fontWeight.sectionHeading,
                            marginBottom: "4px",
                          }}
                        >
                          {exp.jobTitle}
                          {exp.company && `, ${exp.company}`}
                          {exp.location && `, ${exp.location}`}
                        </h3>
                        {exp.company && (
                          <p
                            style={{
                              color: accentColor,
                              marginLeft: "16px",
                              fontSize: `${fontSize.body - 1}px`,
                            }}
                          >
                            {exp.company}
                            {(exp.startDate || exp.endDate) && (
                              <span>
                                {" "}
                                ({exp.startDate} - {exp.endDate || "Present"})
                              </span>
                            )}
                          </p>
                        )}
                      </div>
                      {(exp.startDate || exp.endDate) && (
                        <p style={{ color: accentColor, fontSize: `${fontSize.body - 1}px` }}>
                          {exp.startDate} - {exp.endDate || "Present"}
                        </p>
                      )}
                    </div>

                    {/* Description */}
                    {exp.description && (
                      <p
                        style={{
                          color: "#4B5563",
                          marginBottom: "12px",
                          lineHeight: "1.6",
                        }}
                      >
                        {exp.description}
                      </p>
                    )}

                    {/* Achievements */}
                    {exp.achievements && exp.achievements.length > 0 && (
                      <ul style={{ listStyle: "none", padding: 0, marginBottom: "12px" }}>
                        {exp.achievements.map((achievement, i) => (
                          <li
                            key={i}
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              marginBottom: "8px",
                            }}
                          >
                            <span style={{ color: "#4B5563", marginRight: "12px" }}>•</span>
                            <span style={{ color: "#4B5563" }}>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Page number - Only show if it makes sense */}
            {/* <div style={{ textAlign: "right", fontSize: `${fontSize.body - 2}px`, color: accentColor, marginTop: "32px" }}>
              Page 1 | 1
            </div> */}
          </div>
        </div>
      </div>
    );
  }
);

AcademicTemplate.displayName = "AcademicTemplate";

export default AcademicTemplate;