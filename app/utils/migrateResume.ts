import { extractTextFromPdf } from "~/lib/pdf2img";
import { parseResumeTextWithAI } from "./pdfDataExtractor";

/**
 * Migrates an old resume by re-extracting text and parsing it with AI
 * This is useful for resumes uploaded before the PDF extraction feature was added
 */
export async function migrateResumeData(
  resume: Resume,
  fs: any,
  ai: any
): Promise<Resume> {
  try {
    // If the resume already has parsedData, return it as-is
    if (resume.parsedData) {
      return resume;
    }

    // If we have extractedText but no parsedData, just parse it
    if (resume.extractedText && resume.extractedText.length > 0) {
      const parsedData = await parseResumeTextWithAI(resume.extractedText, ai);

      return {
        ...resume,
        parsedData,
      };
    }

    // If we have neither, we need to re-download the PDF and extract text
    
    // Download the PDF file from Puter
    const fileContent = await fs.read(resume.resumePath);
    
    // Convert ArrayBuffer to File
    const blob = new Blob([fileContent], { type: "application/pdf" });
    const file = new File([blob], "resume.pdf", { type: "application/pdf" });
    
    // Extract text from PDF
    const extractedTextResult = await extractTextFromPdf(file);
    
    if (extractedTextResult.error || !extractedTextResult.text) {
      console.error("Failed to extract text from PDF:", extractedTextResult.error);
      return resume;
    }

    // Parse with AI
    const parsedData = await parseResumeTextWithAI(extractedTextResult.text, ai);

    return {
      ...resume,
      extractedText: extractedTextResult.text,
      parsedData,
    };
  } catch (error) {
    console.error("Failed to migrate resume:", error);
    return resume; // Return original resume on error
  }
}