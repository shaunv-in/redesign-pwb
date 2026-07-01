// Supabase Edge Function — fires on INSERT into rental_applications via a
// Database Webhook. Sends an admin notification email and an applicant
// confirmation email (with a PDF copy of the application attached).
//
// Deploy with: supabase functions deploy notify-application
// Requires a secret: supabase secrets set RESEND_API_KEY=your_key_here
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are auto-injected by Supabase.

import { createClient } from "npm:@supabase/supabase-js@2";
import { PDFDocument, StandardFonts, rgb } from "npm:pdf-lib@1.17.1";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RENTAL_DOCS_BUCKET = "rental-application-documents";
const ADMIN_EMAIL = "shaun@shaunvincent.net";
const FROM_ADDRESS = "Rental Applications <no-reply@shaunvincent.net>";

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

type PdfFieldRow = { label: string; value: string };
type PdfSection = { title: string; rows: PdfFieldRow[] };

function parseJson<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

// deno-lint-ignore no-explicit-any
function buildSections(app: any): PdfSection[] {
  const occupants = parseJson<{ name: string; age: string; email: string; phone: string }[]>(app.occupants);
  const vehicles = parseJson<{ make: string; model: string; year: string; plate: string }[]>(app.vehicle_info);

  return [
    {
      title: "Application",
      rows: [
        { label: "Application #", value: app.application_number ?? "—" },
        { label: "Submitted", value: new Date(app.created_at).toLocaleString() },
        { label: "Property", value: `${app.property_address}, Unit ${app.unit}` },
        { label: "Monthly Rent", value: app.monthly_rent ? `$${app.monthly_rent}` : "—" },
        { label: "Move-in Date", value: app.desired_move_in_date ?? "—" },
      ],
    },
    {
      title: "Applicant",
      rows: [
        { label: "Full Name", value: app.full_name },
        { label: "Date of Birth", value: app.date_of_birth ?? "—" },
        { label: "Phone", value: app.phone ?? "—" },
        { label: "Email", value: app.email ?? "—" },
      ],
    },
    {
      title: "Current Residence",
      rows: [
        { label: "Address", value: app.current_address ?? "—" },
        { label: "City", value: app.current_city ?? "—" },
        { label: "Province", value: app.current_province ?? "—" },
        { label: "Postal Code", value: app.current_postal_code ?? "—" },
        { label: "Length at Address", value: app.length_at_current_address ?? "—" },
        { label: "Reason for Leaving", value: app.reason_for_leaving ?? "—" },
        { label: "Landlord Name", value: app.landlord_name ?? "—" },
        { label: "Landlord Phone", value: app.landlord_phone ?? "—" },
      ],
    },
    {
      title: "Employment & Income",
      rows: [
        { label: "Employer", value: app.employer_name ?? "—" },
        { label: "Job Title", value: app.job_title ?? "—" },
        { label: "Employer Phone", value: app.employer_phone ?? "—" },
        { label: "Employment Length", value: app.employment_length ?? "—" },
        { label: "Monthly Income", value: app.monthly_income ? `$${app.monthly_income}` : "—" },
        { label: "Additional Income", value: app.additional_income_source ?? "—" },
        { label: "Additional Income Amount", value: app.additional_income_amount ? `$${app.additional_income_amount}` : "—" },
      ],
    },
    {
      title: "Household",
      rows: [
        {
          label: "Other Occupants",
          value: occupants?.length
            ? occupants.map((o) => [o.name, o.age && `age ${o.age}`, o.phone, o.email].filter(Boolean).join(" · ")).join("; ")
            : "—",
        },
        { label: "Has Pets", value: app.has_pets ? "Yes" : "No" },
        { label: "Pet Details", value: app.pet_details ?? "—" },
        {
          label: "Vehicles",
          value: vehicles?.length
            ? vehicles.map((v) => [v.year, v.make, v.model, v.plate && `plate ${v.plate}`].filter(Boolean).join(" ")).join("; ")
            : "—",
        },
      ],
    },
    {
      title: "Emergency Contact",
      rows: [
        { label: "Name", value: app.emergency_contact_name ?? "—" },
        { label: "Relationship", value: app.emergency_contact_relationship ?? "—" },
        { label: "Phone", value: app.emergency_contact_phone ?? "—" },
        { label: "Email", value: app.emergency_contact_email ?? "—" },
      ],
    },
    {
      title: "Consent & Signature",
      rows: [
        { label: "Soft Credit Check", value: app.consent_soft_credit_check ? "Yes" : "No" },
        { label: "Photo ID Required", value: app.consent_photo_id_required ? "Yes" : "No" },
        { label: "Income Docs Required", value: app.consent_income_docs_required ? "Yes" : "No" },
        { label: "Signature", value: app.signature_full_name ?? "—" },
        { label: "Signed At", value: app.signed_at ? new Date(app.signed_at).toLocaleString() : "—" },
      ],
    },
  ];
}

