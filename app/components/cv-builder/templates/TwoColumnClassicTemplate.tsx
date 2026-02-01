import { forwardRef } from "react";
import type { BaseTemplateProps } from "./BaseTemplate";
import { formatDate } from "~/utils/dateFormatter";

/**
 * Two-Column Classic Template (Dark navy sidebar)
 * - Dark navy (#1e293b) left sidebar ~30% width
 * - Circular photo at top of sidebar
 * - Large serif name on right (ALL CAPS)
 * - Sidebar: Contact (labeled), Skills (bullets), Languages, Hobbies
 * - Right: Profile, Work Experience, Education
 * - Section headers with yellow underlines
 */
const TwoColumnClassicTemplate = forwardRef<HTMLDivElement, BaseTemplateProps>(
  ({ data, customization }, ref) => {
    const { primaryColor, fontSize, fontWeight, spacing, fonts, dateFormat } = customization;
    const { personalDetails, professionalSummary, professionalExperience, education, skillsData, languages, accomplishments } = data;

    // A4 dimensions in pixels (at 72 DPI)
    const a4Height = 842;

    // Colors
    const sidebarBg = primaryColor || "#1e293b"; // Dark navy
    const accentColor = "#E8C547"; // Yellow accent
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
        }}
      >
        {/* Left Sidebar - Dark Navy */}
        <div
          style={{
            width: "32%",
            backgroundColor: sidebarBg,
            color: "white",
            padding: "30px 20px",
          }}
        >
          {/* Photo */}
          {personalDetails?.photo && (
            <div
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                overflow: "hidden",
                border: "4px solid rgba(255,255,255,0.3)",
                margin: "0 auto 25px auto",
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

          {/* Contact Section with labeled fields */}
          <div style={{ marginBottom: "25px" }}>
            <h2
              style={{
                fontFamily: "'Georgia', 'Times New Roman', serif",
                fontSize: `${fontSize.sectionTitles}px`,
                fontWeight: "400",
                color: "white",
                marginBottom: "15px",
                paddingBottom: "8px",
                borderBottom: `2px solid ${accentColor}`,
              }}
            >
              Contact
            </h2>
            <div style={{ fontSize: `${fontSize.body - 1}px`, color: "rgba(255,255,255,0.9)" }}>
              {personalDetails?.location && (
                <div style={{ marginBottom: "10px" }}>
                  <div style={{ color: "rgba(255,255,255,0.6)", fontSize: `${fontSize.body - 2}px`, marginBottom: "2px" }}>
                    Address
                  </div>
                  <div>{personalDetails.location}</div>
                </div>
              )}
              {personalDetails?.phone && (
                <div style={{ marginBottom: "10px" }}>
                  <div style={{ color: "rgba(255,255,255,0.6)", fontSize: `${fontSize.body - 2}px`, marginBottom: "2px" }}>
                    Phone
                  </div>
                  <div>{personalDetails.phone}</div>
                </div>
              )}
              {personalDetails?.email && (
                <div style={{ marginBottom: "10px" }}>
                  <div style={{ color: "rgba(255,255,255,0.6)", fontSize: `${fontSize.body - 2}px`, marginBottom: "2px" }}>
                    Email
                  </div>
                  <div style={{ wordBreak: "break-all" }}>{personalDetails.email}</div>
                </div>
              )}
            </div>
          </div>

          {/* Skills Section with bullets */}
          {skillsData && skillsData.length > 0 && (
            <div style={{ marginBottom: "25px" }}>
              <h2
                style={{
                  fontFamily: "'Georgia', 'Times New Roman', serif",
                  fontSize: `${fontSize.sectionTitles}px`,
                  fontWeight: "400",
                  color: "white",
                  marginBottom: "15px",
                  paddingBottom: "8px",
                  borderBottom: `2px solid ${accentColor}`,
                }}
              >
                Skills
              </h2>
              <ul
                style={{
                  listStyleType: "disc",
                  paddingLeft: "18px",
                  fontSize: `${fontSize.body - 1}px`,
                  color: "rgba(255,255,255,0.9)",
                  margin: 0,
                }}
              >
                {skillsData.map((skill, index) => (
                  <li key={index} style={{ marginBottom: "6px" }}>
                    {skill.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Languages Section with bullets */}
          {languages && languages.length > 0 && (
            <div style={{ marginBottom: "25px" }}>
              <h2
                style={{
                  fontFamily: "'Georgia', 'Times New Roman', serif",
                  fontSize: `${fontSize.sectionTitles}px`,
                  fontWeight: "400",
                  color: "white",
                  marginBottom: "15px",
                  paddingBottom: "8px",
                  borderBottom: `2px solid ${accentColor}`,
                }}
              >
                Languages
              </h2>
              <ul
                style={{
                  listStyleType: "disc",
                  paddingLeft: "18px",
                  fontSize: `${fontSize.body - 1}px`,
                  color: "rgba(255,255,255,0.9)",
                  margin: 0,
                }}
              >
                {languages.map((lang, index) => (
                  <li key={index} style={{ marginBottom: "6px" }}>
                    {lang.language}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Hobbies Section with bullets */}
          {accomplishments && accomplishments.length > 0 && (
            <div style={{ marginBottom: "25px" }}>
              <h2
                style={{
                  fontFamily: "'Georgia', 'Times New Roman', serif",
                  fontSize: `${fontSize.sectionTitles}px`,
                  fontWeight: "400",
                  color: "white",
                  marginBottom: "15px",
                  paddingBottom: "8px",
                  borderBottom: `2px solid ${accentColor}`,
                }}
              >
                Hobbies
              </h2>
              <ul
                style={{
                  listStyleType: "disc",
                  paddingLeft: "18px",
                  fontSize: `${fontSize.body - 1}px`,
                  color: "rgba(255,255,255,0.9)",
                  margin: 0,
                }}
              >
                {accomplishments.map((item, index) => (
                  <li key={index} style={{ marginBottom: "6px" }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Content */}
        <div
          style={{
            width: "68%",
            padding: "30px 35px",
            backgroundColor: "#FFFFFF",
          }}
        >
          {/* Name Header - ALL CAPS serif */}
          <div style={{ marginBottom: "25px" }}>
            <h1
              style={{
                fontFamily: "'Georgia', 'Times New Roman', serif",
                fontSize: `${fontSize.primaryHeading + 8}px`,
                fontWeight: "400",
                color: sidebarBg,
                marginBottom: "5px",
                textTransform: "uppercase",
                letterSpacing: "3px",
              }}
            >
              {personalDetails?.firstName} {personalDetails?.lastName}
            </h1>
            {personalDetails?.jobTitle && (
              <div
                style={{
                  fontSize: `${fontSize.body + 1}px`,
                  color: lightText,
                }}
              >
                {personalDetails.jobTitle}
              </div>
            )}
          </div>

          {/* Profile Section */}
          {professionalSummary && (
            <div style={{ marginBottom: "25px" }}>
              <h2
                style={{
                  fontFamily: "'Georgia', 'Times New Roman', serif",
                  fontSize: `${fontSize.sectionTitles}px`,
                  fontWeight: "400",
                  color: darkText,
                  marginBottom: "12px",
                  paddingBottom: "5px",
                  borderBottom: `3px solid ${accentColor}`,
                  display: "inline-block",
                }}
              >
                Profile
              </h2>
              <p
                style={{
                  fontSize: `${fontSize.body}px`,
                  color: lightText,
                  lineHeight: "1.6",
                  textAlign: "justify",
                }}
              >
                {professionalSummary}
              </p>
            </div>
          )}

          {/* Work Experience */}
          {professionalExperience && professionalExperience.length > 0 && (
            <div style={{ marginBottom: "25px" }}>
              <h2
                style={{
                  fontFamily: "'Georgia', 'Times New Roman', serif",
                  fontSize: `${fontSize.sectionTitles}px`,
                  fontWeight: "400",
                  color: darkText,
                  marginBottom: "15px",
                  paddingBottom: "5px",
                  borderBottom: `3px solid ${accentColor}`,
                  display: "inline-block",
                }}
              >
                Work Experience
              </h2>

              {professionalExperience.map((exp, index) => {
                const formattedStartDate = formatDate(exp.startDate, dateFormat);
                const formattedEndDate = exp.endDate ? formatDate(exp.endDate, dateFormat) : "Present";
                const dateString = `${formattedStartDate} – ${formattedEndDate}`;

                return (
                  <div key={index} style={{ marginBottom: "18px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <div>
                        <strong
                          style={{
                            fontFamily: fonts.primary,
                            fontSize: `${fontSize.body + 1}px`,
                            fontWeight: "600",
                            color: darkText,
                          }}
                        >
                          {exp.jobTitle}
                        </strong>
                        <div
                          style={{
                            fontSize: `${fontSize.body}px`,
                            color: lightText,
                          }}
                        >
                          {exp.company}
                          {exp.location && ` – ${exp.location}`}
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: `${fontSize.body - 1}px`,
                          color: lightText,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {dateString}
                      </div>
                    </div>

                    {/* Achievements with bullets */}
                    {exp.achievements && exp.achievements.length > 0 && (
                      <ul
                        style={{
                          paddingLeft: "18px",
                          margin: "8px 0 0 0",
                          fontSize: `${fontSize.body - 1}px`,
                          color: lightText,
                        }}
                      >
                        {exp.achievements.map((achievement, i) => (
                          <li key={i} style={{ marginBottom: "4px", lineHeight: "1.5" }}>
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
                          marginTop: "8px",
                          lineHeight: "1.5",
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
                  fontFamily: "'Georgia', 'Times New Roman', serif",
                  fontSize: `${fontSize.sectionTitles}px`,
                  fontWeight: "400",
                  color: darkText,
                  marginBottom: "15px",
                  paddingBottom: "5px",
                  borderBottom: `3px solid ${accentColor}`,
                  display: "inline-block",
                }}
              >
                Education
              </h2>

              {education.map((edu, index) => {
                const formattedGradDate = formatDate(edu.graduationDate, dateFormat);

                return (
                  <div key={index} style={{ marginBottom: "15px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <div>
                        <strong
                          style={{
                            fontFamily: fonts.primary,
                            fontSize: `${fontSize.body + 1}px`,
                            fontWeight: "600",
                            color: darkText,
                          }}
                        >
                          {edu.degree}
                        </strong>
                        <div
                          style={{
                            fontSize: `${fontSize.body}px`,
                            color: lightText,
                          }}
                        >
                          {edu.institution}
                          {edu.location && ` – ${edu.location}`}
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: `${fontSize.body - 1}px`,
                          color: lightText,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formattedGradDate}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }
);

TwoColumnClassicTemplate.displayName = "TwoColumnClassicTemplate";

export default TwoColumnClassicTemplate;
