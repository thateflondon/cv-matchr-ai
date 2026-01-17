import { forwardRef } from "react";
import type { CVData, CVCustomization } from "~/types/cv-builder";

export interface AcademicTemplateProps {
  data: CVData;
  customization: CVCustomization;
}

/**
 * Academic Template - Two-column layout with photo
 * Left: Photo, Contact, Skills, Languages
 * Right: Name, Job Title, Profile, Experience, Education, Certifications
 */
const AcademicTemplate = forwardRef<HTMLDivElement, AcademicTemplateProps>(
  ({ data, customization }, ref) => {
    const { primaryColor, fonts, spacing, fontSize, fontWeight } = customization;
    const { personalDetails, professionalSummary, professionalExperience, education, skillsData, languages, certifications } = data;

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
          padding: "40px",
          display: "flex",
          gap: "30px",
        }}
      >
        {/* Left Column - Sidebar */}
        <div style={{ width: "35%", flexShrink: 0 }}>
          {/* Photo */}
          {personalDetails?.photoUrl && (
            <div style={{ marginBottom: spacing.sections + "px" }}>
              <img
                src={personalDetails.photoUrl}
                alt="Profile"
                style={{
                  width: "100%",
                  aspectRatio: "1",
                  objectFit: "cover",
                  borderRadius: "4px",
                }}
              />
            </div>
          )}

          {/* Contact */}
          <div style={{ marginBottom: spacing.sections + "px" }}>
            <h2
              style={{
                fontFamily: fonts.primary,
                fontSize: `${fontSize.secondaryHeading}px`,
                fontWeight: fontWeight.secondaryHeading,
                marginBottom: "12px",
                color: "#000000",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Contact
            </h2>
            <div
              style={{
                fontSize: `${fontSize.body - 1}px`,
                color: "#333333",
                lineHeight: "1.8",
              }}
            >
              {personalDetails?.email && (
                <div style={{ marginBottom: "6px", wordBreak: "break-word" }}>
                  {personalDetails.email}
                </div>
              )}
              {personalDetails?.phone && (
                <div style={{ marginBottom: "6px" }}>{personalDetails.phone}</div>
              )}
              {personalDetails?.location && (
                <div style={{ marginBottom: "6px" }}>{personalDetails.location}</div>
              )}
              {personalDetails?.linkedin && (
                <div style={{ marginBottom: "6px", wordBreak: "break-word" }}>
                  {personalDetails.linkedin}
                </div>
              )}
            </div>
          </div>

          {/* Skills */}
          {skillsData && skillsData.length > 0 && (
            <div style={{ marginBottom: spacing.sections + "px" }}>
              <h2
                style={{
                  fontFamily: fonts.primary,
                  fontSize: `${fontSize.secondaryHeading}px`,
                  fontWeight: fontWeight.secondaryHeading,
                  marginBottom: "12px",
                  color: "#000000",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Skills
              </h2>
              <div>
                {skillsData.map((skillGroup, index) => (
                  <div key={index} style={{ marginBottom: "12px" }}>
                    {skillGroup.category && (
                      <div
                        style={{
                          fontWeight: fontWeight.sectionHeading,
                          color: "#000000",
                          marginBottom: "4px",
                          fontSize: `${fontSize.body - 1}px`,
                        }}
                      >
                        {skillGroup.category}
                      </div>
                    )}
                    <div
                      style={{
                        color: "#555555",
                        fontSize: `${fontSize.body - 1}px`,
                        lineHeight: "1.6",
                      }}
                    >
                      {skillGroup.items?.map((item, i) => (
                        <div key={i}>{item}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages && languages.length > 0 && (
            <div style={{ marginBottom: spacing.sections + "px" }}>
              <h2
                style={{
                  fontFamily: fonts.primary,
                  fontSize: `${fontSize.secondaryHeading}px`,
                  fontWeight: fontWeight.secondaryHeading,
                  marginBottom: "12px",
                  color: "#000000",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Languages
              </h2>
              <div style={{ fontSize: `${fontSize.body - 1}px`, color: "#555555" }}>
                {languages.map((lang, index) => (
                  <div key={index} style={{ marginBottom: "6px" }}>
                    {lang.language}
                    {lang.proficiency && (
                      <span style={{ color: "#777777" }}> - {lang.proficiency}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Main Content */}
        <div style={{ flex: 1 }}>
          {/* Header - Name and Job Title */}
          <div style={{ marginBottom: spacing.sections + "px" }}>
            <h1
              style={{
                fontFamily: fonts.primary,
                fontSize: `${fontSize.primaryHeading}px`,
                fontWeight: fontWeight.primaryHeading,
                marginBottom: "8px",
                color: "#000000",
                letterSpacing: "0.5px",
              }}
            >
              {personalDetails?.firstName} {personalDetails?.lastName}
            </h1>
            {personalDetails?.jobTitle && (
              <div
                style={{
                  fontFamily: fonts.primary,
                  fontSize: `${fontSize.secondaryHeading}px`,
                  fontWeight: fontWeight.secondaryHeading,
                  color: "#444444",
                }}
              >
                {personalDetails.jobTitle}
              </div>
            )}
          </div>

          {/* Profile / Summary */}
          {professionalSummary && (
            <div style={{ marginBottom: spacing.sections + "px" }}>
              <h2
                style={{
                  fontFamily: fonts.primary,
                  fontSize: `${fontSize.secondaryHeading}px`,
                  fontWeight: fontWeight.secondaryHeading,
                  marginBottom: "12px",
                  color: "#000000",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Profile
              </h2>
              <div style={{ color: "#333333" }}>{professionalSummary}</div>
            </div>
          )}

          {/* Professional Experience */}
          {professionalExperience && professionalExperience.length > 0 && (
            <div style={{ marginBottom: spacing.sections + "px" }}>
              <h2
                style={{
                  fontFamily: fonts.primary,
                  fontSize: `${fontSize.secondaryHeading}px`,
                  fontWeight: fontWeight.secondaryHeading,
                  marginBottom: "12px",
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
                  marginBottom: "12px",
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

          {/* Certifications (optional) */}
          {certifications && certifications.length > 0 && (
            <div style={{ marginBottom: spacing.sections + "px" }}>
              <h2
                style={{
                  fontFamily: fonts.primary,
                  fontSize: `${fontSize.secondaryHeading}px`,
                  fontWeight: fontWeight.secondaryHeading,
                  marginBottom: "12px",
                  color: "#000000",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Certifications
              </h2>
              <div style={{ fontSize: `${fontSize.body - 1}px`, color: "#555555" }}>
                {certifications.map((cert, index) => (
                  <div key={index} style={{ marginBottom: "6px" }}>
                    {cert.name}
                    {cert.issuer && <span> - {cert.issuer}</span>}
                    {cert.date && <span style={{ color: "#777777" }}> ({cert.date})</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

AcademicTemplate.displayName = "AcademicTemplate";

export default AcademicTemplate;