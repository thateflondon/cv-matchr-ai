import jsPDF from "jspdf";
import type { CVData } from "./cvStore";

// Configuration des polices et couleurs
const FONTS = {
  inter: "helvetica",
  roboto: "helvetica",
  "open-sans": "helvetica",
  lato: "helvetica",
  poppins: "helvetica",
};

const COLORS = {
  blue: { r: 59, g: 130, b: 246 },
  purple: { r: 168, g: 85, b: 247 },
  green: { r: 34, g: 197, b: 94 },
  gray: { r: 75, g: 85, b: 99 },
  red: { r: 239, g: 68, b: 68 },
};

const FONT_SIZES = {
  small: { title: 22, heading: 14, subheading: 11, body: 9 },
  medium: { title: 24, heading: 16, subheading: 12, body: 10 },
  large: { title: 26, heading: 18, subheading: 13, body: 11 },
};

// Traductions des sections
const TRANSLATIONS = {
  fr: {
    about: "À propos",
    experience: "Expérience professionnelle",
    education: "Formation",
    skills: "Compétences",
    languages: "Langues",
    interests: "Centres d'intérêt",
    present: "Présent",
  },
  en: {
    about: "About",
    experience: "Professional Experience",
    education: "Education",
    skills: "Skills",
    languages: "Languages",
    interests: "Interests",
    present: "Present",
  },
};

// Fonction de formatage des dates
function formatDate(dateString: string, format: "fr" | "en", isCurrent: boolean): string {
  if (isCurrent) {
    return format === "fr" ? "Présent" : "Present";
  }
  
  if (!dateString) return "";
  
  const date = new Date(dateString + "-01"); // Ajoute un jour pour parser correctement
  const month = date.getMonth();
  const year = date.getFullYear();
  
  const monthsFr = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
  const monthsEn = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  if (format === "fr") {
    return `${monthsFr[month]} ${year}`;
  } else {
    return `${monthsEn[month]} ${year}`;
  }
}

