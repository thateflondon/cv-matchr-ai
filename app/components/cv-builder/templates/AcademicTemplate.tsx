import { forwardRef } from "react";
import type { CVData, CVCustomization } from "~/types/cv-builder";

export interface AcademicTemplateProps {
  data: CVData;
  customization: CVCustomization;
}

/**
 * Academic Template - Based on academic-template.jpg design
 * Single column with blue left accent bar
 */
const AcademicTemplate = forwardRef<HTMLDivElement, AcademicTemplateProps>(
  ({ data, customization }, ref) => {
    const { primaryColor, fonts, spacing, fontSize, fontWeight } = customization;
    const { personalDetails, professionalSummary, selectedAchievements, professionalExperience, education, skillsData, certifications } = data;

    // Use primary color or default blue
    const accentColor = primaryColor || "#0A5F8C";

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
          color: "#333333",
          position: "relative",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        }}
      >
        {/* Blue left border */}
        <div style={{ position: "relative", display: "flex" }}>
          <div 
            style={{ 
              position: "absolute",
              width: "8px",
              top: "30px",
              height: "160px",
              backgroundColor: accentColor,
              left: "0",
            }}
          />
          
          <div style={{ flex: "1", padding: "48px" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
              <div>
                <h1 
                  style={{ 
                    fontFamily: fonts.primary,
                    fontSize: `${fontSize.primaryHeading}px`,
                    fontWeight: fontWeight.primaryHeading,
                    marginBottom: "8px",
                    color: accentColor,
                  }}
                >
                  {personalDetails?.firstName} {personalDetails?.lastName}
                </h1>
                {personalDetails?.jobTitle && (
                  <p style={{ 
                    fontSize: `${fontSize.secondaryHeading - 2}px`,
                    color: accentColor,
                  }}>
                    {personalDetails.jobTitle}
                  </p>
                )}
              </div>
              
              {/* Contact Info - Right side */}
              <div style={{ textAlign: "right", fontSize: `${fontSize.body - 1}px` }}>
                {/* Line 1: Email • Phone */}
                <div style={{ display: "flex" }}>
                  {personalDetails?.email && (
                    <p style={{ color: accentColor }}>{personalDetails.email}</p>
                  )}
                  {personalDetails?.email && personalDetails?.phone && (
                    <span style={{ color: accentColor }}>&nbsp;•&nbsp;</span>
                  )}
                  {personalDetails?.phone && (
                    <p style={{ color: accentColor }}>{personalDetails.phone}</p>
                  )}
                </div>
                
                {/* Line 2: LinkedIn • Website OR LinkedIn • Location (if no website) */}
                {personalDetails?.website ? (
                  // Si website existe: LinkedIn • Website
                  <div style={{ display: "flex" }}>
                    {personalDetails?.linkedin && (
                      <p style={{ color: accentColor }}>{personalDetails.linkedin}</p>
                    )}
                    {personalDetails?.linkedin && personalDetails?.website && (
                      <span style={{ color: accentColor }}>&nbsp;•&nbsp;</span>
                    )}
                    <p style={{ color: accentColor }}>{personalDetails.website}</p>
                  </div>
                ) : (
                  // Si pas de website: LinkedIn • Location
                  (personalDetails?.linkedin || personalDetails?.location) && (
                    <div style={{ display: "flex" }}>
                      {personalDetails?.linkedin && (
                        <p style={{ color: accentColor }}>{personalDetails.linkedin}</p>
                      )}
                      {personalDetails?.linkedin && personalDetails?.location && (
                        <span style={{ color: accentColor }}>&nbsp;•&nbsp;</span>
                      )}
                      {personalDetails?.location && (
                        <p style={{ color: accentColor }}>{personalDetails.location}</p>
                      )}
                    </div>
                  )
                )}
                
                {/* Line 3: Location (only if website exists) */}
                {personalDetails?.website && personalDetails?.location && (
                  <div style={{ display: "flex" }}>
                    <p style={{ color: accentColor }}>{personalDetails.location}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Summary */}
            {professionalSummary && (
              <div style={{ marginBottom: spacing.sections + "px" }}>
                <p style={{ 
                  lineHeight: "1.625",
                  color: accentColor,
                }}>
                  {professionalSummary}
                </p>
              </div>
            )}

            {/* Selected Achievements */}
            {selectedAchievements && selectedAchievements.length > 0 && (
              <div style={{ marginBottom: spacing.sections + "px" }}>
                <h2 
                  style={{ 
                    fontFamily: fonts.primary,
                    fontSize: `${fontSize.secondaryHeading}px`,
                    fontWeight: fontWeight.secondaryHeading,
                    marginBottom: "16px",
                    color: accentColor,
                  }}
                >
                  Selected Achievements
                </h2>
                <ul style={{ listStyle: "none", padding: "0", margin: "0" }}>
                  {selectedAchievements.map((achievement, index) => (
                    <li key={index} style={{ display: "flex", alignItems: "flex-start", marginBottom: "8px" }}>
                      <span style={{ color: "#4B5563", marginRight: "12px" }}>•</span>
                      <span style={{ color: "#4B5563" }}>{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Education and Credentials */}
            {education && education.length > 0 && (
              <div style={{ marginBottom: spacing.sections + "px" }}>
                <h2 
                  style={{ 
                    fontFamily: fonts.primary,
                    fontSize: `${fontSize.secondaryHeading}px`,
                    fontWeight: fontWeight.secondaryHeading,
                    marginBottom: "16px",
                    color: accentColor,
                  }}
                >
                  Education and Credentials
                </h2>
                
                {education.map((edu, index) => (
                  <div key={index} style={{ marginBottom: "16px" }}>
                    <h3 style={{ 
                      fontSize: `${fontSize.body}px`,
                      fontWeight: fontWeight.secondaryHeading,
                      color: accentColor,
                      marginBottom: "4px",
                    }}>
                      {edu.degree}
                      {edu.fieldOfStudy && ` in ${edu.fieldOfStudy}`}
                    </h3>
                    <p style={{ 
                      color: "#4B5563",
                      marginLeft: "16px",
                    }}>
                      {edu.institution}
                      {edu.location && `, ${edu.location}`}
                      {(edu.graduationDate || edu.endDate) && (
                        <span> ({edu.graduationDate || edu.endDate})</span>
                      )}
                    </p>
                  </div>
                ))}

                {/* Certifications */}
                {certifications && certifications.length > 0 && (
                  <>
                    {certifications.map((cert, index) => (
                      <div key={index} style={{ marginBottom: "16px" }}>
                        <h3 style={{ 
                          fontSize: `${fontSize.body}px`,
                          fontWeight: fontWeight.secondaryHeading,
                          color: accentColor,
                          marginBottom: "4px",
                        }}>
                          {cert.name}
                        </h3>
                        <p style={{ 
                          color: "#4B5563",
                          marginLeft: "16px",
                        }}>
                          {cert.issuer}
                          {cert.date && ` (${cert.date})`}
                        </p>
                      </div>
                    ))}
                  </>
                )}
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
                    marginBottom: "16px",
                    color: accentColor,
                  }}
                >
                  Professional Experience
                </h2>
                
                {professionalExperience.map((exp, index) => (
                  <div key={index} style={{ marginBottom: "24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                      <div>
                        <h3 style={{ 
                          fontSize: `${fontSize.body}px`,
                          fontWeight: fontWeight.secondaryHeading,
                          color: accentColor,
                          marginBottom: "4px",
                        }}>
                          {exp.jobTitle}
                          {exp.company && `, ${exp.company}`}
                          {exp.location && `, ${exp.location}`}
                        </h3>
                        {exp.company && (
                          <p style={{ 
                            marginLeft: "16px",
                            color: accentColor,
                          }}>
                            {exp.company}
                            {(exp.startDate || exp.endDate) && (
                              <span> ({exp.startDate} - {exp.endDate || "Present"})</span>
                            )}
                          </p>
                        )}
                      </div>
                      {(exp.startDate || exp.endDate) && (
                        <p style={{ color: accentColor }}>
                          {exp.startDate} - {exp.endDate || "Present"}
                        </p>
                      )}
                    </div>
                    
                    {exp.description && (
                      <p style={{ 
                        color: "#4B5563",
                        marginBottom: "12px",
                      }}>
                        {exp.description}
                      </p>
                    )}
                    
                    {exp.achievements && exp.achievements.length > 0 && (
                      <ul style={{ listStyle: "none", padding: "0", margin: "0 0 12px 0" }}>
                        {exp.achievements.map((achievement, i) => (
                          <li key={i} style={{ display: "flex", alignItems: "flex-start", marginBottom: "8px" }}>
                            <span style={{ color: "#4B5563", marginRight: "12px" }}>•</span>
                            <span style={{ color: "#4B5563" }}>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

AcademicTemplate.displayName = "AcademicTemplate";

export default AcademicTemplate;