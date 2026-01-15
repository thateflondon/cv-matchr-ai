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
    const { primaryColor, fontSize, fontWeight, spacing } = customization;
    const { personalDetails, professionalSummary, professionalExperience, education, skillsData } = data;

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
          fontFamily: "Georgia, serif",
          lineHeight: `${spacing.lineHeight}%`,
          fontSize: `${fontSize.body}px`,
          color: "#000000",
          padding: "40px 56px",
        }}
      >
        {/* Header with Photo */}
        <div className="mb-5">
          <div className="flex gap-4 items-start mb-3">
            {/* Photo */}
            {personalDetails?.photo && (
              <div
                style={{
                  width: "68px",
                  height: "68px",
                  flexShrink: 0,
                  overflow: "hidden",
                  borderRadius: "2px",
                  border: "1px solid #e0e0e0",
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

            {/* Name */}
            <div className="flex-1">
              <h1
                style={{
                  fontSize: `${fontSize.primaryHeading}px`,
                  fontWeight: fontWeight.primaryHeading,
                  color: "#000000",
                  marginTop: "8px",
                }}
              >
                {personalDetails?.firstName} {personalDetails?.lastName}
              </h1>
            </div>
          </div>

          {/* Contact Info - Single Line */}
          <div
            style={{
              fontSize: `${fontSize.body - 1}px`,
              color: "#333333",
              marginLeft: personalDetails?.photo ? "84px" : "0",
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