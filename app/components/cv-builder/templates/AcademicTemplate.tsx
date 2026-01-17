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
    const { personalDetails, professionalSummary, professionalExperience, education, skillsData, certifications } = data;

    // Use primary color or default blue
    const accentColor = primaryColor || "#0A5F8C";

    return (
      <div
        ref={ref}
        data-cv-preview="true"
        className="bg-white w-full shadow-lg"
      >
        {/* Blue left border */}
        <div className="flex relative">
          <div 
            className="absolute w-2" 
            style={{ 
              top: "3vw", 
              height: "16vw", 
              backgroundColor: accentColor 
            }}
          ></div>
          
          <div className="flex-1 p-12">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-4xl mb-2" style={{ color: accentColor }}>
                  {personalDetails?.firstName} {personalDetails?.lastName}
                </h1>
                {personalDetails?.jobTitle && (
                  <p className="text-lg" style={{ color: accentColor }}>
                    {personalDetails.jobTitle}
                  </p>
                )}
              </div>
              
              {/* Contact Info - Right side */}
              <div className="text-right text-sm">
                {/* Line 1: Email • Phone */}
                <div className="flex">
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
                  <div className="flex">
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
                    <div className="flex">
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
                  <div className="flex">
                    <p style={{ color: accentColor }}>{personalDetails.location}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Summary */}
            {professionalSummary && (
              <div className="mb-8">
                <p className="leading-relaxed" style={{ color: accentColor }}>
                  {professionalSummary}
                </p>
              </div>
            )}

            {/* Selected Achievements */}
            {skillsData && skillsData.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl mb-4" style={{ color: accentColor }}>
                  Selected Achievements
                </h2>
                <ul className="space-y-2">
                  {skillsData.map((skillGroup, groupIndex) =>
                    skillGroup.items?.map((item, itemIndex) => (
                      <li key={`${groupIndex}-${itemIndex}`} className="flex items-start">
                        <span className="text-gray-700 mr-3">•</span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            )}

            {/* Education and Credentials */}
            {education && education.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl mb-4" style={{ color: accentColor }}>
                  Education and Credentials
                </h2>
                
                {education.map((edu, index) => (
                  <div key={index} className="mb-4">
                    <h3 style={{ color: accentColor }}>
                      {edu.degree}
                      {edu.fieldOfStudy && ` in ${edu.fieldOfStudy}`}
                    </h3>
                    <p className="text-gray-700 ml-4">
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
                      <div key={index} className="mb-4">
                        <h3 style={{ color: accentColor }}>{cert.name}</h3>
                        <p className="text-gray-700 ml-4">
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
              <div className="mb-8">
                <h2 className="text-2xl mb-4" style={{ color: accentColor }}>
                  Professional Experience
                </h2>
                
                {professionalExperience.map((exp, index) => (
                  <div key={index} className="mb-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 style={{ color: accentColor }}>
                          {exp.jobTitle}
                          {exp.company && `, ${exp.company}`}
                          {exp.location && `, ${exp.location}`}
                        </h3>
                        {exp.company && (
                          <p className="ml-4" style={{ color: accentColor }}>
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
                      <p className="text-gray-700 mb-3">
                        {exp.description}
                      </p>
                    )}
                    
                    {exp.achievements && exp.achievements.length > 0 && (
                      <ul className="space-y-2 mb-3">
                        {exp.achievements.map((achievement, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-gray-700 mr-3">•</span>
                            <span className="text-gray-700">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Page number - commented out as in original */}
            {/* <div className="text-right text-sm mt-8" style={{ color: accentColor }}>
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