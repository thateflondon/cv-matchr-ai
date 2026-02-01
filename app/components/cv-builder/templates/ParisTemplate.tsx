import { forwardRef } from "react";
import type { BaseTemplateProps } from "./BaseTemplate";
import { formatDate } from "~/utils/dateFormatter";

/**
 * Paris Template (Two-column with teal sidebar)
 * - Teal (#0d9488) left sidebar ~30% width
 * - Circular photo at top of sidebar
 * - Name in elegant font, job title in teal badge
 * - Sidebar: CONTACTO, PROFILE SUMMARY, SKILLS (checkmarks), LANGUAGES
 * - Right: PROFESSIONAL EXPERIENCE, EDUCATION
 * - Icons for contact items
 */
const ParisTemplate = forwardRef<HTMLDivElement, BaseTemplateProps>(
  ({ data, customization }, ref) => {
    const { primaryColor, fontSize, fontWeight, spacing, fonts, dateFormat } = customization;
    const { personalDetails, professionalSummary, professionalExperience, education, skillsData, languages } = data;

    // A4 dimensions in pixels (at 72 DPI)
    const a4Height = 842;

    // Teal accent color (can be overridden by customization)
    const accentColor = primaryColor || "#0d9488";
    const darkText = "#333333";
    const lightText = "#666666";

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
          color: darkText,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header with Name and Job Title Badge */}
        <div
          style={{
            padding: "30px 40px 20px 40px",
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          {/* Photo (circular) */}
          {personalDetails?.photo && (
            <div
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                overflow: "hidden",
                border: `4px solid ${accentColor}`,
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

          {/* Name and Title Badge */}
          <div style={{ flex: 1, textAlign: "right" }}>
            <div style={{ marginBottom: "4px" }}>
              <span
                style={{
                  fontFamily: fonts.primary,
                  fontSize: `${fontSize.body + 2}px`,
                  fontWeight: "400",
                  color: darkText,
                }}
              >
                {personalDetails?.firstName}
              </span>
            </div>
            <h1
              style={{
                fontFamily: fonts.primary,
                fontSize: `${fontSize.primaryHeading + 10}px`,
                fontWeight: "700",
                color: darkText,
                marginBottom: "10px",
              }}
            >
              {personalDetails?.lastName}
            </h1>
            {personalDetails?.jobTitle && (
              <div
                style={{
                  display: "inline-block",
                  backgroundColor: accentColor,
                  color: "white",
                  padding: "8px 24px",
                  fontSize: `${fontSize.body}px`,
                  fontWeight: "500",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                {personalDetails.jobTitle}
              </div>
            )}
          </div>
        </div>

        {/* Two Column Layout */}
        <div style={{ display: "flex", flex: 1 }}>
          {/* Left Sidebar */}
          <div
            style={{
              width: "35%",
              backgroundColor: "#FFFFFF",
              padding: "20px 25px",
              borderRight: `4px solid ${accentColor}`,
            }}
          >
            {/* CONTACTO Section */}
            <div style={{ marginBottom: "25px" }}>
              <h2
                style={{
                  fontFamily: fonts.primary,
                  fontSize: `${fontSize.sectionTitles}px`,
                  fontWeight: fontWeight.sectionTitles,
                  color: accentColor,
                  marginBottom: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                Contacto
              </h2>
              <div style={{ fontSize: `${fontSize.body - 1}px` }}>
                {personalDetails?.email && (
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                    <span style={{ color: accentColor, fontSize: "14px" }}>✉</span>
                    <span>{personalDetails.email}</span>
                  </div>
                )}
                {personalDetails?.phone && (
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                    <span style={{ color: accentColor, fontSize: "14px" }}>☎</span>
                    <span>{personalDetails.phone}</span>
                  </div>
                )}
                {personalDetails?.location && (
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                    <span style={{ color: accentColor, fontSize: "14px" }}>📍</span>
                    <span>{personalDetails.location}</span>
                  </div>
                )}
                {personalDetails?.linkedin && (
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                    <span style={{ color: accentColor, fontSize: "14px", fontWeight: "700" }}>in</span>
                    <span>{personalDetails.linkedin}</span>
                  </div>
                )}
              </div>
            </div>

            {/* PROFILE SUMMARY */}
            {professionalSummary && (
              <div style={{ marginBottom: "25px" }}>
                <h2
                  style={{
                    fontFamily: fonts.primary,
                    fontSize: `${fontSize.sectionTitles}px`,
                    fontWeight: fontWeight.sectionTitles,
                    color: accentColor,
                    marginBottom: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  Profile Summary
                </h2>
                <p
                  style={{
                    fontSize: `${fontSize.body - 1}px`,
                    color: lightText,
                    textAlign: "justify",
                    lineHeight: "1.5",
                  }}
                >
                  {professionalSummary}
                </p>
              </div>
            )}

            {/* SKILLS with checkmarks */}
            {skillsData && skillsData.length > 0 && (
              <div style={{ marginBottom: "25px" }}>
                <h2
                  style={{
                    fontFamily: fonts.primary,
                    fontSize: `${fontSize.sectionTitles}px`,
                    fontWeight: fontWeight.sectionTitles,
                    color: accentColor,
                    marginBottom: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  Skills
                </h2>
                <div style={{ fontSize: `${fontSize.body - 1}px` }}>
                  {skillsData.map((skill, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "6px",
                      }}
                    >
                      <span style={{ color: accentColor }}>✓</span>
                      <span>{skill.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* LANGUAGES with checkmarks */}
            {languages && languages.length > 0 && (
              <div style={{ marginBottom: "25px" }}>
                <h2
                  style={{
                    fontFamily: fonts.primary,
                    fontSize: `${fontSize.sectionTitles}px`,
                    fontWeight: fontWeight.sectionTitles,
                    color: accentColor,
                    marginBottom: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  Languages
                </h2>
                <div style={{ fontSize: `${fontSize.body - 1}px` }}>
                  {languages.map((lang, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "6px",
                      }}
                    >
                      <span style={{ color: accentColor }}>✓</span>
                      <span>
                        {lang.language}: {lang.level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Content */}
          <div
            style={{
              width: "65%",
              padding: "20px 30px",
              backgroundColor: "#FFFFFF",
            }}
          >
            {/* PROFESSIONAL EXPERIENCE */}
            {professionalExperience && professionalExperience.length > 0 && (
              <div style={{ marginBottom: "25px" }}>
                <h2
                  style={{
                    fontFamily: fonts.primary,
                    fontSize: `${fontSize.sectionTitles}px`,
                    fontWeight: fontWeight.sectionTitles,
                    color: darkText,
                    marginBottom: "15px",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    borderBottom: `2px solid ${accentColor}`,
                    paddingBottom: "5px",
                  }}
                >
                  Professional Experience
                </h2>

                {professionalExperience.map((exp, index) => {
                  const formattedStartDate = formatDate(exp.startDate, dateFormat);
                  const formattedEndDate = exp.endDate ? formatDate(exp.endDate, dateFormat) : "Present";
                  const dateString = `${formattedStartDate} - ${formattedEndDate}`;

                  return (
                    <div key={index} style={{ marginBottom: "18px" }}>
                      <div style={{ marginBottom: "4px" }}>
                        <strong
                          style={{
                            fontFamily: fonts.primary,
                            fontSize: `${fontSize.body + 1}px`,
                            fontWeight: "700",
                            color: accentColor,
                            textTransform: "uppercase",
                          }}
                        >
                          {exp.company}
                        </strong>
                      </div>
                      <div
                        style={{
                          fontSize: `${fontSize.body}px`,
                          color: darkText,
                          fontWeight: "500",
                        }}
                      >
                        {exp.jobTitle}
                      </div>
                      <div
                        style={{
                          fontSize: `${fontSize.body - 1}px`,
                          color: lightText,
                          marginBottom: "8px",
                        }}
                      >
                        {exp.location && `${exp.location} | `}
                        {dateString}
                      </div>

                      {/* Achievements with bullets */}
                      {exp.achievements && exp.achievements.length > 0 && (
                        <ul
                          style={{
                            paddingLeft: "18px",
                            margin: "6px 0",
                            fontSize: `${fontSize.body - 1}px`,
                            color: lightText,
                          }}
                        >
                          {exp.achievements.map((achievement, i) => (
                            <li key={i} style={{ marginBottom: "4px", lineHeight: "1.4" }}>
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* Fallback: Show description if no achievements */}
                      {(!exp.achievements || exp.achievements.length === 0) && exp.description && (
                        <p
                          style={{
                            fontSize: `${fontSize.body - 1}px`,
                            color: lightText,
                            lineHeight: "1.4",
                          }}
                        >
                          {exp.description}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* EDUCATION */}
            {education && education.length > 0 && (
              <div>
                <h2
                  style={{
                    fontFamily: fonts.primary,
                    fontSize: `${fontSize.sectionTitles}px`,
                    fontWeight: fontWeight.sectionTitles,
                    color: darkText,
                    marginBottom: "15px",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    borderBottom: `2px solid ${accentColor}`,
                    paddingBottom: "5px",
                  }}
                >
                  Education
                </h2>

                {education.map((edu, index) => {
                  const formattedGradDate = formatDate(edu.graduationDate, dateFormat);

                  return (
                    <div key={index} style={{ marginBottom: "15px" }}>
                      <strong
                        style={{
                          fontFamily: fonts.primary,
                          fontSize: `${fontSize.body + 1}px`,
                          fontWeight: "700",
                          color: darkText,
                          textTransform: "uppercase",
                          display: "block",
                        }}
                      >
                        {edu.degree}
                      </strong>
                      <div
                        style={{
                          fontSize: `${fontSize.body}px`,
                          color: darkText,
                        }}
                      >
                        {edu.institution}
                      </div>
                      <div
                        style={{
                          fontSize: `${fontSize.body - 1}px`,
                          color: lightText,
                        }}
                      >
                        {edu.location && `${edu.location} | `}
                        {formattedGradDate}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

ParisTemplate.displayName = "ParisTemplate";

export default ParisTemplate;
