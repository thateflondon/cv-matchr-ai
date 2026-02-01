import { forwardRef } from "react";
import type { CVData, CVCustomization } from "~/types/cv-builder";
import { formatDate } from "~/utils/dateFormatter";

export interface EntryLevelTemplateProps {
  data: CVData;
  customization: CVCustomization;
}

/**
 * Entry Level Template - Based on entry_level-template.jpg design
 * - Centered header with name
 * - Yellow/gold (#ca8a04) underlines for section headers
 * - Contact centered under name with bullets
 * - "Qualifications Summary" as paragraph + bullets
 * - Centered Education section
 * - Clean, simple, new-grad focused
 */
const EntryLevelTemplate = forwardRef<HTMLDivElement, EntryLevelTemplateProps>(
  ({ data, customization }, ref) => {
    const { fontSize, fonts, margins, dateFormat } = customization;
    const { personalDetails, professionalSummary, professionalExperience, education, skillsData } = data;

    // A4 dimensions
    const a4Height = 842;

    // Gold/yellow accent color for this template
    const accentColor = "#ca8a04";

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
          fontSize: `${fontSize.body}px`,
          color: "#000000",
          paddingTop: `${topBottomMargin}px`,
          paddingBottom: `${topBottomMargin}px`,
          paddingLeft: `${leftRightMargin}px`,
          paddingRight: `${leftRightMargin}px`,
        }}
      >
        {/* Header - Centered Name */}
        <div style={{ textAlign: "center", marginBottom: `${sectionSpacing}px` }}>
          <h1
            style={{
              fontFamily: fonts.primary,
              fontSize: `${fontSize.primaryHeading + 6}px`,
              fontWeight: "700",
              color: "#000000",
              marginBottom: "8px",
            }}
          >
            {personalDetails?.firstName} {personalDetails?.lastName}
          </h1>

          {/* Contact Info - Centered with bullets */}
          <div
            style={{
              fontSize: `${fontSize.body}px`,
              color: "#333333",
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "4px",
            }}
          >
            {personalDetails?.location && <span>{personalDetails.location}</span>}
            {personalDetails?.location && (personalDetails?.phone || personalDetails?.email || personalDetails?.linkedin) && (
              <span style={{ color: "#666666" }}> • </span>
            )}
            {personalDetails?.phone && <span>{personalDetails.phone}</span>}
            {personalDetails?.phone && (personalDetails?.email || personalDetails?.linkedin) && (
              <span style={{ color: "#666666" }}> • </span>
            )}
            {personalDetails?.email && <span>{personalDetails.email}</span>}
            {personalDetails?.email && personalDetails?.linkedin && (
              <span style={{ color: "#666666" }}> • </span>
            )}
            {personalDetails?.linkedin && <span>{personalDetails.linkedin}</span>}
          </div>
        </div>

        {/* Qualifications Summary */}
        {professionalSummary && (
          <div style={{ marginBottom: `${sectionSpacing}px` }}>
            <h2
              style={{
                fontFamily: fonts.primary,
                fontSize: `${fontSize.sectionTitles + 2}px`,
                fontWeight: "700",
                color: "#000000",
                marginBottom: "8px",
                paddingBottom: "4px",
                borderBottom: `3px solid ${accentColor}`,
                textAlign: "center",
              }}
            >
              Qualifications Summary
            </h2>

            {/* Summary as centered paragraph */}
            <p
              style={{
                color: "#333333",
                textAlign: "center",
                lineHeight: "1.6",
                marginBottom: "12px",
                fontStyle: "italic",
              }}
            >
              {professionalSummary}
            </p>

            {/* Bullet points for key qualifications (using accomplishments if available) */}
            {data.accomplishments && data.accomplishments.length > 0 && (
              <ul style={{ paddingLeft: "24px", margin: "0", color: "#333333" }}>
                {data.accomplishments.map((item, index) => (
                  <li key={index} style={{ marginBottom: "6px", lineHeight: "1.5" }}>
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Education - Centered */}
        {education && education.length > 0 && (
          <div style={{ marginBottom: `${sectionSpacing}px` }}>
            <h2
              style={{
                fontFamily: fonts.primary,
                fontSize: `${fontSize.sectionTitles + 2}px`,
                fontWeight: "700",
                color: "#000000",
                marginBottom: "12px",
                paddingBottom: "4px",
                borderBottom: `3px solid ${accentColor}`,
                textAlign: "center",
              }}
            >
              Education
            </h2>

            {education.map((edu, index) => {
              const formattedGradDate = formatDate(edu.graduationDate, dateFormat);

              return (
                <div key={index} style={{ textAlign: "center", marginBottom: `${contentBlockSpacing}px` }}>
                  <strong
                    style={{
                      fontFamily: fonts.primary,
                      fontSize: `${fontSize.body + 1}px`,
                      fontWeight: "600",
                      color: "#000000",
                      display: "block",
                    }}
                  >
                    {edu.degree}
                    {formattedGradDate && `, ${formattedGradDate}`}
                  </strong>
                  <div style={{ color: "#333333", fontSize: `${fontSize.body}px` }}>
                    {edu.institution}
                    {edu.location && `, ${edu.location}`}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Professional Experience */}
        {professionalExperience && professionalExperience.length > 0 && (
          <div style={{ marginBottom: `${sectionSpacing}px` }}>
            <h2
              style={{
                fontFamily: fonts.primary,
                fontSize: `${fontSize.sectionTitles + 2}px`,
                fontWeight: "700",
                color: "#000000",
                marginBottom: "12px",
                paddingBottom: "4px",
                borderBottom: `3px solid ${accentColor}`,
                textAlign: "center",
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
                  {/* Company - Location - Date range */}
                  <div
                    style={{
                      fontFamily: fonts.primary,
                      fontSize: `${fontSize.body + 1}px`,
                      fontWeight: "600",
                      color: "#000000",
                      marginBottom: "2px",
                    }}
                  >
                    {exp.company}
                    {exp.location && ` – ${exp.location}`}
                    {(exp.startDate || exp.endDate) && ` – ${dateString}`}
                  </div>

                  {/* Job Title */}
                  <div
                    style={{
                      fontSize: `${fontSize.body}px`,
                      color: "#333333",
                      fontWeight: "500",
                      marginBottom: "6px",
                    }}
                  >
                    {exp.jobTitle}
                  </div>

                  {/* Description */}
                  {exp.description && (
                    <p style={{ color: "#333333", marginBottom: "6px", lineHeight: "1.5" }}>
                      {exp.description}
                    </p>
                  )}

                  {/* Selected Contributions label and bullets */}
                  {exp.achievements && exp.achievements.length > 0 && (
                    <>
                      <div
                        style={{
                          fontSize: `${fontSize.body}px`,
                          fontWeight: "500",
                          color: "#333333",
                          marginBottom: "4px",
                        }}
                      >
                        Selected Contributions:
                      </div>
                      <ul style={{ paddingLeft: "24px", margin: "0", color: "#333333" }}>
                        {exp.achievements.map((achievement, i) => (
                          <li key={i} style={{ marginBottom: "4px", lineHeight: "1.5" }}>
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Skills */}
        {skillsData && skillsData.length > 0 && (
          <div style={{ marginBottom: `${sectionSpacing}px` }}>
            <h2
              style={{
                fontFamily: fonts.primary,
                fontSize: `${fontSize.sectionTitles + 2}px`,
                fontWeight: "700",
                color: "#000000",
                marginBottom: "12px",
                paddingBottom: "4px",
                borderBottom: `3px solid ${accentColor}`,
                textAlign: "center",
              }}
            >
              Skills
            </h2>

            <div style={{ color: "#333333", textAlign: "center", lineHeight: "1.6" }}>
              {skillsData.map((skill) => skill.name).join(" • ")}
            </div>
          </div>
        )}

        {/* Languages */}
        {data.languages && data.languages.length > 0 && (
          <div style={{ marginBottom: `${sectionSpacing}px` }}>
            <h2
              style={{
                fontFamily: fonts.primary,
                fontSize: `${fontSize.sectionTitles + 2}px`,
                fontWeight: "700",
                color: "#000000",
                marginBottom: "12px",
                paddingBottom: "4px",
                borderBottom: `3px solid ${accentColor}`,
                textAlign: "center",
              }}
            >
              Languages
            </h2>

            <div style={{ color: "#333333", textAlign: "center", lineHeight: "1.6" }}>
              {data.languages.map((lang) => (lang.level ? `${lang.language} (${lang.level})` : lang.language)).join(" • ")}
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
                    fontFamily: fonts.primary,
                    fontSize: `${fontSize.sectionTitles + 2}px`,
                    fontWeight: "700",
                    color: "#000000",
                    marginBottom: "12px",
                    paddingBottom: "4px",
                    borderBottom: `3px solid ${accentColor}`,
                    textAlign: "center",
                  }}
                >
                  {section.title}
                </h2>

                {Array.isArray(section.content) ? (
                  <ul style={{ paddingLeft: "24px", margin: "0", color: "#333333" }}>
                    {section.content.map((item, index) => (
                      <li key={index} style={{ marginBottom: "4px", lineHeight: "1.5" }}>
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ color: "#333333", textAlign: "center" }}>{section.content}</p>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    );
  }
);

EntryLevelTemplate.displayName = "EntryLevelTemplate";

export default EntryLevelTemplate;
