import { forwardRef } from "react";
import type { BaseTemplateProps } from "./BaseTemplate";
import { formatDate } from "~/utils/dateFormatter";

/**
 * Helsinki Template (Prime ATS)
 * - Blue (#2563eb) section headers with bottom border
 * - Photo top-right corner (optional)
 * - Large name, job title below in blue, contact inline with | separators
 * - Sections: SUMMARY, PROFESSIONAL EXPERIENCE, EDUCATION, TECHNICAL SKILLS, ADDITIONAL INFORMATION
 * - Skills in 4-column grid
 * - Single column layout
 */
const HelsinkiTemplate = forwardRef<HTMLDivElement, BaseTemplateProps>(
  ({ data, customization }, ref) => {
    const { fontSize, fontWeight, spacing, fonts, margins, dateFormat } = customization;
    const { personalDetails, professionalSummary, professionalExperience, education, skillsData, languages } = data;

    // A4 dimensions
    const a4Height = 842;

    // Blue accent color for this template
    const accentColor = "#2563eb";

    // Extract margin values with fallbacks
    const topBottomMargin = (margins?.topBottom ?? 0.6) * 72;
    const leftRightMargin = (margins?.leftRight ?? 0.6) * 72;
    const sectionSpacing = margins?.betweenSections ?? 20;
    const contentBlockSpacing = margins?.betweenContentBlocks ?? 14;

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
        {/* Header - Name, Job Title, Photo, Contact */}
        <div style={{ marginBottom: `${sectionSpacing}px` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            {/* Left: Name and Title */}
            <div style={{ flex: 1 }}>
              <h1
                style={{
                  fontFamily: fonts.primary,
                  fontSize: `${fontSize.primaryHeading + 4}px`,
                  fontWeight: "700",
                  marginBottom: "4px",
                  color: "#000000",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                {personalDetails?.firstName} {personalDetails?.lastName}
              </h1>

              {personalDetails?.jobTitle && (
                <div
                  style={{
                    fontFamily: fonts.primary,
                    fontSize: `${fontSize.secondaryHeading}px`,
                    fontWeight: "600",
                    marginBottom: "10px",
                    color: accentColor,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {personalDetails.jobTitle}
                </div>
              )}

              {/* Contact Info - Single Line with | separators */}
              <div
                style={{
                  fontSize: `${fontSize.body}px`,
                  color: "#333333",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "4px",
                  alignItems: "center",
                }}
              >
                {personalDetails?.location && <span>{personalDetails.location}</span>}
                {personalDetails?.location && (personalDetails?.phone || personalDetails?.email || personalDetails?.linkedin) && (
                  <span style={{ color: "#666666" }}> | </span>
                )}
                {personalDetails?.phone && <span>{personalDetails.phone}</span>}
                {personalDetails?.phone && (personalDetails?.email || personalDetails?.linkedin) && (
                  <span style={{ color: "#666666" }}> | </span>
                )}
                {personalDetails?.email && <span>{personalDetails.email}</span>}
                {personalDetails?.email && personalDetails?.linkedin && (
                  <span style={{ color: "#666666" }}> | </span>
                )}
                {personalDetails?.linkedin && <span>{personalDetails.linkedin}</span>}
              </div>
            </div>

            {/* Right: Photo (if available) */}
            {personalDetails?.photo && (
              <div
                style={{
                  width: "90px",
                  height: "90px",
                  marginLeft: "20px",
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
          </div>
        </div>

        {/* SUMMARY Section */}
        {professionalSummary && (
          <div style={{ marginBottom: `${sectionSpacing}px` }}>
            <h2
              style={{
                fontFamily: fonts.primary,
                fontSize: `${fontSize.sectionTitles}px`,
                fontWeight: "700",
                color: accentColor,
                marginBottom: "8px",
                paddingBottom: "4px",
                borderBottom: `2px solid ${accentColor}`,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Summary
            </h2>
            <p style={{ color: "#333333", textAlign: "justify", lineHeight: "1.5" }}>
              {professionalSummary}
            </p>
          </div>
        )}

        {/* PROFESSIONAL EXPERIENCE Section */}
        {professionalExperience && professionalExperience.length > 0 && (
          <div style={{ marginBottom: `${sectionSpacing}px` }}>
            <h2
              style={{
                fontFamily: fonts.primary,
                fontSize: `${fontSize.sectionTitles}px`,
                fontWeight: "700",
                color: accentColor,
                marginBottom: "8px",
                paddingBottom: "4px",
                borderBottom: `2px solid ${accentColor}`,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Professional Experience
            </h2>

            {professionalExperience.map((exp, index) => {
              const formattedStartDate = formatDate(exp.startDate, dateFormat);
              const formattedEndDate = exp.endDate ? formatDate(exp.endDate, dateFormat) : "Present";
              const dateString = `${formattedStartDate} — ${formattedEndDate}`;

              return (
                <div key={index} style={{ marginBottom: `${contentBlockSpacing}px` }}>
                  {/* Job Title, Company with Date on right */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      marginBottom: "4px",
                    }}
                  >
                    <div>
                      <strong
                        style={{
                          fontFamily: fonts.primary,
                          fontSize: `${fontSize.body + 1}px`,
                          fontWeight: "600",
                          color: "#000000",
                        }}
                      >
                        {exp.jobTitle}, {exp.company}
                      </strong>
                    </div>
                    {(exp.startDate || exp.endDate) && (
                      <div
                        style={{
                          fontSize: `${fontSize.body}px`,
                          color: "#000000",
                          whiteSpace: "nowrap",
                          marginLeft: "16px",
                        }}
                      >
                        {dateString}
                      </div>
                    )}
                  </div>

                  {/* Achievements/Responsibilities with bullet points */}
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul style={{ paddingLeft: "18px", margin: "4px 0", color: "#333333" }}>
                      {exp.achievements.map((achievement, i) => (
                        <li key={i} style={{ marginBottom: "3px", lineHeight: "1.4" }}>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Fallback: Show description if no achievements */}
                  {(!exp.achievements || exp.achievements.length === 0) && exp.description && (
                    <p style={{ marginTop: "4px", color: "#333333", lineHeight: "1.4" }}>{exp.description}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* EDUCATION Section */}
        {education && education.length > 0 && (
          <div style={{ marginBottom: `${sectionSpacing}px` }}>
            <h2
              style={{
                fontFamily: fonts.primary,
                fontSize: `${fontSize.sectionTitles}px`,
                fontWeight: "700",
                color: accentColor,
                marginBottom: "8px",
                paddingBottom: "4px",
                borderBottom: `2px solid ${accentColor}`,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Education
            </h2>

            {education.map((edu, index) => {
              const formattedGradDate = formatDate(edu.graduationDate, dateFormat);

              return (
                <div key={index} style={{ marginBottom: `${contentBlockSpacing}px` }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      marginBottom: "2px",
                    }}
                  >
                    <strong
                      style={{
                        fontFamily: fonts.primary,
                        fontSize: `${fontSize.body + 1}px`,
                        fontWeight: "600",
                        color: "#000000",
                      }}
                    >
                      {edu.degree}
                    </strong>
                    {formattedGradDate && (
                      <div
                        style={{
                          fontSize: `${fontSize.body}px`,
                          color: "#000000",
                          whiteSpace: "nowrap",
                          marginLeft: "16px",
                        }}
                      >
                        {formattedGradDate}
                      </div>
                    )}
                  </div>
                  <div style={{ color: "#333333", fontSize: `${fontSize.body}px` }}>
                    {edu.institution}
                    {edu.location && `, ${edu.location}`}
                  </div>
                  {edu.achievements && edu.achievements.length > 0 && (
                    <ul style={{ paddingLeft: "18px", margin: "4px 0", color: "#333333" }}>
                      {edu.achievements.map((achievement, i) => (
                        <li key={i} style={{ marginBottom: "2px" }}>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* TECHNICAL SKILLS Section - 4-column grid */}
        {skillsData && skillsData.length > 0 && (
          <div style={{ marginBottom: `${sectionSpacing}px` }}>
            <h2
              style={{
                fontFamily: fonts.primary,
                fontSize: `${fontSize.sectionTitles}px`,
                fontWeight: "700",
                color: accentColor,
                marginBottom: "8px",
                paddingBottom: "4px",
                borderBottom: `2px solid ${accentColor}`,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Technical Skills
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "6px 16px",
                color: "#333333",
                fontSize: `${fontSize.body}px`,
              }}
            >
              {skillsData.map((skill, index) => (
                <div key={index}>{skill.name}</div>
              ))}
            </div>
          </div>
        )}

        {/* ADDITIONAL INFORMATION Section */}
        {((languages && languages.length > 0) || (data.accomplishments && data.accomplishments.length > 0)) && (
          <div style={{ marginBottom: `${sectionSpacing}px` }}>
            <h2
              style={{
                fontFamily: fonts.primary,
                fontSize: `${fontSize.sectionTitles}px`,
                fontWeight: "700",
                color: accentColor,
                marginBottom: "8px",
                paddingBottom: "4px",
                borderBottom: `2px solid ${accentColor}`,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Additional Information
            </h2>

            <ul style={{ paddingLeft: "18px", margin: "0", color: "#333333" }}>
              {/* Languages */}
              {languages && languages.length > 0 && (
                <li style={{ marginBottom: "4px" }}>
                  <strong>Languages:</strong>{" "}
                  {languages.map((lang) => (lang.level ? `${lang.language} (${lang.level})` : lang.language)).join(", ")}
                </li>
              )}

              {/* Accomplishments/Certifications/Awards */}
              {data.accomplishments && data.accomplishments.length > 0 && (
                <>
                  {data.accomplishments.map((item, index) => (
                    <li key={index} style={{ marginBottom: "4px" }}>
                      {item}
                    </li>
                  ))}
                </>
              )}
            </ul>
          </div>
        )}

        {/* Additional Sections */}
        {data.additionalSections && data.additionalSections.length > 0 && (
          <>
            {data.additionalSections.map((section) => (
              <div key={section.id} style={{ marginBottom: `${sectionSpacing}px` }}>
                <h2
                  style={{
                    fontFamily: fonts.primary,
                    fontSize: `${fontSize.sectionTitles}px`,
                    fontWeight: "700",
                    color: accentColor,
                    marginBottom: "8px",
                    paddingBottom: "4px",
                    borderBottom: `2px solid ${accentColor}`,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {section.title}
                </h2>

                {Array.isArray(section.content) ? (
                  <ul style={{ paddingLeft: "18px", margin: "0", color: "#333333" }}>
                    {section.content.map((item, index) => (
                      <li key={index} style={{ marginBottom: "3px" }}>
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ color: "#333333" }}>{section.content}</p>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    );
  }
);

HelsinkiTemplate.displayName = "HelsinkiTemplate";

export default HelsinkiTemplate;
