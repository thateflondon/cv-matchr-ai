/**
 * Helper functions for rendering CV templates
 */

/**
 * Converts plain text with line breaks into formatted JSX with preserved line breaks
 * Respects bullet points (-, *, •) and line breaks
 */
export function formatTextWithLineBreaks(text: string | undefined): string[] {
  if (!text) return [];
  
  // Split by line breaks
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  return lines;
}

/**
 * Detects if a line is a bullet point
 */
export function isBulletPoint(line: string): boolean {
  return /^[-*•]\s/.test(line);
}

/**
 * Removes bullet point prefix from a line
 */
export function removeBulletPrefix(line: string): string {
  return line.replace(/^[-*•]\s/, '').trim();
}

/**
 * Sanitizes professional summary text by removing "Profil:" prefix if present
 */
export function sanitizeProfessionalSummary(text: string | undefined): string {
  if (!text) return '';
  
  // Remove "Profil:" or "Profile:" prefix (case insensitive)
  return text.replace(/^(Profil|Profile)\s*:\s*/i, '').trim();
}