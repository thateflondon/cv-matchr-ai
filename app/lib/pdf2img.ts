export interface PdfConversionResult {
  imageUrl: string;
  file: File | null;
  error?: string;
}

export interface PdfTextExtractionResult {
  text: string;
  error?: string;
}

let pdfjsLib: any = null;
let isLoading = false;
let loadPromise: Promise<any> | null = null;

async function loadPdfJs(): Promise<any> {
  if (pdfjsLib) return pdfjsLib;
  if (loadPromise) return loadPromise;

  isLoading = true;
  // @ts-expect-error - pdfjs-dist/build/pdf.mjs is not a module
  loadPromise = import("pdfjs-dist/build/pdf.mjs").then(
    (lib) => {
      // Set the worker source to use local file
      lib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
      pdfjsLib = lib;
      isLoading = false;
      return lib;
    },
  );

  return loadPromise;
}

export async function convertPdfToImage(
  file: File,
): Promise<PdfConversionResult> {
  try {
    const lib = await loadPdfJs();

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await lib.getDocument({ data: arrayBuffer })
      .promise;
    const page = await pdf.getPage(1);

    const viewport = page.getViewport({ scale: 4 });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    if (context) {
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
    }

    await page.render({ canvasContext: context!, viewport })
      .promise;

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            // Create a File from the blob with the same name as the pdf
            const originalName = file.name.replace(
              /\.pdf$/i,
              "",
            );
            const imageFile = new File(
              [blob],
              `${originalName}.png`,
              {
                type: "image/png",
              },
            );

            resolve({
              imageUrl: URL.createObjectURL(blob),
              file: imageFile,
            });
          } else {
            resolve({
              imageUrl: "",
              file: null,
              error: "Failed to create image blob",
            });
          }
        },
        "image/png",
        1.0,
      ); // Set quality to maximum (1.0)
    });
  } catch (err) {
    console.error("PDF conversion failed:", err);
    return {
      imageUrl: "",
      file: null,
      error: `Failed to convert PDF: ${err}`,
    };
  }
}

export async function extractTextFromPdf(
  file: File,
): Promise<PdfTextExtractionResult> {
  try {
    const lib = await loadPdfJs();

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await lib.getDocument({ data: arrayBuffer })
      .promise;
    
    const numPages = pdf.numPages;
    let fullText = "";

    // Extract text from all pages
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const textItems = textContent.items;
      
      // Preserve line breaks by tracking vertical position
      let lastY = -1;
      const pageLines: string[] = [];
      let currentLine = "";
      
      textItems.forEach((item: any) => {
        const y = item.transform[5]; // Y position
        const str = item.str;
        
        // If Y position changed significantly, it's a new line
        if (lastY !== -1 && Math.abs(y - lastY) > 2) {
          if (currentLine.trim()) {
            pageLines.push(currentLine.trim());
          }
          currentLine = str;
        } else {
          // Same line, add a space if needed
          currentLine += (currentLine && str ? " " : "") + str;
        }
        
        lastY = y;
      });
      
      // Add the last line
      if (currentLine.trim()) {
        pageLines.push(currentLine.trim());
      }
      
      // Join lines with proper line breaks
      const pageText = pageLines.join("\n");
      fullText += pageText + "\n\n";
    }

    return {
      text: fullText.trim(),
    };
  } catch (err) {
    console.error("PDF text extraction failed:", err);
    return {
      text: "",
      error: `Failed to extract text from PDF: ${err}`,
    };
  }
}