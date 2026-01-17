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
    const { primaryColor } = customization;
    const { personalDetails, professionalSummary, selectedAchievements, professionalExperience, education, certifications } = data;

    // Use primary color or default blue
    const accentColor = primaryColor || "#0A5F8C";

    return (
      <div
        ref={ref}
        data-cv-preview="true"
        style={{
          backgroundColor: "white",
          boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
          maxWidth: "56rem",
          margin: "0 auto",
        }}
      >
        {/* Blue left border */}
        <div style={{ display: "flex", position: "relative" }}>
          <div 
            style={{ 
              position: "absolute",
              top: "3vw",
              width: "0.5rem",
              height: "16vw",
              backgroundColor: accentColor,
            }}
          />
          
          <div style={{ flex: "1 1 0%", padding: "3rem" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
              <div>
                <h1 style={{ 
                  fontSize: "2.25rem",
                  lineHeight: "2.5rem",
                  color: accentColor,
                  marginBottom: "0.5rem",
                }}>
                  {personalDetails?.firstName} {personalDetails?.lastName}
                </h1>
                {personalDetails?.jobTitle && (
                  <p style={{ 
                    color: accentColor,
                    fontSize: "1.125rem",
                    lineHeight: "1.75rem",
                  }}>
                    {personalDetails.jobTitle}
                  </p>
                )}
              </div>
              
              {/* Contact Info - Right side */}
              <div style={{ textAlign: "right", fontSize: "0.875rem", lineHeight: "1.25rem" }}>
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
              <div style={{ marginBottom: "2rem" }}>
                <p style={{ 
                  color: accentColor,
                  lineHeight: "1.625",
                }}>
                  {professionalSummary}
                </p>
              </div>
            )}

            {/* Selected Achievements */}
            {selectedAchievements && selectedAchievements.length > 0 && (
              <div style={{ marginBottom: "2rem" }}>
                <h2 style={{ 
                  fontSize: "1.5rem",
                  lineHeight: "2rem",
                  color: accentColor,
                  marginBottom: "1rem",
                }}>
                  Selected Achievements
                </h2>
                <ul style={{ listStyle: "none", padding: "0", margin: "0" }}>
                  {selectedAchievements.map((achievement, index) => (
                    <li key={index} style={{ 
                      display: "flex",
                      alignItems: "flex-start",
                      marginTop: index > 0 ? "0.5rem" : "0",
                    }}>
                      <span style={{ color: "#374151", marginRight: "0.75rem" }}>•</span>
                      <span style={{ color: "#374151" }}>{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Education and Credentials */}
            {education && education.length > 0 && (
              <div style={{ marginBottom: "2rem" }}>
                <h2 style={{ 
                  fontSize: "1.5rem",
                  lineHeight: "2rem",
                  color: accentColor,
                  marginBottom: "1rem",
                }}>
                  Education and Credentials
                </h2>
                
                {education.map((edu, index) => (
                  <div key={index} style={{ marginBottom: "1rem" }}>
                    <h3 style={{ color: accentColor }}>
                      {edu.degree}
                      {edu.fieldOfStudy && ` in ${edu.fieldOfStudy}`}
                    </h3>
                    <p style={{ 
                      color: "#374151",
                      marginLeft: "1rem",
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
                      <div key={index} style={{ marginBottom: "1rem" }}>
                        <h3 style={{ color: accentColor }}>{cert.name}</h3>
                        <p style={{ 
                          color: "#374151",
                          marginLeft: "1rem",
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
              <div style={{ marginBottom: "2rem" }}>
                <h2 style={{ 
                  fontSize: "1.5rem",
                  lineHeight: "2rem",
                  color: accentColor,
                  marginBottom: "1rem",
                }}>
                  Professional Experience
                </h2>
                
                {professionalExperience.map((exp, index) => (
                  <div key={index} style={{ marginBottom: "1.5rem" }}>
                    <div style={{ 
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "0.75rem",
                    }}>
                      <div>
                        <h3 style={{ color: accentColor }}>
                          {exp.jobTitle}
                          {exp.company && `, ${exp.company}`}
                          {exp.location && `, ${exp.location}`}
                        </h3>
                        {exp.company && (
                          <p style={{ 
                            color: accentColor,
                            marginLeft: "1rem",
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
                        color: "#374151",
                        marginBottom: "0.75rem",
                      }}>
                        {exp.description}
                      </p>
                    )}
                    
                    {exp.achievements && exp.achievements.length > 0 && (
                      <ul style={{ 
                        listStyle: "none",
                        padding: "0",
                        margin: "0 0 0.75rem 0",
                      }}>
                        {exp.achievements.map((achievement, i) => (
                          <li key={i} style={{ 
                            display: "flex",
                            alignItems: "flex-start",
                            marginTop: i > 0 ? "0.5rem" : "0",
                          }}>
                            <span style={{ color: "#374151", marginRight: "0.75rem" }}>•</span>
                            <span style={{ color: "#374151" }}>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Page number - commented out as in original */}
            {/* <div style={{ 
              textAlign: "right",
              fontSize: "0.875rem",
              lineHeight: "1.25rem",
              color: accentColor,
              marginTop: "2rem",
            }}>
              Page 1 | 1
            </div> */}
          </div>
        </div>
      </div>
    );
  }
);

AcademicTemplate.displayName = "AcademicTemplate";

export default AcademicTemplate;