import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// A4 dimensions in mm
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

// A4 dimensions in pixels at 96 DPI (for preview)
const A4_WIDTH_PX = 952;
const A4_HEIGHT_PX = 1346;

/**
 * Exports a CV to PDF using html2canvas and jsPDF for high-quality output
 */
export async function exportCVToPDF(
  previewElement: HTMLElement,
  fileName: string = "resume.pdf"
): Promise<void> {
  // Find the actual CV preview element
  let cvPreview = previewElement.querySelector('[data-cv-preview="true"]') as HTMLElement;

  if (!cvPreview) {
    // If not found, check if previewElement itself has the attribute
    if (previewElement.getAttribute('data-cv-preview') === 'true') {
      cvPreview = previewElement;
    } else {
      throw new Error("Could not find CV preview element");
    }
  }

  // Clone the element to avoid modifying the original
  const clonedElement = cvPreview.cloneNode(true) as HTMLElement;

  // Create a temporary container for rendering
  const tempContainer = document.createElement("div");
  tempContainer.style.cssText = `
    position: fixed;
    left: -9999px;
    top: 0;
    width: ${A4_WIDTH_PX}px;
    background: white;
    z-index: -1;
  `;

  // Reset any transforms on the cloned element
  clonedElement.style.transform = "none";
  clonedElement.style.width = `${A4_WIDTH_PX}px`;
  clonedElement.style.minHeight = `${A4_HEIGHT_PX}px`;

  tempContainer.appendChild(clonedElement);
  document.body.appendChild(tempContainer);

  try {
    // Wait for fonts and images to load
    await new Promise(resolve => setTimeout(resolve, 100));

    // Get dimensions from the cloned element
    const elementHeight = Math.max(clonedElement.scrollHeight, A4_HEIGHT_PX);
    const pageCount = Math.max(1, Math.ceil(elementHeight / A4_HEIGHT_PX));

    // Create PDF document (A4 size)
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Render the cloned element to canvas with high quality
    const canvas = await html2canvas(clonedElement, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
      width: A4_WIDTH_PX,
      height: elementHeight,
      windowWidth: A4_WIDTH_PX,
    });

    // Validate canvas dimensions
    if (canvas.width === 0 || canvas.height === 0) {
      throw new Error("Failed to render CV to canvas. Canvas has no dimensions.");
    }

    // Calculate the image dimensions to fit A4
    const imgWidth = A4_WIDTH_MM;
    const imgHeight = (canvas.height * A4_WIDTH_MM) / canvas.width;

    // Validate calculated dimensions
    if (!isFinite(imgHeight) || imgHeight <= 0) {
      throw new Error("Invalid image dimensions calculated.");
    }

    // If content fits on one page
    if (pageCount === 1) {
      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const finalHeight = Math.min(imgHeight, A4_HEIGHT_MM);
      pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, finalHeight);
    } else {
      // Multi-page handling
      const pageHeightPx = (A4_HEIGHT_MM / A4_WIDTH_MM) * canvas.width;

      for (let page = 0; page < pageCount; page++) {
        if (page > 0) {
          pdf.addPage();
        }

        // Calculate height for this page
        const remainingHeight = canvas.height - page * pageHeightPx;
        const thisPageHeight = Math.min(pageHeightPx, remainingHeight);

        if (thisPageHeight <= 0) break;

        // Create a canvas for this page
        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = canvas.width;
        pageCanvas.height = Math.ceil(thisPageHeight);

        const ctx = pageCanvas.getContext("2d");
        if (ctx) {
          // Draw the portion of the original canvas for this page
          ctx.drawImage(
            canvas,
            0,
            Math.floor(page * pageHeightPx),
            canvas.width,
            Math.ceil(thisPageHeight),
            0,
            0,
            canvas.width,
            Math.ceil(thisPageHeight)
          );

          const pageImgData = pageCanvas.toDataURL("image/jpeg", 0.95);
          const pageImgHeight = (thisPageHeight * A4_WIDTH_MM) / canvas.width;

          if (isFinite(pageImgHeight) && pageImgHeight > 0) {
            pdf.addImage(pageImgData, "JPEG", 0, 0, imgWidth, Math.min(pageImgHeight, A4_HEIGHT_MM));
          }
        }
      }
    }

    // Download the PDF
    pdf.save(fileName);
  } finally {
    // Clean up the temporary container
    document.body.removeChild(tempContainer);
  }
}

/**
 * Fallback: Export using browser print dialog
 * Use this if html2canvas/jsPDF fails
 */
export async function exportCVToPDFPrint(
  previewElement: HTMLElement,
  fileName: string = "resume.pdf"
): Promise<void> {
  // Find the actual CV preview element
  const cvPreview = previewElement.querySelector('[data-cv-preview="true"]') || previewElement;

  // Create a new window for printing
  const printWindow = window.open("", "_blank");

  if (!printWindow) {
    throw new Error("Failed to open print window. Please allow popups.");
  }

  // Clone the CV element
  const clonedElement = cvPreview.cloneNode(true) as HTMLElement;

  // Get computed styles from the original element
  const styles = Array.from(document.styleSheets)
    .map((styleSheet) => {
      try {
        return Array.from(styleSheet.cssRules)
          .map((rule) => rule.cssText)
          .join("\n");
      } catch (e) {
        console.warn("Could not access stylesheet:", e);
        return "";
      }
    })
    .join("\n");

  // Create print-friendly HTML with all styles
  const printHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${fileName}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          @page {
            size: A4;
            margin: 0;
          }

          body {
            margin: 0;
            padding: 0;
            background: white;
          }

          @media print {
            body {
              margin: 0;
              padding: 0;
            }

            .no-print {
              display: none !important;
            }
          }

          /* Include all page styles */
          ${styles}
        </style>
      </head>
      <body>
        ${clonedElement.outerHTML}
      </body>
    </html>
  `;

  // Write HTML to print window
  printWindow.document.write(printHTML);
  printWindow.document.close();

  // Wait for content to load
  await new Promise((resolve) => {
    printWindow.onload = () => {
      setTimeout(resolve, 500);
    };
    setTimeout(resolve, 1000);
  });

  // Trigger print dialog
  printWindow.print();

  // Close the window after printing
  setTimeout(() => {
    printWindow.close();
  }, 100);
}

/**
 * Alternative method: Download as HTML (can be saved as PDF using browser's save as PDF)
 */
export function downloadAsHTML(
  previewElement: HTMLElement,
  fileName: string = "resume.html"
): void {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Resume</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            margin: 0;
            padding: 20px;
            background: #f5f5f5;
            font-family: Arial, sans-serif;
          }
          
          .resume-container {
            max-width: 210mm;
            margin: 0 auto;
            background: white;
            padding: 20mm;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          
          @media print {
            body {
              background: white;
              padding: 0;
            }
            
            .resume-container {
              box-shadow: none;
              padding: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="resume-container">
          ${previewElement.innerHTML}
        </div>
      </body>
    </html>
  `;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Helper to get the preview element from the component
 */
export function getPreviewElement(): HTMLElement | null {
  // This would be called from the component with a ref
  return document.querySelector('[data-cv-preview="true"]');
}
