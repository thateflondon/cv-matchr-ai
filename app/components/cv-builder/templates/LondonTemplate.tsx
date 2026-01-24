import { forwardRef } from "react";
import type { BaseTemplateProps } from "./BaseTemplate";

/**
 * London Template (Classic)
 * - Square photo in top left
 * - Contact info on one line below name and photo
 * - Thick black horizontal lines under section titles
 * - Traditional professional layout
 */
const LondonTemplate = forwardRef<HTMLDivElement, BaseTemplateProps>(
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
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            paddingBottom: "16px",
            marginBottom: "20px",
            borderBottom: "2px solid #000000",
          }}
        >
          <h1
            style={{
              fontFamily: fonts.primary, // Primary font for main heading
              fontSize: `${fontSize.primaryHeading}px`,
              fontWeight: fontWeight.primaryHeading,
              marginBottom: "8px",
              color: "#000000",
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
                color: "#333333",
                marginBottom: "8px",
              }}
            >
              {personalDetails.jobTitle}
            </div>
          )}
          
          {/* Contact Info - Single Line */}
          <div
            style={{
              fontSize: `${fontSize.body - 1}px`,
              color: "#333333",
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
                Professional Summary
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
                <div className="mb-1">
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
                    marginBottom: "6px",
                  }}
                >
                  {exp.startDate} - {exp.endDate || "Present"}
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

        {/* Consultancy (if additional sections exist) */}
        {data.additionalSections && data.additionalSections.length > 0 && (
          <div className="mb-5">
            {data.additionalSections.map((section, index) => (
              <div key={section.id || index} className="mb-5">
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
                    {section.title}
                  </h2>
                </div>
                
                {typeof section.content === "string" ? (
                  <p>{section.content}</p>
                ) : (
                  <ul style={{ paddingLeft: "20px" }}>
                    {section.content.map((item, i) => (
                      <li key={i} style={{ marginBottom: "3px" }}>
                        {item}
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
                <div className="mb-1">
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
                  }}
                >
                  {edu.graduationDate}
                </div>
                
                {edu.gpa && (
                  <div style={{ fontSize: `${fontSize.body - 1}px`, color: "#666666", marginTop: "2px" }}>
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

        {/* Expert-Level Skills */}
        {skillsData && skillsData.length > 0 && (
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
                Expert-Level Skills
              </h2>
            </div>
            
            <div>
              {data.skillGroups && data.skillGroups.length > 0 ? (
                data.skillGroups.map((group, index) => (
                  <div key={index} style={{ marginBottom: "6px" }}>
                    {group.title && (
                      <strong>{group.title}: </strong>
                    )}
                    <span>{group.skills.join(", ")}</span>
                  </div>
                ))
              ) : (
                <div>{skillsData.map((skill) => skill.name).join(", ")}</div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
);

LondonTemplate.displayName = "LondonTemplate";

export default LondonTemplate;