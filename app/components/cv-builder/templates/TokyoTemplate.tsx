import { forwardRef } from "react";
import type { BaseTemplateProps } from "./BaseTemplate";

/**
 * Tokyo Template (Modern)
 * - Modern design with photo
 * - Blue underlined section titles
 * - Two-column layout for some sections
 * - Clean and professional
 */
const TokyoTemplate = forwardRef<HTMLDivElement, BaseTemplateProps>(
  ({ data, customization }, ref) => {
    const { primaryColor, fontSize, fontWeight, spacing } = customization;
    const { personalDetails, professionalSummary, professionalExperience, education, skillsData, languages } = data;

    // A4 dimensions
    const a4Width = 595;
    const a4Height = 842;

    return (
      <div
        ref={ref}
        data-cv-preview="true"
        className="bg-white"
        style={{
          width: `${a4Width}px`,
          minHeight: `${a4Height}px`,
          fontFamily: "Arial, sans-serif",
          lineHeight: `${spacing.lineHeight}%`,
          fontSize: `${fontSize.body}px`,
          color: "#000000",
          padding: "40px 48px",
        }}
      >
        {/* Header with Photo */}
        <div className="flex gap-6 mb-6">
          {/* Photo */}
          {personalDetails?.photo && (
            <div
              style={{
                width: "80px",
                height: "80px",
                flexShrink: 0,
                overflow: "hidden",
                borderRadius: "4px",
              }}
            >
              <img
                src={personalDetails.photo}
                alt={`${personalDetails.firstName} ${personalDetails.lastName}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          )}

          {/* Name and Contact */}
          <div className="flex-1">
            <h1
              style={{
                fontSize: `${fontSize.primaryHeading}px`,
                fontWeight: fontWeight.primaryHeading,
                marginBottom: "4px",
                color: "#000000",
              }}
            >
              {personalDetails?.firstName} {personalDetails?.lastName}
            </h1>
            
            {personalDetails?.jobTitle && (
              <div
                style={{
                  fontSize: `${fontSize.secondaryHeading}px`,
                  fontWeight: fontWeight.secondaryHeading,
                  color: primaryColor,
                  marginBottom: "8px",
                }}
              >
                {personalDetails.jobTitle}
              </div>
            )}

            {/* Contact Info */}
            <div
              style={{
                fontSize: `${fontSize.body - 1}px`,
                color: "#666666",
                display: "flex",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              {personalDetails?.email && <span>{personalDetails.email}</span>}
              {personalDetails?.phone && <span>• {personalDetails.phone}</span>}
              {personalDetails?.location && <span>• {personalDetails.location}</span>}
              {personalDetails?.linkedin && <span>• {personalDetails.linkedin}</span>}
            </div>
          </div>
        </div>

        {/* Professional Summary */}
        {professionalSummary && (
          <div className="mb-5">
            <div
              style={{
                borderBottom: `2px solid ${primaryColor}`,
                paddingBottom: "2px",
                marginBottom: "8px",
              }}
            >
              <h2
                style={{
                  fontSize: `${fontSize.sectionTitles}px`,
                  fontWeight: fontWeight.sectionTitles,
                  color: primaryColor,
                }}
              >
                PROFESSIONAL SUMMARY
              </h2>
            </div>
            <p style={{ textAlign: "justify" }}>{professionalSummary}</p>
          </div>
        )}

        {/* Professional Experience */}
        {professionalExperience && professionalExperience.length > 0 && (
          <div className="mb-5">
            <div
              style={{
                borderBottom: `2px solid ${primaryColor}`,
                paddingBottom: "2px",
                marginBottom: "8px",
              }}
            >
              <h2
                style={{
                  fontSize: `${fontSize.sectionTitles}px`,
                  fontWeight: fontWeight.sectionTitles,
                  color: primaryColor,
                }}
              >
                PROFESSIONAL EXPERIENCE
              </h2>
            </div>
            
            {professionalExperience.map((exp, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex-1">
                    <div
                      style={{
                        fontSize: `${fontSize.body}px`,
                        fontWeight: "600",
                      }}
                    >
                      {exp.jobTitle}
                    </div>
                    <div
                      style={{
                        fontSize: `${fontSize.body}px`,
                        color: "#666666",
                      }}
                    >
                      {exp.company}
                      {exp.location && `, ${exp.location}`}
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
                    {exp.startDate} - {exp.endDate || "Present"}
                  </div>
                </div>
                
                {exp.description && (
                  <p style={{ marginBottom: "6px", color: "#333333" }}>
                    {exp.description}
                  </p>
                )}
                
                {exp.achievements && exp.achievements.length > 0 && (
                  <ul style={{ paddingLeft: "20px", margin: "4px 0" }}>
                    {exp.achievements.map((achievement, i) => (
                      <li key={i} style={{ marginBottom: "3px", color: "#333333" }}>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Two Column Section: Education & Languages */}
        <div className="grid grid-cols-2 gap-6 mb-5">
          {/* Education */}
          {education && education.length > 0 && (
            <div>
              <div
                style={{
                  borderBottom: `2px solid ${primaryColor}`,
                  paddingBottom: "2px",
                  marginBottom: "8px",
                }}
              >
                <h2
                  style={{
                    fontSize: `${fontSize.sectionTitles}px`,
                    fontWeight: fontWeight.sectionTitles,
                    color: primaryColor,
                  }}
                >
                  EDUCATION
                </h2>
              </div>
              
              {education.map((edu, index) => (
                <div key={index} className="mb-3">
                  <div
                    style={{
                      fontSize: `${fontSize.body}px`,
                      fontWeight: "600",
                    }}
                  >
                    {edu.degree}
                  </div>
                  <div
                    style={{
                      fontSize: `${fontSize.body - 1}px`,
                      color: "#666666",
                    }}
                  >
                    {edu.institution}
                  </div>
                  <div
                    style={{
                      fontSize: `${fontSize.body - 1}px`,
                      color: "#999999",
                    }}
                  >
                    {edu.graduationDate}
                  </div>
                  {edu.gpa && (
                    <div style={{ fontSize: `${fontSize.body - 1}px`, color: "#666666" }}>
                      GPA: {edu.gpa}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Languages */}
          {languages && languages.length > 0 && (
            <div>
              <div
                style={{
                  borderBottom: `2px solid ${primaryColor}`,
                  paddingBottom: "2px",
                  marginBottom: "8px",
                }}
              >
                <h2
                  style={{
                    fontSize: `${fontSize.sectionTitles}px`,
                    fontWeight: fontWeight.sectionTitles,
                    color: primaryColor,
                  }}
                >
                  LANGUAGES
                </h2>
              </div>
              
              {languages.map((lang) => (
                <div
                  key={lang.id}
                  className="flex justify-between mb-2"
                  style={{ fontSize: `${fontSize.body}px` }}
                >
                  <span>{lang.language}</span>
                  <span style={{ color: "#666666" }}>{lang.level}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Skills */}
        {skillsData && skillsData.length > 0 && (
          <div className="mb-5">
            <div
              style={{
                borderBottom: `2px solid ${primaryColor}`,
                paddingBottom: "2px",
                marginBottom: "8px",
              }}
            >
              <h2
                style={{
                  fontSize: `${fontSize.sectionTitles}px`,
                  fontWeight: fontWeight.sectionTitles,
                  color: primaryColor,
                }}
              >
                SKILLS
              </h2>
            </div>
            
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
              {skillsData.map((skill) => (
                <span
                  key={skill.id}
                  style={{
                    padding: "4px 12px",
                    backgroundColor: "#f0f0f0",
                    borderRadius: "4px",
                    fontSize: `${fontSize.body - 1}px`,
                  }}
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
);

TokyoTemplate.displayName = "TokyoTemplate";

export default TokyoTemplate;