// Template Modern
function generateModernTemplate(pdf: jsPDF, cv: CVData): void {
  const { personalInfo, about, experiences, education, skills, languages, interests, settings } = cv;
  const t = TRANSLATIONS[settings.language];
  const sizes = FONT_SIZES[settings.fontSize];
  const color = COLORS[settings.colorScheme];
  
  let yPos = 20;
  const margin = 20;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const contentWidth = pageWidth - 2 * margin;

  // Header avec couleur
  pdf.setFillColor(color.r, color.g, color.b);
  pdf.rect(0, 0, pageWidth, 50, "F");
  
  // Nom et titre
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(sizes.title);
  pdf.setFont("helvetica", "bold");
  pdf.text(`${personalInfo.firstName} ${personalInfo.lastName}`, margin, 25);
  
  pdf.setFontSize(sizes.heading);
  pdf.setFont("helvetica", "normal");
  pdf.text(personalInfo.title || "", margin, 35);
  
  yPos = 60;
  
  // Informations de contact
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(sizes.body);
  const contactInfo = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location,
    personalInfo.linkedin,
    personalInfo.website,
  ].filter(Boolean).join(" • ");
  
  pdf.text(contactInfo, margin, yPos, { maxWidth: contentWidth });
  yPos += 15;
  
  // À propos
  if (about) {
    pdf.setFontSize(sizes.heading);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(color.r, color.g, color.b);
    pdf.text(t.about, margin, yPos);
    yPos += 8;
    
    pdf.setFontSize(sizes.body);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(0, 0, 0);
    const aboutLines = pdf.splitTextToSize(about, contentWidth);
    pdf.text(aboutLines, margin, yPos);
    yPos += aboutLines.length * 5 + 10;
  }
  
  // Expériences
  if (experiences.length > 0) {
    pdf.setFontSize(sizes.heading);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(color.r, color.g, color.b);
    pdf.text(t.experience, margin, yPos);
    yPos += 10;
    
    experiences.forEach((exp) => {
      // Vérifier si on a besoin d'une nouvelle page
      if (yPos > 250) {
        pdf.addPage();
        yPos = 20;
      }
      
      pdf.setFontSize(sizes.subheading);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      pdf.text(exp.position, margin, yPos);
      
      pdf.setFontSize(sizes.body);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(100, 100, 100);
      const dateRange = `${formatDate(exp.startDate, settings.dateFormat, false)} - ${formatDate(exp.endDate, settings.dateFormat, exp.current)}`;
      pdf.text(`${exp.company} • ${exp.location}`, margin, yPos + 5);
      pdf.text(dateRange, margin, yPos + 10);
      yPos += 18;
      
      if (exp.description) {
        pdf.setTextColor(0, 0, 0);
        const descLines = pdf.splitTextToSize(exp.description, contentWidth);
        pdf.text(descLines, margin, yPos);
        yPos += descLines.length * 4 + 8;
      }
    });
    
    yPos += 5;
  }
  
  // Formation
  if (education.length > 0) {
    if (yPos > 220) {
      pdf.addPage();
      yPos = 20;
    }
    
    pdf.setFontSize(sizes.heading);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(color.r, color.g, color.b);
    pdf.text(t.education, margin, yPos);
    yPos += 10;
    
    education.forEach((edu) => {
      if (yPos > 250) {
        pdf.addPage();
        yPos = 20;
      }
      
      pdf.setFontSize(sizes.subheading);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      pdf.text(`${edu.degree} - ${edu.field}`, margin, yPos);
      
      pdf.setFontSize(sizes.body);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(100, 100, 100);
      const dateRange = `${formatDate(edu.startDate, settings.dateFormat, false)} - ${formatDate(edu.endDate, settings.dateFormat, edu.current)}`;
      pdf.text(`${edu.school} • ${edu.location}`, margin, yPos + 5);
      pdf.text(dateRange, margin, yPos + 10);
      yPos += 18;
      
      if (edu.description) {
        pdf.setTextColor(0, 0, 0);
        const descLines = pdf.splitTextToSize(edu.description, contentWidth - 10);
        pdf.text(descLines, margin, yPos);
        yPos += descLines.length * 4 + 8;
      }
    });
    
    yPos += 5;
  }
  
  // Compétences et Langues côte à côte
  if (skills.length > 0 || languages.length > 0) {
    if (yPos > 200) {
      pdf.addPage();
      yPos = 20;
    }
    
    const columnWidth = contentWidth / 2 - 5;
    
    // Compétences (colonne gauche)
    if (skills.length > 0) {
      pdf.setFontSize(sizes.heading);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(color.r, color.g, color.b);
      pdf.text(t.skills, margin, yPos);
      
      let skillY = yPos + 8;
      pdf.setFontSize(sizes.body);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(0, 0, 0);
      
      skills.slice(0, 10).forEach((skill) => {
        pdf.text(`• ${skill.name}`, margin, skillY);
        skillY += 5;
      });
    }
    
    // Langues (colonne droite)
    if (languages.length > 0) {
      pdf.setFontSize(sizes.heading);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(color.r, color.g, color.b);
      pdf.text(t.languages, margin + columnWidth + 10, yPos);
      
      let langY = yPos + 8;
      pdf.setFontSize(sizes.body);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(0, 0, 0);
      
      languages.forEach((lang) => {
        pdf.text(`• ${lang.name} (${lang.level})`, margin + columnWidth + 10, langY);
        langY += 5;
      });
    }
    
    yPos += Math.max(skills.length, languages.length) * 5 + 15;
  }
  
  // Centres d'intérêt
  if (interests.length > 0 && yPos < 260) {
    pdf.setFontSize(sizes.heading);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(color.r, color.g, color.b);
    pdf.text(t.interests, margin, yPos);
    yPos += 8;
    
    pdf.setFontSize(sizes.body);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(0, 0, 0);
    const interestsText = interests.map(i => i.name).join(", ");
    const interestsLines = pdf.splitTextToSize(interestsText, contentWidth);
    pdf.text(interestsLines, margin, yPos);
  }
}

// Fonction principale d'export
export async function generateCVPDF(cv: CVData): Promise<Blob> {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });
  
  // Selon le template choisi, appliquer le bon générateur
  switch (cv.settings.template) {
    case "modern":
      generateModernTemplate(pdf, cv);
      break;
    case "classic":
      // TODO: Implémenter les autres templates
      generateModernTemplate(pdf, cv);
      break;
    case "minimal":
      generateModernTemplate(pdf, cv);
      break;
    case "professional":
      generateModernTemplate(pdf, cv);
      break;
    case "creative":
      generateModernTemplate(pdf, cv);
      break;
    default:
      generateModernTemplate(pdf, cv);
  }
  
  return pdf.output("blob");
}

// Fonction helper pour télécharger directement
export async function downloadCVPDF(cv: CVData): Promise<void> {
  const blob = await generateCVPDF(cv);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${cv.personalInfo.firstName}_${cv.personalInfo.lastName}_CV.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}