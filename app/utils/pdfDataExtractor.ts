import type { CVData } from "~/types/cv-builder";

/**
 * Parses raw resume text into structured CV data using AI
 * This function sends the text to Puter AI to extract structured information
 */
export async function parseResumeTextWithAI(
  resumeText: string,
  aiService: any
): Promise<CVData | null> {
  try {
    const prompt = `You are an expert resume parser. Extract ALL information from this resume text and return ONLY a valid JSON object (no markdown, no code blocks, no explanation).

Resume Text:
${resumeText}

Return a JSON object with this EXACT structure:
{
  "personalDetails": {
    "firstName": "John",
    "lastName": "Doe",
    "jobTitle": "Senior Software Engineer",
    "email": "john.doe@email.com",
    "phone": "+1234567890",
    "location": "San Francisco, CA",
    "linkedin": "https://linkedin.com/in/johndoe",
    "website": "https://johndoe.com"
  },
  "professionalSummary": "Experienced software engineer with 10+ years...",
  "professionalExperience": [
    {
      "jobTitle": "Senior Software Engineer",
      "company": "Tech Corp",
      "location": "San Francisco, CA",
      "startDate": "01/2020",
      "endDate": "Present",
      "description": "Led development of microservices...",
      "achievements": [
        "Increased system performance by 40%",
        "Mentored 5 junior developers"
      ]
    }
  ],
  "education": [
    {
      "degree": "Bachelor of Science in Computer Science",
      "institution": "Stanford University",
      "location": "Stanford, CA",
      "graduationDate": "06/2015",
      "isCurrentlyStudying": false,
      "gpa": "3.8/4.0",
      "achievements": ["Dean's List", "Honors Graduate"]
    }
  ],
  "skills": ["JavaScript", "React", "Node.js", "Python", "AWS"],
  "accomplishments": ["Published 3 research papers", "Won hackathon 2023"],
  "powerStatement": "Award-winning software engineer with proven track record of delivering scalable solutions",
  "additionalSections": []
}

CRITICAL INSTRUCTIONS:
- Extract EVERY piece of information from the resume
- For dates: Use MM/YYYY format (e.g., "01/2020", "06/2015")
- For current positions/studies: Use "Present" as endDate
- For achievements: Extract bullet points as array items
- For skills: Extract ALL skills mentioned anywhere in the resume
- If a field is not found, use empty string "" or empty array []
- Preserve exact company names, job titles, and locations as written
- Return ONLY the JSON object, no additional text`;

    // Use Puter AI to parse the resume
    const response = await aiService.chat([
      {
        role: "user",
        content: prompt,
      },
    ]);

    if (!response || !response.message || !response.message.content) {
      console.error("Invalid AI response");
      return null;
    }

    const content =
      typeof response.message.content === "string"
        ? response.message.content
        : response.message.content[0]?.text || "";

    // Clean the response (remove markdown code blocks if present)
    let cleanedContent = content.trim();
    if (cleanedContent.startsWith("```json")) {
      cleanedContent = cleanedContent.replace(/```json\n?/, "").replace(/```\n?$/, "");
    } else if (cleanedContent.startsWith("```")) {
      cleanedContent = cleanedContent.replace(/```\n?/, "").replace(/```\n?$/, "");
    }

    const parsedData = JSON.parse(cleanedContent) as CVData;

    // Sanitize professional summary to remove "Profil:" or "Profile:" prefix
    if (parsedData.professionalSummary) {
      parsedData.professionalSummary = parsedData.professionalSummary
        .replace(/^(Profil|Profile)\s*:\s*/i, '')
        .trim();
    }

    return parsedData;
  } catch (error) {
    console.error("Failed to parse resume text with AI:", error);
    return null;
  }
}

/**
 * Extracts structured CV data from a Resume object that was already analyzed
 * This is used when loading an existing resume into the builder
 */
export function extractCVDataFromAnalyzedResume(
  resume: Resume,
  extractedText?: string
): CVData {
  // If we have extracted text from the PDF, we should have already parsed it
  // For now, we'll return a basic structure with what we know from the Resume object
  
  return {
    personalDetails: {
      firstName: "",
      lastName: "",
      jobTitle: resume.jobTitle || "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      website: "",
    },
    professionalSummary: "",
    professionalExperience: [],
    education: [],
    skills: extractSkillsFromFeedback(resume.feedback),
    accomplishments: [],
    powerStatement: "",
    additionalSections: [],
  };
}

/**
 * Extracts skills mentioned in feedback tips
 */
function extractSkillsFromFeedback(feedback: Feedback): string[] {
  const skills: string[] = [];

  // Extract skills from "good" tips
  feedback.skills.tips.forEach((tip) => {
    if (tip.type === "good") {
      // Try to extract skills from the tip text
      const skillMatches = tip.tip.match(/["']([^"']+)["']/g);
      if (skillMatches) {
        skillMatches.forEach((match) => {
          const skill = match.replace(/["']/g, "");
          if (skill && !skills.includes(skill)) {
            skills.push(skill);
          }
        });
      }
    }
  });

  return skills;
}