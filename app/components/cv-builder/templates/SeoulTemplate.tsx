import { forwardRef } from "react";
import type { BaseTemplateProps } from "./BaseTemplate";

/**
 * Seoul Template (Pure ATS)
 * - Split header: Name left, contact info right
 * - Job title below name
 * - Thick black horizontal lines under section titles
 * - Diamond bullet points (♦)
 * - Technical Proficiencies with indented subsections
 * - Pure ATS-friendly format
 */
const SeoulTemplate = forwardRef<HTMLDivElement, BaseTemplateProps>(
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
          fontFamily: fonts.secondary, // Body text uses secondary font
          lineHeight: `${spacing.lineHeight}%`,
          fontSize: `${fontSize.body}px`,
          color: "#000000",
        }}
      >
        {/* Content Container */}
        <div style={{ padding: "48px 56px" }}>
          {/* Header - Name Centered */}
          <div className="text-center mb-6">
            <h1
              style={{
                fontFamily: fonts.primary, // Primary font for main heading
                fontSize: `${fontSize.primaryHeading}px`,
                fontWeight: fontWeight.primaryHeading,
                color: "#000000",
                marginBottom: "6px",
              }}
            >
              {personalDetails?.firstName} {personalDetails?.lastName}
            </h1>
            
            {personalDetails?.jobTitle && (
              <div
                style={{
                  fontSize: `${fontSize.secondaryHeading}px`,
                  fontWeight: fontWeight.secondaryHeading,
                  color: "#000000",
                }}
              >
                {personalDetails.jobTitle}
              </div>
            )}
          </div>

          {/* Contact Info */}
          <div
            style={{
              textAlign: "center",
              fontSize: `${fontSize.body - 1}px`,
              color: "#000000",
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

          {/* Professional Summary */}
          {professionalSummary && (
            <div className="mb-5">
              <p style={{ textAlign: "justify" }}>{professionalSummary}</p>
            </div>
          )}

          {/* Technical Proficiencies */}
          {data.skillGroups && data.skillGroups.length > 0 && (
            <div className="mb-5">
              <div
                style={{
                  borderBottom: "2px solid #000000",
                  paddingBottom: "3px",
                  marginBottom: "8px",
                }}
              >
                <h2
                  style={{
                    fontFamily: fonts.primary, // Primary font for section titles
                    fontSize: `${fontSize.sectionTitles}px`,
                    fontWeight: fontWeight.sectionTitles,
                    color: "#000000",
                  }}
                >
                  Technical Proficiencies
                </h2>
              </div>
              
              <div style={{ marginLeft: "0" }}>
                {data.skillGroups.map((group, index) => (
                  <div key={index} style={{ marginBottom: "8px" }}>
                    <div className="flex gap-8">
                      <div
                        style={{
                          fontWeight: "700",
                          minWidth: "140px",
                          flexShrink: 0,
                        }}
                      >
                        {group.title}:
                      </div>
                      <div style={{ flex: 1 }}>
                        {group.skills.join(", ")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Professional Experience */}
          {professionalExperience && professionalExperience.length > 0 && (
            <div className="mb-5">
              <div
                style={{
                  borderBottom: "2px solid #000000",
                  paddingBottom: "3px",
                  marginBottom: "8px",
                }}
              >
                <h2
                  style={{
                    fontFamily: fonts.primary, // Primary font for section titles
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
                        {exp.company}, {exp.location || ""}
                      </strong>
                    </div>
                    <div
                      style={{
                        fontSize: `${fontSize.body - 1}px`,
                        color: "#000000",
                        whiteSpace: "nowrap",
                        marginLeft: "16px",
                      }}
                    >
                      {exp.startDate} – {exp.endDate || "Present"}
                    </div>
                  </div>
                  
                  <div
                    style={{
                      fontSize: `${fontSize.body}px`,
                      fontWeight: "600",
                      marginBottom: "6px",
                    }}
                  >
                    {exp.jobTitle}
                  </div>
                  
                  {/* Achievements/Responsibilities with diamond bullets */}
                  {exp.achievements && exp.achievements.length > 0 && (
                    <div style={{ marginLeft: "20px" }}>
                      {exp.achievements.map((achievement, i) => (
                        <div key={i} style={{ marginBottom: "4px", display: "flex", gap: "8px" }}>
                          <span style={{ flexShrink: 0 }}>♦</span>
                          <span style={{ flex: 1 }}>{achievement}</span>
                        </div>
                      ))}
                    </div>
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
            <div className="mb-5">
              <div
                style={{
                  borderBottom: "2px solid #000000",
                  paddingBottom: "3px",
                  marginBottom: "8px",
                }}
              >
                <h2
                  style={{
                    fontFamily: fonts.primary, // Primary font for section titles
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
                  <div className="flex justify-between items-baseline mb-1">
                    <div>
                      <strong style={{ fontSize: `${fontSize.body}px` }}>
                        {edu.institution}
                        {edu.location && `, ${edu.location}`}
                      </strong>
                    </div>
                    <div
                      style={{
                        fontSize: `${fontSize.body - 1}px`,
                        color: "#000000",
                        whiteSpace: "nowrap",
                        marginLeft: "16px",
                      }}
                    >
                      {edu.graduationDate}
                    </div>
                  </div>
                  
                  <div style={{ fontSize: `${fontSize.body}px` }}>
                    {edu.degree}
                  </div>
                  
                  {edu.gpa && (
                    <div style={{ fontSize: `${fontSize.body - 1}px`, marginTop: "2px" }}>
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

          {/* Skills (if not using skillGroups) */}
          {skillsData && skillsData.length > 0 && (!data.skillGroups || data.skillGroups.length === 0) && (
            <div className="mb-5">
              <div
                style={{
                  borderBottom: "2px solid #000000",
                  paddingBottom: "3px",
                  marginBottom: "8px",
                }}
              >
                <h2
                  style={{
                    fontFamily: fonts.primary, // Primary font for section titles
                    fontSize: `${fontSize.sectionTitles}px`,
                    fontWeight: fontWeight.sectionTitles,
                    color: "#000000",
                  }}
                >
                  Skills
                </h2>
              </div>
              
              <div>{skillsData.map((skill) => skill.name).join(", ")}</div>
            </div>
          )}

          {/* Page Number */}
          <div
            style={{
              position: "absolute",
              bottom: "32px",
              right: "56px",
              fontSize: `${fontSize.body - 2}px`,
              color: "#000000",
            }}
          >
            1
          </div>
        </div>
      </div>
    );
  }
);

SeoulTemplate.displayName = "SeoulTemplate";

export default SeoulTemplate;