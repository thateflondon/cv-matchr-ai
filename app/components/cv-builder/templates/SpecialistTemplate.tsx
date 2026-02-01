import { forwardRef } from "react";
import type { CVData, CVCustomization } from "~/types/cv-builder";
import { formatDate } from "~/utils/dateFormatter";

export interface SpecialistTemplateProps {
  data: CVData;
  customization: CVCustomization;
}

/**
 * Specialist Template (Traditional) - Based on specialist_traditional1-template.jpg design
 * - Classic black & white
 * - Name top-left, contact top-right (2 lines)
 * - Job title italic under name
 * - Summary paragraph in italic
 * - "Technical Proficiencies" with category labels (bold label: content)
 * - Professional Experience with diamond (◆) bullets
 * - Very traditional, no colors
 * - Horizontal line separating sections
 */
const SpecialistTemplate = forwardRef<HTMLDivElement, SpecialistTemplateProps>(
  ({ data, customization }, ref) => {
    const { fontSize, fonts, margins, dateFormat } = customization;
    const { personalDetails, professionalSummary, professionalExperience, education, skillsData } = data;

    // A4 dimensions
    const a4Height = 842;

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
          fontFamily: "'Times New Roman', 'Georgia', serif",
          fontSize: `${fontSize.body}px`,
          color: "#000000",
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
                fontFamily: "'Times New Roman', 'Georgia', serif",
                fontSize: `${fontSize.primaryHeading + 6}px`,
                fontWeight: "700",
                color: "#000000",
                marginBottom: "2px",
              }}
            >
              {personalDetails?.firstName} {personalDetails?.lastName}
            </h1>
            {personalDetails?.jobTitle && (
              <div
                style={{
                  fontSize: `${fontSize.body + 2}px`,
                  fontStyle: "italic",
                  color: "#000000",
                }}
              >
                {personalDetails.jobTitle}
              </div>
            )}
          </div>

          {/* Right: Contact Info - Two lines */}
          <div style={{ textAlign: "right", fontSize: `${fontSize.body}px`, color: "#000000" }}>
            {/* Line 1: Location • Phone */}
            <div style={{ marginBottom: "2px" }}>
              {personalDetails?.location && <span>{personalDetails.location}</span>}
              {personalDetails?.location && personalDetails?.phone && <span> • </span>}
              {personalDetails?.phone && <span>{personalDetails.phone}</span>}
            </div>

            {/* Line 2: Email • LinkedIn */}
            <div>
              {personalDetails?.email && <span>{personalDetails.email}</span>}
              {personalDetails?.email && personalDetails?.linkedin && <span> • </span>}
              {personalDetails?.linkedin && <span>{personalDetails.linkedin}</span>}
            </div>
          </div>
        </div>

        {/* Professional Summary - Italic paragraph */}
        {professionalSummary && (
          <div style={{ marginBottom: `${sectionSpacing}px` }}>
            <p style={{ fontStyle: "italic", color: "#000000", lineHeight: "1.6", textAlign: "justify" }}>
              {professionalSummary}
            </p>
          </div>
        )}

        {/* Technical Proficiencies */}
        {((data.skillGroups && data.skillGroups.length > 0) || (skillsData && skillsData.length > 0)) && (
          <div style={{ marginBottom: `${sectionSpacing}px` }}>
            <h2
              style={{
                fontFamily: "'Times New Roman', 'Georgia', serif",
                fontSize: `${fontSize.sectionTitles + 2}px`,
                fontWeight: "700",
                color: "#000000",
                marginBottom: "12px",
                paddingBottom: "4px",
                borderBottom: "2px solid #000000",
              }}
            >
              Technical Proficiencies
            </h2>

            {/* Skill Groups with label: content format */}
            {data.skillGroups && data.skillGroups.length > 0 ? (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  {data.skillGroups.map((group, index) => (
                    <tr key={index}>
                      <td
                        style={{
                          fontWeight: "700",
                          verticalAlign: "top",
                          paddingRight: "16px",
                          paddingBottom: "8px",
                          whiteSpace: "nowrap",
                          width: "1%",
                        }}
                      >
                        {group.title}:
                      </td>
                      <td style={{ verticalAlign: "top", paddingBottom: "8px" }}>
                        {group.skills.join(", ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              /* Fallback to simple skills list */
              <div style={{ lineHeight: "1.6" }}>
                {skillsData?.map((skill) => skill.name).join(", ")}
              </div>
            )}
          </div>
        )}

        {/* Professional Experience */}
        {professionalExperience && professionalExperience.length > 0 && (
          <div style={{ marginBottom: `${sectionSpacing}px` }}>
            <h2
              style={{
                fontFamily: "'Times New Roman', 'Georgia', serif",
                fontSize: `${fontSize.sectionTitles + 2}px`,
                fontWeight: "700",
                color: "#000000",
                marginBottom: "12px",
                paddingBottom: "4px",
                borderBottom: "2px solid #000000",
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
                  {/* Company, Location with Date right-aligned */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      marginBottom: "2px",
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: `${fontSize.body + 1}px`, fontWeight: "700" }}>
                        {exp.company}
                        {exp.location && `, ${exp.location}`}
                      </strong>
                    </div>
                    {(exp.startDate || exp.endDate) && (
                      <div style={{ whiteSpace: "nowrap", marginLeft: "16px" }}>
                        {dateString}
                      </div>
                    )}
                  </div>

                  {/* Job Title */}
                  <div
                    style={{
                      fontSize: `${fontSize.body}px`,
                      fontWeight: "600",
                      marginBottom: "6px",
                    }}
                  >
                    {exp.jobTitle}
                  </div>

                  {/* Description */}
                  {exp.description && (
                    <p style={{ marginBottom: "6px", lineHeight: "1.5" }}>
                      {exp.description}
                    </p>
                  )}

                  {/* Achievements with diamond bullets */}
                  {exp.achievements && exp.achievements.length > 0 && (
                    <div style={{ marginLeft: "8px" }}>
                      {exp.achievements.map((achievement, i) => (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            marginBottom: "4px",
                            lineHeight: "1.5",
                          }}
                        >
                          <span style={{ marginRight: "10px", flexShrink: 0 }}>◆</span>
                          <span>{achievement}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <div style={{ marginBottom: `${sectionSpacing}px` }}>
            <h2
              style={{
                fontFamily: "'Times New Roman', 'Georgia', serif",
                fontSize: `${fontSize.sectionTitles + 2}px`,
                fontWeight: "700",
                color: "#000000",
                marginBottom: "12px",
                paddingBottom: "4px",
                borderBottom: "2px solid #000000",
              }}
            >
              Education
            </h2>

            {education.map((edu, index) => {
              const formattedGradDate = formatDate(edu.graduationDate, dateFormat);

              return (
                <div key={index} style={{ marginBottom: `${contentBlockSpacing - 4}px` }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: `${fontSize.body + 1}px`, fontWeight: "700" }}>
                        {edu.degree}
                      </strong>
                      <span style={{ marginLeft: "8px" }}>
                        {edu.institution}
                        {edu.location && `, ${edu.location}`}
                      </span>
                    </div>
                    {formattedGradDate && (
                      <div style={{ whiteSpace: "nowrap", marginLeft: "16px" }}>
                        {formattedGradDate}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Languages */}
        {data.languages && data.languages.length > 0 && (
          <div style={{ marginBottom: `${sectionSpacing}px` }}>
            <h2
              style={{
                fontFamily: "'Times New Roman', 'Georgia', serif",
                fontSize: `${fontSize.sectionTitles + 2}px`,
                fontWeight: "700",
                color: "#000000",
                marginBottom: "12px",
                paddingBottom: "4px",
                borderBottom: "2px solid #000000",
              }}
            >
              Languages
            </h2>

            <div style={{ lineHeight: "1.6" }}>
              {data.languages.map((lang) => (lang.level ? `${lang.language} (${lang.level})` : lang.language)).join(", ")}
            </div>
          </div>
        )}

        {/* Additional Sections */}
        {data.additionalSections && data.additionalSections.length > 0 && (
          <>
            {data.additionalSections.map((section) => (
              <div key={section.id} style={{ marginBottom: `${sectionSpacing}px` }}>
                <h2
                  style={{
                    fontFamily: "'Times New Roman', 'Georgia', serif",
                    fontSize: `${fontSize.sectionTitles + 2}px`,
                    fontWeight: "700",
                    color: "#000000",
                    marginBottom: "12px",
                    paddingBottom: "4px",
                    borderBottom: "2px solid #000000",
                  }}
                >
                  {section.title}
                </h2>

                {Array.isArray(section.content) ? (
                  <div style={{ marginLeft: "8px" }}>
                    {section.content.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          marginBottom: "4px",
                          lineHeight: "1.5",
                        }}
                      >
                        <span style={{ marginRight: "10px", flexShrink: 0 }}>◆</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ lineHeight: "1.6" }}>{section.content}</p>
                )}
              </div>
            ))}
          </>
        )}

        {/* Page number - bottom right */}
        <div
          style={{
            position: "absolute",
            bottom: `${topBottomMargin}px`,
            right: `${leftRightMargin}px`,
            fontSize: `${fontSize.body - 1}px`,
            color: "#000000",
          }}
        >
          1
        </div>
      </div>
    );
  }
);

SpecialistTemplate.displayName = "SpecialistTemplate";

export default SpecialistTemplate;
