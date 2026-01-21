/**
 * Exports a CV to PDF by rendering HTML to canvas and converting to PDF
 * Uses html2canvas and jspdf for high-quality PDF generation
 */

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export async function exportCVToPDF(
  previewElement: HTMLElement,
  fileName: string = "resume.pdf"
): Promise<void> {
  // Find the actual CV preview element
  const cvPreview = previewElement.querySelector('[data-cv-preview="true"]') || previewElement;
  
  try {
    // A4 dimensions in mm and pixels (at 72 DPI)
    const a4WidthMm = 210;
    const a4HeightMm = 297;
    const a4WidthPx = 595;
    const a4HeightPx = 842;

    // Render the HTML element to canvas with high quality
    const canvas = await html2canvas(cvPreview as HTMLElement, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: a4WidthPx,
      windowHeight: cvPreview.scrollHeight,
    });

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Calculate dimensions
    const imgWidth = a4WidthMm;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // If content fits on one page
    if (imgHeight <= a4HeightMm) {
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    } else {
      // Multi-page handling
      let position = 0;
      const pageHeight = (canvas.width * a4HeightMm) / imgWidth;
      
      while (position < canvas.height) {
        if (position > 0) {
          pdf.addPage();
        }
        
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        pageCanvas.height = Math.min(pageHeight, canvas.height - position);
        
        const ctx = pageCanvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(
            canvas,
            0, position,
            canvas.width, pageCanvas.height,
            0, 0,
            canvas.width, pageCanvas.height
          );
          
          const pageImgData = pageCanvas.toDataURL('image/png');
          const currentPageHeight = (pageCanvas.height * imgWidth) / pageCanvas.width;
          pdf.addImage(pageImgData, 'PNG', 0, 0, imgWidth, currentPageHeight);
        }
        
        position += pageHeight;
      }
    }

    // Save the PDF
    pdf.save(fileName);
  } catch (error) {
    console.error('PDF export error:', error);
    throw new Error('Failed to export PDF. Please try again.');
  }
}