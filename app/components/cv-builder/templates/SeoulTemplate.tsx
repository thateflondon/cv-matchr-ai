import { forwardRef } from "react";
import type { BaseTemplateProps } from "./BaseTemplate";
import { formatDate } from "~/utils/dateFormatter";

/**
 * Seoul Template (Pure ATS)
 * - Photo top-left with name beside it
 * - Contact info inline with | separators
 * - Gray section header underlines
 * - Minimal, clean design
 * - Italic dates, serif-style headings
 * - Single column, lots of whitespace
 */
const SeoulTemplate = forwardRef<HTMLDivElement, BaseTemplateProps>(
  ({ data, customization }, ref) => {
    const { fontSize, fontWeight, spacing, fonts, dateFormat, margins } = customization;
    const { personalDetails, professionalSummary, professionalExperience, education, skillsData } = data;

    // A4 dimensions
    const a4Height = 842;

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
          fontFamily: fonts.secondary,
          lineHeight: `${spacing.lineHeight}%`,
          fontSize: `${fontSize.body}px`,
          fontWeight: fontWeight.body,
          color: "#000000",
          paddingTop: `${topBottomMargin}px`,
          paddingBottom: `${topBottomMargin}px`,
          paddingLeft: `${leftRightMargin}px`,
          paddingRight: `${leftRightMargin}px`,
        }}
      >
        {/* Header - Photo left, Name right */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "20px", marginBottom: `${sectionSpacing}px` }}>
          {/* Photo */}
          {personalDetails?.photo && (
            <div
              style={{
                width: "90px",
                height: "90px",
                flexShrink: 0,
              }}
            >
              <img
                src={personalDetails.photo}
                alt="Profile"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          )}

          {/* Name and Contact */}
          <div style={{ flex: 1 }}>
            <h1
              style={{
                fontFamily: "'Georgia', 'Times New Roman', serif",
                fontSize: `${fontSize.primaryHeading + 6}px`,
                fontWeight: "700",
                color: "#000000",
                marginBottom: "8px",
              }}
            >
              {personalDetails?.firstName} {personalDetails?.lastName}
            </h1>

            {/* Contact Info - Single Line with | separators */}
            <div
              style={{
                fontSize: `${fontSize.body}px`,
                color: "#333333",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              {personalDetails?.location && <span>{personalDetails.location}</span>}
              {personalDetails?.location && (personalDetails?.email || personalDetails?.phone || personalDetails?.linkedin) && (
                <span style={{ margin: "0 8px", color: "#666666" }}>|</span>
              )}
              {personalDetails?.email && <span>{personalDetails.email}</span>}
              {personalDetails?.email && (personalDetails?.phone || personalDetails?.linkedin) && (
                <span style={{ margin: "0 8px", color: "#666666" }}>|</span>
              )}
              {personalDetails?.phone && <span>{personalDetails.phone}</span>}
              {personalDetails?.phone && personalDetails?.linkedin && (
                <span style={{ margin: "0 8px", color: "#666666" }}>|</span>
              )}
              {personalDetails?.linkedin && <span>{personalDetails.linkedin}</span>}
            </div>
          </div>
        </div>

        {/* Professional Summary */}
        {professionalSummary && (
          <div style={{ marginBottom: `${sectionSpacing}px` }}>
            <h2
              style={{
                fontFamily: "'Georgia', 'Times New Roman', serif",
                fontSize: `${fontSize.sectionTitles + 2}px`,
                fontWeight: "400",
                fontStyle: "italic",
                color: "#000000",
                marginBottom: "8px",
                paddingBottom: "6px",
                borderBottom: "1px solid #cccccc",
              }}
            >
              Professional Summary
            </h2>
            <p style={{ color: "#333333", textAlign: "justify", lineHeight: "1.6" }}>
              {professionalSummary}
            </p>
          </div>
        )}

        {/* Professional Experience */}
        {professionalExperience && professionalExperience.length > 0 && (
          <div style={{ marginBottom: `${sectionSpacing}px` }}>
            <h2
              style={{
                fontFamily: "'Georgia', 'Times New Roman', serif",
                fontSize: `${fontSize.sectionTitles + 2}px`,
                fontWeight: "400",
                fontStyle: "italic",
                color: "#000000",
                marginBottom: "12px",
                paddingBottom: "6px",
                borderBottom: "1px solid #cccccc",
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
                  {/* Company, Position, Location */}
                  <div style={{ marginBottom: "2px" }}>
                    <strong
                      style={{
                        fontFamily: "'Georgia', 'Times New Roman', serif",
                        fontSize: `${fontSize.body + 1}px`,
                        fontWeight: "700",
                        color: "#000000",
                      }}
                    >
                      {exp.company}, {exp.jobTitle}
                      {exp.location && `, ${exp.location}`}
                    </strong>
                  </div>

                  {/* Date in italic */}
                  {(exp.startDate || exp.endDate) && (
                    <div
                      style={{
                        fontSize: `${fontSize.body}px`,
                        fontStyle: "italic",
                        color: "#666666",
                        marginBottom: "6px",
                      }}
                    >
                      {dateString}
                    </div>
                  )}

                  {/* Achievements/Responsibilities with bullet points */}
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul style={{ paddingLeft: "18px", margin: "0", color: "#333333" }}>
                      {exp.achievements.map((achievement, i) => (
                        <li key={i} style={{ marginBottom: "4px", lineHeight: "1.5" }}>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Fallback: Show description if no achievements */}
                  {(!exp.achievements || exp.achievements.length === 0) && exp.description && (
                    <p style={{ color: "#333333", lineHeight: "1.5" }}>{exp.description}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Consultancy Section (if there are additional sections) */}
        {data.additionalSections && data.additionalSections.length > 0 && (
          <>
            {data.additionalSections.map((section) => (
              <div key={section.id} style={{ marginBottom: `${sectionSpacing}px` }}>
                <h2
                  style={{
                    fontFamily: "'Georgia', 'Times New Roman', serif",
                    fontSize: `${fontSize.sectionTitles + 2}px`,
                    fontWeight: "400",
                    fontStyle: "italic",
                    color: "#000000",
                    marginBottom: "12px",
                    paddingBottom: "6px",
                    borderBottom: "1px solid #cccccc",
                  }}
                >
                  {section.title}
                </h2>

                {Array.isArray(section.content) ? (
                  <ul style={{ paddingLeft: "18px", margin: "0", color: "#333333" }}>
                    {section.content.map((item, index) => (
                      <li key={index} style={{ marginBottom: "4px", lineHeight: "1.5" }}>
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ color: "#333333", lineHeight: "1.5" }}>{section.content}</p>
                )}
              </div>
            ))}
          </>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <div style={{ marginBottom: `${sectionSpacing}px` }}>
            <h2
              style={{
                fontFamily: "'Georgia', 'Times New Roman', serif",
                fontSize: `${fontSize.sectionTitles + 2}px`,
                fontWeight: "400",
                fontStyle: "italic",
                color: "#000000",
                marginBottom: "12px",
                paddingBottom: "6px",
                borderBottom: "1px solid #cccccc",
              }}
            >
              Education
            </h2>

            {education.map((edu, index) => (
              <div key={index} style={{ marginBottom: `${contentBlockSpacing - 4}px` }}>
                <strong
                  style={{
                    fontFamily: "'Georgia', 'Times New Roman', serif",
                    fontSize: `${fontSize.body + 1}px`,
                    fontWeight: "700",
                    color: "#000000",
                    display: "block",
                  }}
                >
                  {edu.degree}, {edu.institution}
                </strong>
                {edu.graduationDate && (
                  <div
                    style={{
                      fontSize: `${fontSize.body}px`,
                      fontStyle: "italic",
                      color: "#666666",
                    }}
                  >
                    {formatDate(edu.graduationDate, dateFormat)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Expert-Level Skills */}
        {((skillsData && skillsData.length > 0) || (data.skillGroups && data.skillGroups.length > 0)) && (
          <div style={{ marginBottom: `${sectionSpacing}px` }}>
            <h2
              style={{
                fontFamily: "'Georgia', 'Times New Roman', serif",
                fontSize: `${fontSize.sectionTitles + 2}px`,
                fontWeight: "400",
                fontStyle: "italic",
                color: "#000000",
                marginBottom: "12px",
                paddingBottom: "6px",
                borderBottom: "1px solid #cccccc",
              }}
            >
              Expert-Level Skills
            </h2>

            {/* Skill Groups with labels */}
            {data.skillGroups && data.skillGroups.length > 0 ? (
              <div style={{ color: "#333333" }}>
                {data.skillGroups.map((group, index) => (
                  <div key={index} style={{ marginBottom: "6px", lineHeight: "1.5" }}>
                    {group.title && (
                      <strong style={{ color: "#000000" }}>{group.title}: </strong>
                    )}
                    <span>{group.skills.join(", ")}</span>
                  </div>
                ))}
              </div>
            ) : (
              /* Fallback to skills list */
              <div style={{ color: "#333333", lineHeight: "1.5" }}>
                {skillsData?.map((skill) => skill.name).join(", ")}
              </div>
            )}
          </div>
        )}

        {/* Languages */}
        {data.languages && data.languages.length > 0 && (
          <div style={{ marginBottom: `${sectionSpacing}px` }}>
            <h2
              style={{
                fontFamily: "'Georgia', 'Times New Roman', serif",
                fontSize: `${fontSize.sectionTitles + 2}px`,
                fontWeight: "400",
                fontStyle: "italic",
                color: "#000000",
                marginBottom: "12px",
                paddingBottom: "6px",
                borderBottom: "1px solid #cccccc",
              }}
            >
              Languages
            </h2>

            <div style={{ color: "#333333", lineHeight: "1.5" }}>
              {data.languages.map((lang) => (lang.level ? `${lang.language} (${lang.level})` : lang.language)).join(", ")}
            </div>
          </div>
        )}
      </div>
    );
  }
);

SeoulTemplate.displayName = "SeoulTemplate";

export default SeoulTemplate;