type PdfAttachment = { label: string; url: string; path: string };

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 50;
const LINE_HEIGHT = 15;
const LABEL_WIDTH = 170;

async function buildApplicationPdf(title: string, sections: PdfSection[], attachments: PdfAttachment[]): Promise<Uint8Array> {
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

  const wrapText = (text: string, maxWidth: number, size: number): string[] => {
    const words = text.split(" ");
    const lines: string[] = [];
    let current = "";
    for (const word of words) {
      const test = current ? `${current} ${word}` : word;
      if (font.widthOfTextAtSize(test, size) > maxWidth && current) {
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
        const scale = Math.min((PAGE_WIDTH - MARGIN * 2) / img.width, (PAGE_HEIGHT - MARGIN * 2) / img.height, 1);
        const imgPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
        imgPage.drawText(attachment.label, { x: MARGIN, y: PAGE_HEIGHT - MARGIN + 8, size: 10, font: boldFont, color: rgb(0.545, 0.435, 0.28) });
        imgPage.drawImage(img, {
          x: MARGIN,
          y: PAGE_HEIGHT - MARGIN - img.height * scale,
          width: img.width * scale,
          height: img.height * scale,
        });
      }
    } catch {
      const p = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      p.drawText(`${attachment.label} failed to load and could not be included.`, {
        x: MARGIN,
        y: PAGE_HEIGHT - MARGIN,
        size: 10,
        font,
        color: rgb(0.7, 0.26, 0.18),
      });
    }
  }

  return pdfDoc.save();
}

function uint8ToBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

async function sendEmail(payload: Record<string, unknown>) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    console.error("Resend error:", res.status, await res.text());
  }
}

Deno.serve(async (req) => {
  try {
    const payload = await req.json();
    const app = payload.record;
    if (!app) return new Response("No record in payload", { status: 400 });

    // Signed URLs for the applicant's uploaded documents (1 hour is plenty
    // for this function's run + immediate delivery).
    const attachments: PdfAttachment[] = [];
    if (app.photo_id_path) {
      const { data } = await supabase.storage.from(RENTAL_DOCS_BUCKET).createSignedUrl(app.photo_id_path, 3600);
      if (data) attachments.push({ label: "Photo ID", url: data.signedUrl, path: app.photo_id_path });
    }
    const incomeDocPaths: string[] = app.income_doc_paths ?? [];
    for (let i = 0; i < incomeDocPaths.length; i++) {
      const { data } = await supabase.storage.from(RENTAL_DOCS_BUCKET).createSignedUrl(incomeDocPaths[i], 3600);
      if (data) attachments.push({ label: `Income Document ${i + 1}`, url: data.signedUrl, path: incomeDocPaths[i] });
    }
    const additionalDocPaths: string[] = app.additional_doc_paths ?? [];
    for (let i = 0; i < additionalDocPaths.length; i++) {
      const { data } = await supabase.storage.from(RENTAL_DOCS_BUCKET).createSignedUrl(additionalDocPaths[i], 3600);
      if (data) attachments.push({ label: `Additional Document ${i + 1}`, url: data.signedUrl, path: additionalDocPaths[i] });
    }

    const title = `Rental Application ${app.application_number ?? ""} — ${app.full_name}`.trim();
    const pdfBytes = await buildApplicationPdf(title, buildSections(app), attachments);
    const pdfBase64 = uint8ToBase64(pdfBytes);
    const pdfFilename = `rental-application-${app.application_number ?? app.id}.pdf`;

    // 1. Notify the admin.
    await sendEmail({
      from: FROM_ADDRESS,
      to: [ADMIN_EMAIL],
      subject: `New rental application received${app.application_number ? ` — ${app.application_number}` : ""}`,
      html:
        `<p>A new rental application was submitted for <strong>300 Centre Street, Unit ${app.unit}</strong>.</p>` +
        `<p><strong>Applicant:</strong> ${app.full_name}<br>` +
        `<strong>Application #:</strong> ${app.application_number ?? "n/a"}<br>` +
        `<strong>Submitted:</strong> ${new Date(app.created_at).toLocaleString()}</p>` +
        `<p><a href="https://shaunvincent.net/admin">View it in the admin dashboard</a></p>`,
      attachments: [{ filename: pdfFilename, content: pdfBase64 }],
    });

    // 2. Confirm receipt with the applicant, attaching their submission as a PDF.
    if (app.email) {
      await sendEmail({
        from: FROM_ADDRESS,
        to: [app.email],
        subject: `We received your application for 300 Centre Street, Unit ${app.unit}`,
        html:
          `<p>Hi ${app.full_name},</p>` +
          `<p>Thanks for applying for 300 Centre Street, Unit ${app.unit}. We've received your application` +
          `${app.application_number ? ` (reference ${app.application_number})` : ""} and attached a copy for your records.</p>` +
          `<p>We'll be in touch after review.</p>`,
        attachments: [{ filename: pdfFilename, content: pdfBase64 }],
      });
    }

    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(String(err), { status: 500 });
  }
});
