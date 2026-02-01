import { forwardRef } from "react";
import type { BaseTemplateProps } from "./BaseTemplate";
import { formatDate } from "~/utils/dateFormatter";

/**
 * Two-Column Design Template (Creative/Modern)
 * - Navy header bar + orange/yellow accent
 * - Photo circular top-left
 * - Left sidebar: Work Experience, Education
 * - Right column: General Skills (2-col grid), Personal Projects, Languages (with progress bars), Interests (icons)
 * - Most visually complex template
 */
const TwoColumnDesignTemplate = forwardRef<HTMLDivElement, BaseTemplateProps>(
  ({ data, customization }, ref) => {
    const { primaryColor, fontSize, fontWeight, spacing, fonts, dateFormat } = customization;
    const { personalDetails, professionalSummary, professionalExperience, education, skillsData, languages, accomplishments, additionalSections } = data;

    // A4 dimensions in pixels (at 72 DPI)
    const a4Height = 842;

    // Colors
    const accentColor = primaryColor || "#F5A623"; // Yellow/orange
    const darkNavy = "#2C3E50";
    const darkText = "#333333";
    const lightText = "#666666";

    // Language level to percentage mapping
    const getLevelPercentage = (level: string): number => {
      const levelMap: Record<string, number> = {
        native: 100,
        fluent: 90,
        advanced: 80,
        intermediate: 60,
        basic: 40,
        beginner: 20,
      };
      return levelMap[level.toLowerCase()] || 50;
    };

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
        }}
      >
        {/* Header Section with Navy + Orange Accent */}
        <div
          style={{
            display: "flex",
            alignItems: "stretch",
          }}
        >
          {/* Left header - Photo + Navy background */}
          <div
            style={{
              width: "50%",
              backgroundColor: darkNavy,
              padding: "20px 25px",
              display: "flex",
              alignItems: "center",
              gap: "15px",
            }}
          >
            {/* Photo (circular) */}
            {personalDetails?.photo && (
              <div
                style={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: `3px solid ${accentColor}`,
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

            {/* Name */}
            <div style={{ flex: 1 }}>
              <h1
                style={{
                  fontFamily: fonts.primary,
                  fontSize: `${fontSize.primaryHeading + 4}px`,
                  fontWeight: "700",
                  color: "white",
                  marginBottom: "2px",
                }}
              >
                {personalDetails?.firstName} {personalDetails?.lastName}
              </h1>
              {personalDetails?.jobTitle && (
                <div
                  style={{
                    fontSize: `${fontSize.body}px`,
                    color: accentColor,
                    fontWeight: "500",
                  }}
                >
                  {personalDetails.jobTitle}
                </div>
              )}
            </div>
          </div>

          {/* Right header - Contact info + Summary with orange accent bar */}
          <div
            style={{
              width: "50%",
              padding: "15px 20px",
              borderBottom: `4px solid ${accentColor}`,
            }}
          >
            {/* Contact Info */}
            <div
              style={{
                fontSize: `${fontSize.body - 2}px`,
                color: darkText,
                marginBottom: "10px",
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
              }}
            >
              {personalDetails?.email && (
                <span>{personalDetails.email}</span>
              )}
              {personalDetails?.email && personalDetails?.phone && <span>|</span>}
              {personalDetails?.phone && (
                <span>{personalDetails.phone}</span>
              )}
              {(personalDetails?.email || personalDetails?.phone) && personalDetails?.location && <span>|</span>}
              {personalDetails?.location && (
                <span>{personalDetails.location}</span>
              )}
            </div>

            {/* Brief Summary */}
            {professionalSummary && (
              <p
                style={{
                  fontSize: `${fontSize.body - 1}px`,
                  color: lightText,
                  lineHeight: "1.4",
                  margin: 0,
                }}
              >
                {professionalSummary.length > 200 ? `${professionalSummary.substring(0, 200)}...` : professionalSummary}
              </p>
            )}
          </div>
        </div>

        {/* Two Column Content */}
        <div style={{ display: "flex", padding: "0" }}>
          {/* Left Column - Work Experience + Education */}
          <div
            style={{
              width: "50%",
              padding: "20px 25px",
              backgroundColor: "#f8f9fa",
            }}
          >
            {/* Work Experience */}
            {professionalExperience && professionalExperience.length > 0 && (
              <div style={{ marginBottom: "20px" }}>
                <h2
                  style={{
                    fontFamily: fonts.primary,
                    fontSize: `${fontSize.sectionTitles}px`,
                    fontWeight: fontWeight.sectionTitles,
                    color: darkNavy,
                    marginBottom: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span
                    style={{
                      width: "20px",
                      height: "20px",
                      backgroundColor: darkNavy,
                      borderRadius: "4px",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "10px",
                    }}
                  >
                    ●
                  </span>
                  Work Experience
                </h2>

                {professionalExperience.map((exp, index) => {
                  const formattedStartDate = formatDate(exp.startDate, dateFormat);
                  const formattedEndDate = exp.endDate ? formatDate(exp.endDate, dateFormat) : "Present";
                  const dateString = `${formattedStartDate} - ${formattedEndDate}`;

                  return (
                    <div key={index} style={{ marginBottom: "15px", paddingLeft: "28px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                        <strong
                          style={{
                            fontFamily: fonts.primary,
                            fontSize: `${fontSize.body}px`,
                            fontWeight: "600",
                            color: darkText,
                          }}
                        >
                          {exp.jobTitle}
                        </strong>
                        <span
                          style={{
                            fontSize: `${fontSize.body - 2}px`,
                            color: lightText,
                          }}
                        >
                          {dateString}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: `${fontSize.body - 1}px`,
                          color: accentColor,
                          marginBottom: "6px",
                        }}
                      >
                        {exp.company}
                        {exp.location && ` - ${exp.location}`}
                      </div>

                      {/* Achievements with bullets */}
                      {exp.achievements && exp.achievements.length > 0 && (
                        <ul
                          style={{
                            paddingLeft: "16px",
                            margin: "0",
                            fontSize: `${fontSize.body - 1}px`,
                            color: lightText,
                          }}
                        >
                          {exp.achievements.slice(0, 3).map((achievement, i) => (
                            <li key={i} style={{ marginBottom: "3px", lineHeight: "1.4" }}>
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
                            margin: 0,
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

            {/* Education */}
            {education && education.length > 0 && (
              <div>
                <h2
                  style={{
                    fontFamily: fonts.primary,
                    fontSize: `${fontSize.sectionTitles}px`,
                    fontWeight: fontWeight.sectionTitles,
                    color: darkNavy,
                    marginBottom: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span
                    style={{
                      width: "20px",
                      height: "20px",
                      backgroundColor: darkNavy,
                      borderRadius: "4px",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "10px",
                    }}
                  >
                    ●
                  </span>
                  Education
                </h2>

                {education.map((edu, index) => {
                  const formattedGradDate = formatDate(edu.graduationDate, dateFormat);

                  return (
                    <div key={index} style={{ marginBottom: "12px", paddingLeft: "28px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                        <strong
                          style={{
                            fontFamily: fonts.primary,
                            fontSize: `${fontSize.body}px`,
                            fontWeight: "600",
                            color: darkText,
                          }}
                        >
                          {edu.degree}
                        </strong>
                        <span
                          style={{
                            fontSize: `${fontSize.body - 2}px`,
                            color: lightText,
                          }}
                        >
                          {formattedGradDate}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: `${fontSize.body - 1}px`,
                          color: accentColor,
                        }}
                      >
                        {edu.institution}
                        {edu.location && ` - ${edu.location}`}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column - Skills, Projects, Languages, Interests */}
          <div
            style={{
              width: "50%",
              padding: "20px 25px",
            }}
          >
            {/* General Skills - 2-column grid */}
            {skillsData && skillsData.length > 0 && (
              <div style={{ marginBottom: "20px" }}>
                <h2
                  style={{
                    fontFamily: fonts.primary,
                    fontSize: `${fontSize.sectionTitles}px`,
                    fontWeight: fontWeight.sectionTitles,
                    color: darkNavy,
                    marginBottom: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span
                    style={{
                      width: "20px",
                      height: "20px",
                      backgroundColor: accentColor,
                      borderRadius: "4px",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "10px",
                    }}
                  >
                    ●
                  </span>
                  General Skills
                </h2>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "6px 15px",
                    paddingLeft: "28px",
                  }}
                >
                  {skillsData.map((skill, index) => (
                    <div
                      key={index}
                      style={{
                        fontSize: `${fontSize.body - 1}px`,
                        color: darkText,
                        padding: "4px 0",
                        borderBottom: `1px solid ${accentColor}30`,
                      }}
                    >
                      {skill.name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Personal Projects */}
            {additionalSections && additionalSections.length > 0 && (
              <div style={{ marginBottom: "20px" }}>
                <h2
                  style={{
                    fontFamily: fonts.primary,
                    fontSize: `${fontSize.sectionTitles}px`,
                    fontWeight: fontWeight.sectionTitles,
                    color: darkNavy,
                    marginBottom: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span
                    style={{
                      width: "20px",
                      height: "20px",
                      backgroundColor: accentColor,
                      borderRadius: "4px",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "10px",
                    }}
                  >
                    ●
                  </span>
                  Personal Projects
                </h2>
                <div style={{ paddingLeft: "28px" }}>
                  {additionalSections.map((section, index) => (
                    <div key={index} style={{ marginBottom: "10px" }}>
                      <strong
                        style={{
                          fontSize: `${fontSize.body}px`,
                          color: darkText,
                          display: "block",
                          marginBottom: "4px",
                        }}
                      >
                        {section.title}
                      </strong>
                      <div
                        style={{
                          fontSize: `${fontSize.body - 1}px`,
                          color: lightText,
                          lineHeight: "1.4",
                        }}
                      >
                        {Array.isArray(section.content)
                          ? section.content.join(", ")
                          : section.content}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Languages with progress bars */}
            {languages && languages.length > 0 && (
              <div style={{ marginBottom: "20px" }}>
                <h2
                  style={{
                    fontFamily: fonts.primary,
                    fontSize: `${fontSize.sectionTitles}px`,
                    fontWeight: fontWeight.sectionTitles,
                    color: darkNavy,
                    marginBottom: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span
                    style={{
                      width: "20px",
                      height: "20px",
                      backgroundColor: accentColor,
                      borderRadius: "4px",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "10px",
                    }}
                  >
                    ●
                  </span>
                  Languages
                </h2>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "10px 20px",
                    paddingLeft: "28px",
                  }}
                >
                  {languages.map((lang, index) => {
                    const percentage = getLevelPercentage(lang.level);
                    return (
                      <div key={index}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: `${fontSize.body - 1}px`,
                            marginBottom: "4px",
                          }}
                        >
                          <span style={{ color: darkText }}>{lang.language}</span>
                          <span style={{ color: lightText, fontSize: `${fontSize.body - 2}px` }}>
                            {lang.level}
                          </span>
                        </div>
                        {/* Progress bar */}
                        <div
                          style={{
                            width: "100%",
                            height: "6px",
                            backgroundColor: "#e5e7eb",
                            borderRadius: "3px",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `${percentage}%`,
                              height: "100%",
                              backgroundColor: accentColor,
                              borderRadius: "3px",
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Interests with checkmark icons */}
            {accomplishments && accomplishments.length > 0 && (
              <div>
                <h2
                  style={{
                    fontFamily: fonts.primary,
                    fontSize: `${fontSize.sectionTitles}px`,
                    fontWeight: fontWeight.sectionTitles,
                    color: darkNavy,
                    marginBottom: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span
                    style={{
                      width: "20px",
                      height: "20px",
                      backgroundColor: accentColor,
                      borderRadius: "4px",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "10px",
                    }}
                  >
                    ●
                  </span>
                  Interests
                </h2>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "6px 15px",
                    paddingLeft: "28px",
                  }}
                >
                  {accomplishments.map((interest, index) => (
                    <div
                      key={index}
                      style={{
                        fontSize: `${fontSize.body - 1}px`,
                        color: darkText,
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <span style={{ color: accentColor }}>✔</span>
                      {interest}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

TwoColumnDesignTemplate.displayName = "TwoColumnDesignTemplate";

export default TwoColumnDesignTemplate;
