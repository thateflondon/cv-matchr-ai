import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  BorderStyle,
  Table,
  convertInchesToTwip,
} from "docx";
import type { CVData } from "~/types/cv-builder";
import pkg from "file-saver";
const { saveAs } = pkg;

/**
 * Exports CV data to a DOCX file
 * Preserves section hierarchy and structure
 */
export async function exportCVToDocx(
  cvData: CVData,
  fileName: string = "resume.docx"
): Promise<void> {
  const { personalDetails, professionalSummary, professionalExperience, education, skillsData, languages } = cvData;

  const children: (Paragraph | Table)[] = [];

  // Header - Name
  if (personalDetails?.firstName || personalDetails?.lastName) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${personalDetails?.firstName || ""} ${personalDetails?.lastName || ""}`.trim(),
            bold: true,
            size: 48, // 24pt
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
      })
    );
  }

  // Job Title
  if (personalDetails?.jobTitle) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: personalDetails.jobTitle,
            size: 28, // 14pt
            color: "666666",
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      })
    );
  }

  // Contact Info
  const contactParts: string[] = [];
  if (personalDetails?.email) contactParts.push(personalDetails.email);
  if (personalDetails?.phone) contactParts.push(personalDetails.phone);
  if (personalDetails?.location) contactParts.push(personalDetails.location);
  if (personalDetails?.linkedin) contactParts.push(personalDetails.linkedin);

  if (contactParts.length > 0) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: contactParts.join(" | "),
            size: 20, // 10pt
            color: "666666",
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
      })
    );
  }

  // Divider
  children.push(createDivider());

  // Professional Summary
  if (professionalSummary) {
    children.push(createSectionHeading("PROFESSIONAL SUMMARY"));
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: stripHtml(professionalSummary),
            size: 22, // 11pt
          }),
        ],
        spacing: { after: 300 },
      })
    );
  }

  // Professional Experience
  if (professionalExperience && professionalExperience.length > 0) {
    children.push(createSectionHeading("PROFESSIONAL EXPERIENCE"));

    for (const exp of professionalExperience) {
      // Job Title and Company
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: exp.jobTitle || "",
              bold: true,
              size: 24, // 12pt
            }),
            new TextRun({
              text: exp.company ? ` at ${exp.company}` : "",
              size: 24,
            }),
          ],
          spacing: { before: 200, after: 50 },
        })
      );

      // Date and Location
      const dateParts: string[] = [];
      if (exp.location) dateParts.push(exp.location);
      if (exp.startDate || exp.endDate) {
        dateParts.push(`${exp.startDate || ""} - ${exp.endDate || "Present"}`);
      }

      if (dateParts.length > 0) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: dateParts.join(" | "),
                size: 20, // 10pt
                italics: true,
                color: "666666",
              }),
            ],
            spacing: { after: 100 },
          })
        );
      }

      // Description
      if (exp.description) {
        const descriptionText = stripHtml(exp.description);
        // Split by bullet points if present
        const bullets = descriptionText.split(/[•\-\n]/).filter((s) => s.trim());

        for (const bullet of bullets) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `• ${bullet.trim()}`,
                  size: 22,
                }),
              ],
              indent: { left: convertInchesToTwip(0.25) },
              spacing: { after: 50 },
            })
          );
        }
      }

      // Achievements
      if (exp.achievements && exp.achievements.length > 0) {
        for (const achievement of exp.achievements) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `• ${achievement}`,
                  size: 22,
                }),
              ],
              indent: { left: convertInchesToTwip(0.25) },
              spacing: { after: 50 },
            })
          );
        }
      }
    }
  }

  // Education
  if (education && education.length > 0) {
    children.push(createSectionHeading("EDUCATION"));

    for (const edu of education) {
      // Degree
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: edu.degree || "",
              bold: true,
              size: 24,
            }),
          ],
          spacing: { before: 200, after: 50 },
        })
      );

      // Institution and Date
      const eduParts: string[] = [];
      if (edu.institution) eduParts.push(edu.institution);
      if (edu.location) eduParts.push(edu.location);
      if (edu.graduationDate) eduParts.push(edu.graduationDate);

      if (eduParts.length > 0) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: eduParts.join(" | "),
                size: 22,
                color: "666666",
              }),
            ],
            spacing: { after: 100 },
          })
        );
      }

      // GPA
      if (edu.gpa) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `GPA: ${edu.gpa}`,
                size: 20,
              }),
            ],
            spacing: { after: 50 },
          })
        );
      }

      // Achievements
      if (edu.achievements && edu.achievements.length > 0) {
        for (const achievement of edu.achievements) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `• ${achievement}`,
                  size: 22,
                }),
              ],
              indent: { left: convertInchesToTwip(0.25) },
              spacing: { after: 50 },
            })
          );
        }
      }
    }
  }

  // Skills
  if (skillsData && skillsData.length > 0) {
    children.push(createSectionHeading("SKILLS"));

    const skillNames = skillsData.map((skill) => skill.name).join(", ");
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: skillNames,
            size: 22,
          }),
        ],
        spacing: { after: 200 },
      })
    );
  }

  // Languages
  if (languages && languages.length > 0) {
    children.push(createSectionHeading("LANGUAGES"));

    const langList = languages.map((lang) => {
      if (lang.level) {
        return `${lang.language} (${lang.level})`;
      }
      return lang.language;
    });

    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: langList.join(", "),
            size: 22,
          }),
        ],
        spacing: { after: 200 },
      })
    );
  }

  // Create the document
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(0.75),
              right: convertInchesToTwip(0.75),
              bottom: convertInchesToTwip(0.75),
              left: convertInchesToTwip(0.75),
            },
          },
        },
        children,
      },
    ],
  });

  // Generate and download the DOCX file
  const blob = await Packer.toBlob(doc);
  saveAs(blob, fileName);
}

/**
 * Create a section heading paragraph
 */
function createSectionHeading(text: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        bold: true,
        size: 26, // 13pt
        color: "333333",
      }),
    ],
    spacing: { before: 400, after: 150 },
    border: {
      bottom: {
        color: "cccccc",
        space: 1,
        style: BorderStyle.SINGLE,
        size: 6,
      },
    },
  });
}

/**
 * Create a divider line
 */
function createDivider(): Paragraph {
  return new Paragraph({
    children: [],
    border: {
      bottom: {
        color: "e5e7eb",
        space: 1,
        style: BorderStyle.SINGLE,
        size: 6,
      },
    },
    spacing: { after: 300 },
  });
}

/**
 * Strip HTML tags from a string
 */
function stripHtml(html: string): string {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}
