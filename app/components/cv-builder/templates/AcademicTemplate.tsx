import { forwardRef } from "react";
import type { CVData, CVCustomization } from "~/types/cv-builder";
import { formatDate } from "~/utils/dateFormatter";

export interface AcademicTemplateProps {
  data: CVData;
  customization: CVCustomization;
}

/**
 * Academic Template - Based on academic-template.jpg design
 * - Blue (#0369a1) name and accents
 * - Contact info top-right aligned on two lines
 * - Section headers with blue text + blue underline
 * - "Selected Achievements" bullet section
 * - "Education and Credentials" section
 * - Dates right-aligned
 * - Page number bottom-right
 */
const AcademicTemplate = forwardRef<HTMLDivElement, AcademicTemplateProps>(
  ({ data, customization }, ref) => {
    const { primaryColor, fontSize, margins, dateFormat } = customization;
    const { personalDetails, professionalSummary, selectedAchievements, professionalExperience, education } = data;

    // A4 dimensions
    const a4Height = 842;

    // Use primary color or default blue
    const accentColor = primaryColor || "#0369a1";

    // Extract margin values with fallbacks
    const topBottomMargin = (margins?.topBottom ?? 0.6) * 72;
    const leftRightMargin = (margins?.leftRight ?? 0.6) * 72;
    const sectionSpacing = margins?.betweenSections ?? 24;
    const contentBlockSpacing = margins?.betweenContentBlocks ?? 16;

    return (
      <div
        ref={ref}
        data-cv-preview="true"
        className="bg-white w-full"
        style={{
          minHeight: `${a4Height}px`,
          fontFamily: "'Arial', sans-serif",
          fontSize: `${fontSize.body}px`,
          color: "#374151",
          paddingTop: `${topBottomMargin}px`,
          paddingBottom: `${topBottomMargin}px`,
          paddingLeft: `${leftRightMargin}px`,
          paddingRight: `${leftRightMargin}px`,
          position: "relative",
        }}
      >
        {/* Header - Name left, Contact right */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: `${sectionSpacing}px`,
          }}
        >
          {/* Left: Name and Job Title */}
          <div>
            <h1
              style={{
                fontSize: `${fontSize.primaryHeading + 8}px`,
                fontWeight: "700",
                color: accentColor,
                marginBottom: "4px",
                lineHeight: "1.1",
              }}
            >
              {personalDetails?.firstName} {personalDetails?.lastName}
            </h1>
            {personalDetails?.jobTitle && (
              <div
                style={{
                  fontSize: `${fontSize.body + 2}px`,
                  color: accentColor,
                }}
              >
                {personalDetails.jobTitle}
              </div>
            )}
          </div>

          {/* Right: Contact Info - Two lines */}
          <div style={{ textAlign: "right", fontSize: `${fontSize.body}px`, color: accentColor }}>
            {/* Line 1: Email • Phone */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "2px" }}>
              {personalDetails?.email && <span>{personalDetails.email}</span>}
              {personalDetails?.email && personalDetails?.phone && <span>&nbsp;•&nbsp;</span>}
              {personalDetails?.phone && <span>{personalDetails.phone}</span>}
            </div>

            {/* Line 2: LinkedIn • Location */}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              {personalDetails?.linkedin && <span>{personalDetails.linkedin}</span>}
              {personalDetails?.linkedin && personalDetails?.location && <span>&nbsp;•&nbsp;</span>}
              {personalDetails?.location && <span>{personalDetails.location}</span>}
            </div>
          </div>
        </div>

        {/* Professional Summary */}
        {professionalSummary && (
          <div style={{ marginBottom: `${sectionSpacing}px` }}>
            <p style={{ color: accentColor, lineHeight: "1.6", textAlign: "justify" }}>
              {professionalSummary}
            </p>
          </div>
        )}

        {/* Selected Achievements */}
        {selectedAchievements && selectedAchievements.length > 0 && (
          <div style={{ marginBottom: `${sectionSpacing}px` }}>
            <h2
              style={{
                fontSize: `${fontSize.sectionTitles + 4}px`,
                fontWeight: "700",
                color: accentColor,
                marginBottom: "12px",
                paddingBottom: "4px",
                borderBottom: `2px solid ${accentColor}`,
              }}
            >
              Selected Achievements
            </h2>
            <ul style={{ listStyle: "none", padding: "0", margin: "0" }}>
              {selectedAchievements.map((achievement, index) => (
                <li
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    marginBottom: "8px",
                    lineHeight: "1.5",
                  }}
                >
                  <span style={{ color: "#374151", marginRight: "12px", fontSize: "8px", marginTop: "6px" }}>●</span>
                  <span style={{ color: "#374151" }}>{achievement}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Education and Credentials */}
        {education && education.length > 0 && (
          <div style={{ marginBottom: `${sectionSpacing}px` }}>
            <h2
              style={{
                fontSize: `${fontSize.sectionTitles + 4}px`,
                fontWeight: "700",
                color: accentColor,
                marginBottom: "12px",
                paddingBottom: "4px",
                borderBottom: `2px solid ${accentColor}`,
              }}
            >
              Education and Credentials
            </h2>

            {education.map((edu, index) => (
              <div key={index} style={{ marginBottom: `${contentBlockSpacing - 4}px` }}>
                <div style={{ color: accentColor, fontWeight: "600", marginBottom: "2px" }}>
                  {edu.degree}
                </div>
                <div style={{ color: "#374151", marginLeft: "16px" }}>
                  {edu.institution}
                  {edu.location && `, ${edu.location}`}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Professional Experience */}
        {professionalExperience && professionalExperience.length > 0 && (
          <div style={{ marginBottom: `${sectionSpacing}px` }}>
            <h2
              style={{
                fontSize: `${fontSize.sectionTitles + 4}px`,
                fontWeight: "700",
                color: accentColor,
                marginBottom: "12px",
                paddingBottom: "4px",
                borderBottom: `2px solid ${accentColor}`,
              }}
            >
              Professional Experience
            </h2>

            {professionalExperience.map((exp, index) => {
              const formattedStartDate = formatDate(exp.startDate, dateFormat);
              const formattedEndDate = exp.endDate ? formatDate(exp.endDate, dateFormat) : "Present";
              const dateString = `${formattedStartDate} – ${formattedEndDate}`;

              return (
                <div key={index} style={{ marginBottom: `${contentBlockSpacing}px` }}>
                  {/* Header: Company, Job Title with Date right-aligned */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      marginBottom: "4px",
                    }}
                  >
                    <div>
                      <span style={{ color: accentColor, fontWeight: "600" }}>
                        {exp.jobTitle}, {exp.company}
                        {exp.location && `, ${exp.location}`}
                      </span>
                    </div>
                    {(exp.startDate || exp.endDate) && (
                      <div style={{ color: accentColor, whiteSpace: "nowrap", marginLeft: "16px" }}>
                        {dateString}
                      </div>
                    )}
                  </div>

                  {/* Sub-header with company name again in colored text (matching design) */}
                  <div
                    style={{
                      color: accentColor,
                      marginBottom: "8px",
                      marginLeft: "16px",
                    }}
                  >
                    {exp.company}
                    {(exp.startDate || exp.endDate) && ` (${dateString})`}
                  </div>

                  {/* Description */}
                  {exp.description && (
                    <p style={{ color: "#374151", marginBottom: "8px", lineHeight: "1.5" }}>
                      {exp.description}
                    </p>
                  )}

                  {/* Achievements with bullets */}
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul style={{ listStyle: "none", padding: "0", margin: "0", marginLeft: "16px" }}>
                      {exp.achievements.map((achievement, i) => (
                        <li
                          key={i}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            marginBottom: "6px",
                            lineHeight: "1.5",
                          }}
                        >
                          <span style={{ color: "#374151", marginRight: "12px", fontSize: "8px", marginTop: "6px" }}>●</span>
                          <span style={{ color: "#374151" }}>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Skills */}
        {data.skillsData && data.skillsData.length > 0 && (
          <div style={{ marginBottom: `${sectionSpacing}px` }}>
            <h2
              style={{
                fontSize: `${fontSize.sectionTitles + 4}px`,
                fontWeight: "700",
                color: accentColor,
                marginBottom: "12px",
                paddingBottom: "4px",
                borderBottom: `2px solid ${accentColor}`,
              }}
            >
              Skills
            </h2>
            <div style={{ color: "#374151", lineHeight: "1.6" }}>
              {data.skillsData.map((skill) => skill.name).join(", ")}
            </div>
          </div>
        )}

        {/* Languages */}
        {data.languages && data.languages.length > 0 && (
          <div style={{ marginBottom: `${sectionSpacing}px` }}>
            <h2
              style={{
                fontSize: `${fontSize.sectionTitles + 4}px`,
                fontWeight: "700",
                color: accentColor,
                marginBottom: "12px",
                paddingBottom: "4px",
                borderBottom: `2px solid ${accentColor}`,
              }}
            >
              Languages
            </h2>
            <div style={{ color: "#374151", lineHeight: "1.6" }}>
              {data.languages.map((lang) => (lang.level ? `${lang.language} (${lang.level})` : lang.language)).join(", ")}
            </div>
          </div>
        )}

        {/* Page number - bottom right */}
        <div
          style={{
            position: "absolute",
            bottom: `${topBottomMargin}px`,
            right: `${leftRightMargin}px`,
            fontSize: `${fontSize.body - 1}px`,
            color: accentColor,
          }}
        >
          Page 1 | 3
        </div>
      </div>
    );
  }
);

AcademicTemplate.displayName = "AcademicTemplate";

export default AcademicTemplate;
