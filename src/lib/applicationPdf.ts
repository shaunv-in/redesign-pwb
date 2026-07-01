import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export type PdfFieldRow = { label: string; value: string };
export type PdfSection = { title: string; rows: PdfFieldRow[] };
export type PdfAttachment = { label: string; url: string; path: string };

const PAGE_WIDTH = 595.28; // A4 portrait, points
const PAGE_HEIGHT = 841.89;
const MARGIN = 50;
const LINE_HEIGHT = 15;
const LABEL_WIDTH = 170;

export async function buildApplicationPdf(
  title: string,
  sections: PdfSection[],
  attachments: PdfAttachment[]
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = PAGE_HEIGHT - MARGIN;

  const ensureSpace = (needed: number) => {
    if (y - needed < MARGIN) {
      page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      y = PAGE_HEIGHT - MARGIN;
    }
  };

  const wrapText = (text: string, maxWidth: number, size: number, useFont = font): string[] => {
    const words = text.split(" ");
    const lines: string[] = [];
    let current = "";
    for (const word of words) {
      const test = current ? `${current} ${word}` : word;
      if (useFont.widthOfTextAtSize(test, size) > maxWidth && current) {
        lines.push(current);
        current = word;
      } else {
        current = test;
      }
    }
    if (current) lines.push(current);
    return lines.length ? lines : [""];
  };

  const drawTitle = (text: string) => {
    ensureSpace(30);
    page.drawText(text, { x: MARGIN, y, size: 16, font: boldFont, color: rgb(0.11, 0.1, 0.09) });
    y -= 26;
  };

  const drawSectionTitle = (text: string) => {
    ensureSpace(22);
    page.drawText(text.toUpperCase(), { x: MARGIN, y, size: 10, font: boldFont, color: rgb(0.545, 0.435, 0.28) });
    y -= 16;
  };

  const drawRow = (label: string, value: string) => {
    const valueMaxWidth = PAGE_WIDTH - MARGIN * 2 - LABEL_WIDTH;
    const lines = wrapText(value, valueMaxWidth, 9.5);
    ensureSpace(LINE_HEIGHT * lines.length);
    page.drawText(label.toUpperCase(), { x: MARGIN, y, size: 8, font: boldFont, color: rgb(0.66, 0.6, 0.5) });
    lines.forEach((line, i) => {
      page.drawText(line, { x: MARGIN + LABEL_WIDTH, y: y - i * LINE_HEIGHT, size: 9.5, font, color: rgb(0.11, 0.1, 0.09) });
    });
    y -= LINE_HEIGHT * lines.length + 3;
  };

  drawTitle(title);

  for (const section of sections) {
    if (!section.rows.length) continue;
    y -= 4;
    drawSectionTitle(section.title);
    section.rows.forEach((row) => drawRow(row.label, row.value));
  }

  for (const attachment of attachments) {
    const notePage = () => {
      const p = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      p.drawText(attachment.label, { x: MARGIN, y: PAGE_HEIGHT - MARGIN, size: 12, font: boldFont, color: rgb(0.11, 0.1, 0.09) });
      return p;
    };

    try {
      const res = await fetch(attachment.url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const bytes = new Uint8Array(await res.arrayBuffer());
      const lower = attachment.path.toLowerCase();

      if (lower.endsWith(".pdf")) {
        const srcDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const copiedPages = await pdfDoc.copyPages(srcDoc, srcDoc.getPageIndices());
        copiedPages.forEach((p) => pdfDoc.addPage(p));
      } else if (lower.endsWith(".png") || lower.endsWith(".jpg") || lower.endsWith(".jpeg")) {
        const img = lower.endsWith(".png") ? await pdfDoc.embedPng(bytes) : await pdfDoc.embedJpg(bytes);
        const scale = Math.min(
          (PAGE_WIDTH - MARGIN * 2) / img.width,
          (PAGE_HEIGHT - MARGIN * 2) / img.height,
          1
        );
        const imgPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
        imgPage.drawText(attachment.label, { x: MARGIN, y: PAGE_HEIGHT - MARGIN + 8, size: 10, font: boldFont, color: rgb(0.545, 0.435, 0.28) });
        imgPage.drawImage(img, {
          x: MARGIN,
          y: PAGE_HEIGHT - MARGIN - img.height * scale,
          width: img.width * scale,
          height: img.height * scale,
        });
      } else {
        const p = notePage();
        p.drawText("File type not supported for inline preview — download separately from the admin dashboard.", {
          x: MARGIN,
          y: PAGE_HEIGHT - MARGIN - 24,
          size: 10,
          font,
          color: rgb(0.42, 0.38, 0.33),
        });
      }
    } catch {
      const p = notePage();
      p.drawText("This attachment failed to load and could not be included.", {
        x: MARGIN,
        y: PAGE_HEIGHT - MARGIN - 24,
        size: 10,
        font,
        color: rgb(0.7, 0.26, 0.18),
      });
    }
  }

  return pdfDoc.save();
}

export function downloadPdfBytes(bytes: Uint8Array, filename: string) {
  const blob = new Blob([bytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
