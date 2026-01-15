/**
 * Exports a CV to PDF by rendering HTML and converting it to PDF
 * Uses the browser's print functionality for client-side PDF generation
 */

export async function exportCVToPDF(
  previewElement: HTMLElement,
  fileName: string = "resume.pdf"
): Promise<void> {
  // Create a new window for printing
  const printWindow = window.open("", "_blank");
  
  if (!printWindow) {
    throw new Error("Failed to open print window. Please allow popups.");
  }

  // Clone the preview element
  const clonedElement = previewElement.cloneNode(true) as HTMLElement;

  // Create print-friendly HTML
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
        </style>
      </head>
      <body>
        ${clonedElement.innerHTML}
      </body>
    </html>
  `;

  // Write HTML to print window
  printWindow.document.write(printHTML);
  printWindow.document.close();

  // Wait for content to load
  await new Promise((resolve) => {
    printWindow.onload = resolve;
    setTimeout(resolve, 500); // Fallback timeout
  });

  // Trigger print dialog
  printWindow.print();

  // Close the window after printing (user may cancel, so delay it)
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