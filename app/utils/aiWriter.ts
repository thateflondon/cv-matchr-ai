import type { CVData, CVProfessionalExperience, CVEducation, Skill } from "~/types/cv-builder";

// AI Writer utility for CV sections
// Uses Puter AI to generate ATS-friendly content

export interface AIWriterContext {
  cvData: CVData;
  targetJobTitle?: string;
}

export interface AIWriterResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Extract context from CV data for better AI generation
function buildContextFromCV(cvData: CVData): string {
  const parts: string[] = [];

  if (cvData.personalDetails?.jobTitle) {
    parts.push(`Current/Target Role: ${cvData.personalDetails.jobTitle}`);
  }

  if (cvData.professionalExperience?.length > 0) {
    const expSummary = cvData.professionalExperience
      .slice(0, 3)
      .map(exp => `${exp.jobTitle} at ${exp.company}`)
      .join(", ");
    parts.push(`Experience: ${expSummary}`);
  }

  const skillsData = cvData.skillsData;
  const skills = cvData.skills;

  if (skillsData && skillsData.length > 0) {
    const skillNames = skillsData.slice(0, 10).map(s => s.name).join(", ");
    parts.push(`Skills: ${skillNames}`);
  } else if (skills && skills.length > 0) {
    parts.push(`Skills: ${skills.slice(0, 10).join(", ")}`);
  }

  if (cvData.education?.length > 0) {
    const eduSummary = cvData.education
      .slice(0, 2)
      .map(edu => `${edu.degree} from ${edu.institution}`)
      .join(", ");
    parts.push(`Education: ${eduSummary}`);
  }

  return parts.join("\n");
}

