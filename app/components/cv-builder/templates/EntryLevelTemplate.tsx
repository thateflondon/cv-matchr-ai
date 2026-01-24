import { forwardRef } from "react";
import type { CVData, CVCustomization } from "~/types/cv-builder";

export interface EntryLevelTemplateProps {
  data: CVData;
  customization: CVCustomization;
}

/**
 * Entry Level Template - Clean single-column format for early career professionals
 * Simple layout: Name, Job Title, Contact inline, Profile, Experience, Education, Skills (inline)
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
        {/* Header - Name, Job Title, Contact inline */}
        <div style={{ marginBottom: spacing.sections + "px", borderBottom: "2px solid #e5e7eb", paddingBottom: "20px" }}>
          <h1
            style={{
              fontFamily: fonts.primary,
              fontSize: `${fontSize.primaryHeading}px`,
              fontWeight: fontWeight.primaryHeading,
              marginBottom: "8px",
              color: "#000000",
              letterSpacing: "0px",
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
                marginBottom: "12px",
                color: "#555555",
              }}
            >
              {personalDetails.jobTitle}
            </div>
          )}

          {/* Contact Info - Inline with bullets */}
          <div
            style={{
              fontSize: `${fontSize.body - 1}px`,
              color: "#666666",
              display: "flex",
              flexWrap: "wrap",
              gap: "4px",
            }}
          >
            {personalDetails?.location && <span>{personalDetails.location}</span>}
            {personalDetails?.location && (personalDetails?.email || personalDetails?.phone || personalDetails?.linkedin) && <span> • </span>}
            {personalDetails?.email && <span>{personalDetails.email}</span>}
            {personalDetails?.email && (personalDetails?.phone || personalDetails?.linkedin) && <span> • </span>}
            {personalDetails?.phone && <span>{personalDetails.phone}</span>}
            {personalDetails?.phone && personalDetails?.linkedin && <span> • </span>}
            {personalDetails?.linkedin && <span>{personalDetails.linkedin}</span>}
          </div>
        </div>

        {/* Profile / Summary */}
        {professionalSummary && (
          <div style={{ marginBottom: spacing.sections + "px" }}>
            <h2
              style={{
                fontFamily: fonts.primary,
                fontSize: `${fontSize.secondaryHeading}px`,
                fontWeight: fontWeight.secondaryHeading,
                marginBottom: "10px",
                color: "#000000",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Profile
            </h2>
            <div style={{ color: "#333333" }}>
              {professionalSummary}
            </div>
          </div>
        )}

        {/* Experience */}
        {professionalExperience && professionalExperience.length > 0 && (
          <div style={{ marginBottom: spacing.sections + "px" }}>
            <h2
              style={{
                fontFamily: fonts.primary,
                fontSize: `${fontSize.secondaryHeading}px`,
                fontWeight: fontWeight.secondaryHeading,
                marginBottom: "10px",
                color: "#000000",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Experience
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
                      display: "block",
                    }}
                  >
                    {exp.company}
                  </strong>
                  <div style={{ color: "#555555", fontSize: `${fontSize.body - 1}px` }}>
                    {exp.jobTitle}
                  </div>
                  {(exp.startDate || exp.endDate) && (
                    <div style={{ color: "#777777", fontSize: `${fontSize.body - 1}px`, fontStyle: "italic" }}>
                      {exp.startDate} {exp.endDate && `- ${exp.endDate}`}
                    </div>
                  )}
                </div>
                {exp.achievements && exp.achievements.length > 0 && (
                  <ul style={{ paddingLeft: "20px", margin: "6px 0", color: "#444444" }}>
                    {exp.achievements.map((achievement, i) => (
                      <li key={i} style={{ marginBottom: "4px" }}>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                )}
                {(!exp.achievements || exp.achievements.length === 0) && exp.description && (
                  <div style={{ color: "#444444", marginTop: "6px" }}>
                    {exp.description}
                  </div>
                )}
              </div>
            ))}
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
                color: "#000000",
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
                  <div style={{ color: "#777777", fontSize: `${fontSize.body - 1}px`, fontStyle: "italic" }}>
                    {edu.graduationDate || `${edu.startDate} - ${edu.endDate}`}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Skills - Inline list */}
        {skillsData && skillsData.length > 0 && (
          <div style={{ marginBottom: spacing.sections + "px" }}>
            <h2
              style={{
                fontFamily: fonts.primary,
                fontSize: `${fontSize.secondaryHeading}px`,
                fontWeight: fontWeight.secondaryHeading,
                marginBottom: "10px",
                color: "#000000",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Skills
            </h2>
            <div style={{ color: "#444444" }}>
              {skillsData.map((skillGroup, groupIndex) => (
                <span key={groupIndex}>
                  {skillGroup.items?.join(", ")}
                  {groupIndex < skillsData.length - 1 && ", "}
                </span>
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