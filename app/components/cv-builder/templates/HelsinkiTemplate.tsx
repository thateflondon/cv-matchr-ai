import { forwardRef } from "react";
import type { BaseTemplateProps } from "./BaseTemplate";

/**
 * Helsinki Template (Prime ATS)
 * - Header: Name, Job Title, Contact inline
 * - Profile/Summary: Full width
 * - Two columns: Experience (left) | Skills + Education (right)
 */
const HelsinkiTemplate = forwardRef<HTMLDivElement, BaseTemplateProps>(
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
        className="bg-white w-full"
        style={{
          minHeight: `${a4Height}px`,
          fontFamily: fonts.secondary,
          lineHeight: `${spacing.lineHeight}%`,
          fontSize: `${fontSize.body}px`,
          fontWeight: fontWeight.body,
          color: "#000000",
          padding: "40px",
        }}
      >
        {/* Header - Name, Job Title, Contact inline */}
        <div style={{ marginBottom: spacing.sections + "px", borderBottom: "2px solid #e5e7eb", paddingBottom: "16px" }}>
          <h1
            style={{
              fontFamily: fonts.primary,
              fontSize: `${fontSize.primaryHeading}px`,
              fontWeight: fontWeight.primaryHeading,
              marginBottom: "6px",
              color: "#000000",
            }}
          >
            {personalDetails?.firstName} {personalDetails?.lastName}
          </h1>

          {personalDetails?.jobTitle && (
            <div
              style={{
                fontFamily: fonts.primary,
                fontSize: `${fontSize.secondaryHeading - 2}px`,
                fontWeight: fontWeight.body,
                marginBottom: "10px",
                color: "#555555",
              }}
            >
              {personalDetails.jobTitle}
            </div>
          )}
          
          {/* Contact Info - Single Line with bullets */}
          <div
            style={{
              fontSize: `${fontSize.body - 1}px`,
              color: "#666666",
              display: "flex",
              flexWrap: "wrap",
              gap: "4px",
            }}
          >
            {personalDetails?.email && <span>{personalDetails.email}</span>}
            {personalDetails?.email && (personalDetails?.phone || personalDetails?.location || personalDetails?.linkedin) && <span> • </span>}
            {personalDetails?.phone && <span>{personalDetails.phone}</span>}
            {personalDetails?.phone && (personalDetails?.location || personalDetails?.linkedin) && <span> • </span>}
            {personalDetails?.location && <span>{personalDetails.location}</span>}
            {personalDetails?.location && personalDetails?.linkedin && <span> • </span>}
            {personalDetails?.linkedin && <span>{personalDetails.linkedin}</span>}
          </div>
        </div>

        {/* Professional Summary - Full Width */}
        {professionalSummary && (
          <div style={{ marginBottom: spacing.sections + "px" }}>
            <h2
              style={{
                fontFamily: fonts.primary,
                fontSize: `${fontSize.secondaryHeading}px`,
                fontWeight: fontWeight.secondaryHeading,
                color: "#000000",
                marginBottom: "10px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Profile
            </h2>
            <p style={{ color: "#333333" }}>{professionalSummary}</p>
          </div>
        )}

        {/* Two Column Layout: Experience | Skills + Education */}
        <div style={{ display: "flex", gap: "40px" }}>
          {/* Left Column - Experience */}
          <div style={{ flex: "1.5" }}>
            {professionalExperience && professionalExperience.length > 0 && (
              <div>
                <h2
                  style={{
                    fontFamily: fonts.primary,
                    fontSize: `${fontSize.secondaryHeading}px`,
                    fontWeight: fontWeight.secondaryHeading,
                    color: "#000000",
                    marginBottom: "10px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Experience
                </h2>
                
                {professionalExperience.map((exp, index) => (
                  <div key={index} style={{ marginBottom: spacing.items + "px" }}>
                    <div style={{ marginBottom: "4px" }}>
                      <strong
                        style={{
                          fontFamily: fonts.primary,
                          fontSize: `${fontSize.body}px`,
                          fontWeight: fontWeight.sectionHeading,
                          color: "#000000",
                          display: "block",
                        }}
                      >
                        {exp.company}
                      </strong>
                      <div style={{ color: "#555555", fontSize: `${fontSize.body - 1}px` }}>
                        {exp.jobTitle}
                      </div>
                      {(exp.startDate || exp.endDate) && (
                        <div
                          style={{
                            fontSize: `${fontSize.body - 1}px`,
                            fontStyle: "italic",
                            color: "#777777",
                          }}
                        >
                          {exp.startDate} - {exp.endDate || "Present"}
                        </div>
                      )}
                    </div>
                    
                    {/* Achievements/Responsibilities */}
                    {exp.achievements && exp.achievements.length > 0 && (
                      <ul style={{ paddingLeft: "20px", margin: "6px 0", color: "#444444" }}>
                        {exp.achievements.map((achievement, i) => (
                          <li key={i} style={{ marginBottom: "4px" }}>
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    )}
                    
                    {/* Fallback: Show description if no achievements */}
                    {(!exp.achievements || exp.achievements.length === 0) && exp.description && (
                      <p style={{ marginTop: "6px", color: "#444444" }}>{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Skills + Education */}
          <div style={{ flex: "1", minWidth: "250px" }}>
            {/* Skills */}
            {skillsData && skillsData.length > 0 && (
              <div style={{ marginBottom: spacing.sections + "px" }}>
                <h2
                  style={{
                    fontFamily: fonts.primary,
                    fontSize: `${fontSize.secondaryHeading}px`,
                    fontWeight: fontWeight.secondaryHeading,
                    color: "#000000",
                    marginBottom: "10px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Skills
                </h2>
                
                <div>
                  {skillsData.map((skillGroup, index) => (
                    <div key={index} style={{ marginBottom: "8px" }}>
                      {skillGroup.category && (
                        <div
                          style={{
                            fontWeight: fontWeight.sectionHeading,
                            color: "#000000",
                            marginBottom: "2px",
                            fontSize: `${fontSize.body - 1}px`,
                          }}
                        >
                          {skillGroup.category}
                        </div>
                      )}
                      <div style={{ color: "#555555", fontSize: `${fontSize.body - 1}px` }}>
                        {skillGroup.items?.join(", ")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {education && education.length > 0 && (
              <div>
                <h2
                  style={{
                    fontFamily: fonts.primary,
                    fontSize: `${fontSize.secondaryHeading}px`,
                    fontWeight: fontWeight.secondaryHeading,
                    color: "#000000",
                    marginBottom: "10px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Education
                </h2>
                
                {education.map((edu, index) => (
                  <div key={index} style={{ marginBottom: spacing.items + "px" }}>
                    <strong
                      style={{
                        fontFamily: fonts.primary,
                        fontSize: `${fontSize.body}px`,
                        fontWeight: fontWeight.sectionHeading,
                        color: "#000000",
                        display: "block",
                        marginBottom: "2px",
                      }}
                    >
                      {edu.institution}
                    </strong>
                    {edu.degree && (
                      <div style={{ color: "#555555", fontSize: `${fontSize.body - 1}px` }}>
                        {edu.degree}
                      </div>
                    )}
                    {(edu.startDate || edu.endDate || edu.graduationDate) && (
                      <div
                        style={{
                          fontSize: `${fontSize.body - 1}px`,
                          fontStyle: "italic",
                          color: "#777777",
                        }}
                      >
                        {edu.graduationDate || `${edu.startDate} - ${edu.endDate}`}
                      </div>
                    )}
                    {edu.gpa && (
                      <div style={{ fontSize: `${fontSize.body - 1}px`, color: "#666666" }}>
                        GPA: {edu.gpa}
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

HelsinkiTemplate.displayName = "HelsinkiTemplate";

export default HelsinkiTemplate;