// Generate Professional Summary
export async function generateProfessionalSummary(
  aiChat: (prompt: string, options?: { model?: string }) => Promise<{ message: { content: string | { text: string }[] } } | undefined>,
  cvData: CVData
): Promise<AIWriterResult<string>> {
  const context = buildContextFromCV(cvData);

  const prompt = `You are an expert CV writer. Generate a professional summary for a resume.

CONTEXT:
${context || "No context provided - generate a generic but professional summary"}

REQUIREMENTS:
- Write 2-4 sentences (400-600 characters total)
- Start with the professional identity or current role
- Highlight 2-3 key achievements or areas of expertise
- Mention years of experience if inferable from context
- Include specific industries or technologies when relevant
- End with career goals or value proposition
- Use active voice and strong action verbs
- Be ATS-friendly (no special characters, tables, or graphics)
- Do NOT use first person pronouns (I, me, my)
- Do NOT include placeholder text like [X years] or [Company]

OUTPUT FORMAT:
Return ONLY the professional summary text, nothing else. No quotes, no labels, just the summary.`;

  try {
    const response = await aiChat(prompt, { model: "gpt-5.2" });
    if (!response) {
      return { success: false, error: "AI service unavailable" };
    }

    const content = typeof response.message.content === "string"
      ? response.message.content
      : response.message.content[0]?.text || "";

    // Clean up the response
    const cleanedContent = content
      .replace(/^["']|["']$/g, "") // Remove surrounding quotes
      .replace(/^(Professional Summary|Summary):?\s*/i, "") // Remove label if present
      .trim();

    return { success: true, data: cleanedContent };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate summary"
    };
  }
}

// Generate Experience Description
export async function generateExperienceDescription(
  aiChat: (prompt: string, options?: { model?: string }) => Promise<{ message: { content: string | { text: string }[] } } | undefined>,
  experience: CVProfessionalExperience,
  cvData: CVData
): Promise<AIWriterResult<string>> {
  const context = buildContextFromCV(cvData);

  const prompt = `You are an expert CV writer. Generate a job description for a resume entry.

JOB DETAILS:
- Job Title: ${experience.jobTitle || "Not specified"}
- Company: ${experience.company || "Not specified"}
- Location: ${experience.location || "Not specified"}
- Period: ${experience.startDate || "?"} - ${experience.endDate || "Present"}

CANDIDATE CONTEXT:
${context}

REQUIREMENTS:
- Write 3-5 bullet points describing responsibilities and achievements
- Each bullet should start with a strong action verb (Led, Developed, Managed, Implemented, etc.)
- Include quantifiable results where possible (percentages, numbers, metrics)
- Focus on impact and value delivered, not just tasks
- Use industry-appropriate terminology
- Be ATS-friendly (no special characters or emojis)
- Total length: 200-400 characters
- Format as bullet points using "• " (bullet point followed by space)

OUTPUT FORMAT:
Return ONLY the bullet points, each on a new line starting with "• ". No quotes, no labels.`;

  try {
    const response = await aiChat(prompt, { model: "gpt-5.2" });
    if (!response) {
      return { success: false, error: "AI service unavailable" };
    }

    const content = typeof response.message.content === "string"
      ? response.message.content
      : response.message.content[0]?.text || "";

    // Clean up the response
    const cleanedContent = content
      .replace(/^["']|["']$/g, "")
      .replace(/^(Description|Responsibilities):?\s*/i, "")
      .trim();

    return { success: true, data: cleanedContent };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate description"
    };
  }
}

// Generate Education Description/Achievements
export async function generateEducationDescription(
  aiChat: (prompt: string, options?: { model?: string }) => Promise<{ message: { content: string | { text: string }[] } } | undefined>,
  education: CVEducation,
  cvData: CVData
): Promise<AIWriterResult<string>> {
  const context = buildContextFromCV(cvData);

  const prompt = `You are an expert CV writer. Generate an education description for a resume entry.

EDUCATION DETAILS:
- Degree: ${education.degree || "Not specified"}
- Institution: ${education.institution || "Not specified"}
- Location: ${education.location || "Not specified"}
- Graduation: ${education.graduationDate || "Not specified"}
- GPA: ${education.gpa || "Not specified"}

CANDIDATE CONTEXT:
${context}

REQUIREMENTS:
- Write 2-4 bullet points highlighting academic achievements
- Include relevant coursework, honors, or distinctions if applicable
- Mention relevant projects, thesis, or research if degree suggests it
- Include extracurricular activities that demonstrate leadership or skills
- Be ATS-friendly (no special characters or emojis)
- Format as bullet points using "• " (bullet point followed by space)
- Keep concise but impactful

OUTPUT FORMAT:
Return ONLY the bullet points, each on a new line starting with "• ". No quotes, no labels.`;

  try {
    const response = await aiChat(prompt, { model: "gpt-5.2" });
    if (!response) {
      return { success: false, error: "AI service unavailable" };
    }

    const content = typeof response.message.content === "string"
      ? response.message.content
      : response.message.content[0]?.text || "";

    // Clean up the response
    const cleanedContent = content
      .replace(/^["']|["']$/g, "")
      .replace(/^(Description|Achievements):?\s*/i, "")
      .trim();

    return { success: true, data: cleanedContent };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate description"
    };
  }
}

// Generate Skills Suggestions
export async function generateSkillsSuggestions(
  aiChat: (prompt: string, options?: { model?: string }) => Promise<{ message: { content: string | { text: string }[] } } | undefined>,
  cvData: CVData
): Promise<AIWriterResult<Skill[]>> {
  const context = buildContextFromCV(cvData);
  const existingSkillsFromData = cvData.skillsData?.map(s => s.name) ?? [];
  const existingSkillsFromArray = cvData.skills ?? [];
  const existingSkills = existingSkillsFromData.length > 0
    ? existingSkillsFromData.join(", ")
    : existingSkillsFromArray.join(", ");

  const prompt = `You are an expert CV writer and career advisor. Suggest relevant skills for a resume.

CANDIDATE CONTEXT:
${context}

EXISTING SKILLS (do not repeat these):
${existingSkills || "None"}

REQUIREMENTS:
- Suggest 5-10 relevant skills based on the candidate's experience and target role
- Include a mix of:
  - Technical/hard skills specific to the industry
  - Soft skills that are valuable for the role
  - Tools and technologies commonly used in the field
- Skills should be ATS-friendly (use standard industry terminology)
- Each skill should be 1-3 words maximum
- Do NOT include skills already listed above

OUTPUT FORMAT:
Return a JSON array of skill objects with this exact structure:
[
  {"name": "Skill Name", "level": "experienced"},
  {"name": "Another Skill", "level": "skillful"}
]

Valid levels: "novice", "beginner", "skillful", "experienced", "expert"
Choose appropriate levels based on the candidate's apparent experience.
Return ONLY the JSON array, no other text.`;

  try {
    const response = await aiChat(prompt, { model: "gpt-5.2" });
    if (!response) {
      return { success: false, error: "AI service unavailable" };
    }

    const content = typeof response.message.content === "string"
      ? response.message.content
      : response.message.content[0]?.text || "";

    // Clean up and parse JSON
    const cleanedContent = content
      .replace(/```json\s*/g, "")
      .replace(/```\s*/g, "")
      .trim();

    const skills: Array<{ name: string; level?: string }> = JSON.parse(cleanedContent);

    // Add unique IDs to each skill
    const skillsWithIds: Skill[] = skills.map((skill, index) => ({
      id: `ai-${Date.now()}-${index}`,
      name: skill.name,
      level: skill.level || "skillful",
    }));

    return { success: true, data: skillsWithIds };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate skills"
    };
  }
}
