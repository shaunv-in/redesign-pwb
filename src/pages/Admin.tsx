/* ==========================================================================
   ADMIN — Rental Application Review
   Supabase-authenticated view of submitted 300 Centre Street applications.
   ========================================================================== */

import { useEffect, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { RENTAL_DOCS_BUCKET, supabase } from "@/lib/supabaseClient";
import { buildApplicationPdf, downloadPdfBytes, type PdfAttachment, type PdfSection } from "@/lib/applicationPdf";

const STATUS_OPTIONS = ["New", "Pending", "Approved", "Rejected", "Cancelled"];
const STATUS_COLORS: Record<string, string> = {
  New: "#8B6F47",
  Pending: "#A89880",
  Approved: "#3F7D58",
  Rejected: "#B4432F",
  Cancelled: "#6B6055",
};
const RETENTION_DAYS = 30;

type RentalApplicationRow = {
  id: string;
  application_number: string | null;
  status: string;
  created_at: string;
  property_address: string;
  unit: string;
  monthly_rent: number | null;
  desired_move_in_date: string | null;
  full_name: string;
  date_of_birth: string | null;
  phone: string | null;
  email: string | null;
  current_address: string | null;
  current_city: string | null;
  current_province: string | null;
  current_postal_code: string | null;
  length_at_current_address: string | null;
  reason_for_leaving: string | null;
  landlord_name: string | null;
  landlord_phone: string | null;
  employer_name: string | null;
  job_title: string | null;
  employer_phone: string | null;
  employment_length: string | null;
  monthly_income: number | null;
  additional_income_source: string | null;
  additional_income_amount: number | null;
  occupants: string | null;
  has_pets: boolean;
  pet_details: string | null;
  vehicle_info: string | null;
  emergency_contact_name: string | null;
  emergency_contact_relationship: string | null;
  emergency_contact_phone: string | null;
  emergency_contact_email: string | null;
  photo_id_path: string | null;
  income_doc_paths: string[] | null;
  additional_doc_paths: string[] | null;
  consent_soft_credit_check: boolean;
  consent_photo_id_required: boolean;
  consent_income_docs_required: boolean;
  signature_full_name: string | null;
  signed_at: string | null;
  admin_notes: string | null;
  admin_attachment_paths: string[] | null;
  deleted_at: string | null;
};

type Occupant = { name: string; age: string; email: string; phone: string };
type Vehicle = { make: string; model: string; year: string; plate: string };

function parseJson<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function daysSince(dateStr: string): number {
  return (Date.now() - new Date(dateStr).getTime()) / 86_400_000;
}

function filenameFromPath(path: string): string {
  return path.split("/").pop() ?? path;
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="admin-detail-row">
      <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.7rem", color: "#A89880", textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {label}
      </span>
      <span style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "0.88rem", color: "#1C1A17" }}>{value}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const color = STATUS_COLORS[status] ?? "#6B6055";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.4rem",
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: "0.68rem",
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color,
        border: `1px solid ${color}`,
        borderRadius: "999px",
        padding: "0.2rem 0.65rem",
      }}
    >
      <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: color }} />
      {status}
    </span>
  );
}

function buildSections(app: RentalApplicationRow): PdfSection[] {
  const occupants = parseJson<Occupant[]>(app.occupants);
  const vehicles = parseJson<Vehicle[]>(app.vehicle_info);

  return [
    {
      title: "Application",
      rows: [
        { label: "Application #", value: app.application_number ?? "—" },
        { label: "Status", value: app.status },
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
    ...(app.admin_notes
      ? [{ title: "Admin Notes", rows: [{ label: "Notes", value: app.admin_notes }] }]
      : []),
  ];
}

function ApplicationDetail({
  app,
  isDeletedView,
  onUpdate,
  onSoftDelete,
  onRestore,
  onPermanentDelete,
}: {
  app: RentalApplicationRow;
  isDeletedView: boolean;
  onUpdate: (id: string, patch: Partial<RentalApplicationRow>) => void;
  onSoftDelete: (app: RentalApplicationRow) => void;
  onRestore: (app: RentalApplicationRow) => void;
  onPermanentDelete: (app: RentalApplicationRow) => void;
}) {
  const [photoIdUrl, setPhotoIdUrl] = useState<string | null>(null);
  const [incomeDocUrls, setIncomeDocUrls] = useState<string[]>([]);
  const [additionalDocUrls, setAdditionalDocUrls] = useState<{ path: string; url: string }[]>([]);
  const [adminAttachmentUrls, setAdminAttachmentUrls] = useState<{ path: string; url: string }[]>([]);
  const [statusSaving, setStatusSaving] = useState(false);
  const [notesDraft, setNotesDraft] = useState(app.admin_notes ?? "");
  const [notesSaving, setNotesSaving] = useState(false);
  const [uploadingAttachment, setUploadingAttachment] = useState(false);
  const [attachmentError, setAttachmentError] = useState<string | null>(null);
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const attachmentInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;
    async function loadLinks() {
      if (app.photo_id_path) {
        const { data } = await supabase.storage.from(RENTAL_DOCS_BUCKET).createSignedUrl(app.photo_id_path, 3600);
        if (!cancelled && data) setPhotoIdUrl(data.signedUrl);
      }
      if (app.income_doc_paths?.length) {
        const urls = await Promise.all(
          app.income_doc_paths.map(async (path) => {
            const { data } = await supabase.storage.from(RENTAL_DOCS_BUCKET).createSignedUrl(path, 3600);
            return data?.signedUrl ?? null;
          })
        );
        if (!cancelled) setIncomeDocUrls(urls.filter((u): u is string => !!u));
      }
      if (app.additional_doc_paths?.length) {
        const results = await Promise.all(
          app.additional_doc_paths.map(async (path) => {
            const { data } = await supabase.storage.from(RENTAL_DOCS_BUCKET).createSignedUrl(path, 3600);
            return data?.signedUrl ? { path, url: data.signedUrl } : null;
          })
        );
        if (!cancelled) setAdditionalDocUrls(results.filter((r): r is { path: string; url: string } => !!r));
      }
      if (app.admin_attachment_paths?.length) {
        const results = await Promise.all(
          app.admin_attachment_paths.map(async (path) => {
            const { data } = await supabase.storage.from(RENTAL_DOCS_BUCKET).createSignedUrl(path, 3600);
            return data?.signedUrl ? { path, url: data.signedUrl } : null;
          })
        );
        if (!cancelled) setAdminAttachmentUrls(results.filter((r): r is { path: string; url: string } => !!r));
      }
    }
    loadLinks();
    return () => {
      cancelled = true;
    };
  }, [app.photo_id_path, app.income_doc_paths, app.additional_doc_paths, app.admin_attachment_paths]);

  const handleStatusChange = async (status: string) => {
    setStatusSaving(true);
    const { error } = await supabase.from("rental_applications").update({ status }).eq("id", app.id);
    setStatusSaving(false);
    if (!error) onUpdate(app.id, { status });
  };

  const handleNotesSave = async () => {
    setNotesSaving(true);
    const { error } = await supabase.from("rental_applications").update({ admin_notes: notesDraft }).eq("id", app.id);
    setNotesSaving(false);
    if (!error) onUpdate(app.id, { admin_notes: notesDraft });
  };

  const handleAttachmentUpload = async (file: File) => {
    setAttachmentError(null);
    setUploadingAttachment(true);
    const path = `${app.id}/admin-attachment-${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage.from(RENTAL_DOCS_BUCKET).upload(path, file);
    if (uploadError) {
      setAttachmentError(uploadError.message);
      setUploadingAttachment(false);
      return;
    }
    const nextPaths = [...(app.admin_attachment_paths ?? []), path];
    const { error: updateError } = await supabase
      .from("rental_applications")
      .update({ admin_attachment_paths: nextPaths })
      .eq("id", app.id);
    setUploadingAttachment(false);
    if (updateError) {
      setAttachmentError(updateError.message);
      return;
    }
    onUpdate(app.id, { admin_attachment_paths: nextPaths });
  };

  const handleDownloadPdf = async () => {
    setPdfGenerating(true);
    try {
      const attachments: PdfAttachment[] = [];
      if (app.photo_id_path) {
        const { data } = await supabase.storage.from(RENTAL_DOCS_BUCKET).createSignedUrl(app.photo_id_path, 3600);
        if (data) attachments.push({ label: "Photo ID", url: data.signedUrl, path: app.photo_id_path });
      }
      const incomeDocPaths = app.income_doc_paths ?? [];
      for (let i = 0; i < incomeDocPaths.length; i++) {
        const path = incomeDocPaths[i];
        const { data } = await supabase.storage.from(RENTAL_DOCS_BUCKET).createSignedUrl(path, 3600);
        if (data) attachments.push({ label: `Income Document ${i + 1}`, url: data.signedUrl, path });
      }
      const additionalDocPaths = app.additional_doc_paths ?? [];
      for (let i = 0; i < additionalDocPaths.length; i++) {
        const path = additionalDocPaths[i];
        const { data } = await supabase.storage.from(RENTAL_DOCS_BUCKET).createSignedUrl(path, 3600);
        if (data) attachments.push({ label: `Additional Document ${i + 1}`, url: data.signedUrl, path });
      }
      for (const path of app.admin_attachment_paths ?? []) {
        const { data } = await supabase.storage.from(RENTAL_DOCS_BUCKET).createSignedUrl(path, 3600);
        if (data) attachments.push({ label: `Attachment: ${filenameFromPath(path)}`, url: data.signedUrl, path });
      }

      const title = `Rental Application ${app.application_number ?? ""} — ${app.full_name}`.trim();
      const bytes = await buildApplicationPdf(title, buildSections(app), attachments);
      downloadPdfBytes(bytes, `rental-application-${app.application_number ?? app.id}.pdf`);
    } finally {
      setPdfGenerating(false);
    }
  };

  const purgeDate = app.deleted_at
    ? new Date(new Date(app.deleted_at).getTime() + RETENTION_DAYS * 86_400_000)
    : null;

  return (
    <div style={{ padding: "2rem", background: "#FBF9F5", border: "1px solid #DDD5C8" }}>
      <Row label="Application #" value={app.application_number} />
      <Row label="Submitted" value={new Date(app.created_at).toLocaleString()} />
      <Row label="Monthly Rent" value={app.monthly_rent ? `$${app.monthly_rent}` : null} />
      <Row label="Move-in Date" value={app.desired_move_in_date} />

      <div style={{ height: "1px", background: "#DDD5C8", margin: "1rem 0" }} />
      <Row label="Full Name" value={app.full_name} />
      <Row label="Date of Birth" value={app.date_of_birth} />
      <Row label="Phone" value={app.phone} />
      <Row label="Email" value={app.email} />

      <div style={{ height: "1px", background: "#DDD5C8", margin: "1rem 0" }} />
      <Row label="Current Address" value={app.current_address} />
      <Row label="City" value={app.current_city} />
      <Row label="Province" value={app.current_province} />
      <Row label="Postal Code" value={app.current_postal_code} />
      <Row label="Length at Address" value={app.length_at_current_address} />
      <Row label="Reason for Leaving" value={app.reason_for_leaving} />
      <Row label="Landlord Name" value={app.landlord_name} />
      <Row label="Landlord Phone" value={app.landlord_phone} />

      <div style={{ height: "1px", background: "#DDD5C8", margin: "1rem 0" }} />
      <Row label="Employer" value={app.employer_name} />
      <Row label="Job Title" value={app.job_title} />
      <Row label="Employer Phone" value={app.employer_phone} />
      <Row label="Employment Length" value={app.employment_length} />
      <Row label="Monthly Income" value={app.monthly_income ? `$${app.monthly_income}` : null} />
      <Row label="Additional Income" value={app.additional_income_source} />
      <Row label="Additional Income Amount" value={app.additional_income_amount ? `$${app.additional_income_amount}` : null} />

      <div style={{ height: "1px", background: "#DDD5C8", margin: "1rem 0" }} />
      <Row
        label="Other Occupants"
        value={(() => {
          const occupants = parseJson<Occupant[]>(app.occupants);
          if (!occupants?.length) return null;
          return occupants
            .map((o) => [o.name, o.age && `age ${o.age}`, o.phone, o.email].filter(Boolean).join(" · "))
            .join("; ");
        })()}
      />
      <Row label="Has Pets" value={app.has_pets ? "Yes" : "No"} />
      <Row label="Pet Details" value={app.pet_details} />
      <Row
        label="Vehicles"
        value={(() => {
          const vehicles = parseJson<Vehicle[]>(app.vehicle_info);
          if (!vehicles?.length) return null;
          return vehicles
            .map((v) => [v.year, v.make, v.model, v.plate && `— plate ${v.plate}`].filter(Boolean).join(" "))
            .join("; ");
        })()}
      />

      <div style={{ height: "1px", background: "#DDD5C8", margin: "1rem 0" }} />
      <Row label="Emergency Contact" value={app.emergency_contact_name} />
      <Row label="Relationship" value={app.emergency_contact_relationship} />
      <Row label="Emergency Phone" value={app.emergency_contact_phone} />
      <Row label="Emergency Email" value={app.emergency_contact_email} />

      <div style={{ height: "1px", background: "#DDD5C8", margin: "1rem 0" }} />
      <Row
        label="Photo ID"
        value={photoIdUrl ? <a href={photoIdUrl} target="_blank" rel="noopener noreferrer">View document →</a> : "Loading..."}
      />
      <Row
        label="Income Docs"
        value={
          incomeDocUrls.length
            ? incomeDocUrls.map((url, i) => (
                <a key={url} href={url} target="_blank" rel="noopener noreferrer" style={{ marginRight: "1rem" }}>
                  Document {i + 1} →
                </a>
              ))
            : "Loading..."
        }
      />
      {app.additional_doc_paths?.length ? (
        <Row
          label="Additional Docs"
          value={
            additionalDocUrls.length
              ? additionalDocUrls.map(({ path, url }, i) => (
                  <a key={path} href={url} target="_blank" rel="noopener noreferrer" style={{ marginRight: "1rem" }}>
                    Document {i + 1} →
                  </a>
                ))
              : "Loading..."
          }
        />
      ) : null}

      <div style={{ height: "1px", background: "#DDD5C8", margin: "1rem 0" }} />
      <Row label="Consents" value={`Soft credit check: ${app.consent_soft_credit_check ? "Yes" : "No"} · Photo ID: ${app.consent_photo_id_required ? "Yes" : "No"} · Income docs: ${app.consent_income_docs_required ? "Yes" : "No"}`} />
      <Row label="Signature" value={app.signature_full_name} />
      <Row label="Signed At" value={app.signed_at ? new Date(app.signed_at).toLocaleString() : null} />

      {/* Admin-only tools */}
      <div style={{ height: "1px", background: "#DDD5C8", margin: "1.5rem 0" }} />
      <div style={{ marginBottom: "1.5rem" }}>
        <span className="label-text" style={{ display: "block", marginBottom: "0.75rem" }}>Stage</span>
        <select
          className="form-input"
          style={{ appearance: "none", cursor: "pointer", background: "transparent", maxWidth: "220px" }}
          value={app.status}
          disabled={statusSaving || isDeletedView}
          onChange={(e) => handleStatusChange(e.target.value)}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <span className="label-text" style={{ display: "block", marginBottom: "0.75rem" }}>Admin Notes (private)</span>
        <textarea
          className="form-input"
          rows={3}
          style={{ resize: "vertical" }}
          value={notesDraft}
          onChange={(e) => setNotesDraft(e.target.value)}
        />
        <button
          type="button"
          className="btn-ghost"
          style={{ marginTop: "0.75rem", opacity: notesSaving ? 0.6 : 1 }}
          disabled={notesSaving || notesDraft === (app.admin_notes ?? "")}
          onClick={handleNotesSave}
        >
          {notesSaving ? "Saving..." : "Save Notes"}
        </button>
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <span className="label-text" style={{ display: "block", marginBottom: "0.75rem" }}>Additional Attachments</span>
        {adminAttachmentUrls.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginBottom: "0.75rem" }}>
            {adminAttachmentUrls.map(({ path, url }) => (
              <a key={path} href={url} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.85rem" }}>
                {filenameFromPath(path)} →
              </a>
            ))}
          </div>
        )}
        <input
          ref={attachmentInputRef}
          type="file"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleAttachmentUpload(file);
          }}
        />
        <button
          type="button"
          className="btn-ghost"
          style={{ opacity: uploadingAttachment ? 0.6 : 1 }}
          disabled={uploadingAttachment}
          onClick={() => attachmentInputRef.current?.click()}
        >
          {uploadingAttachment ? "Uploading..." : "+ Attach File"}
        </button>
        {attachmentError && <p style={{ color: "#B4432F", fontSize: "0.8rem", marginTop: "0.5rem" }}>{attachmentError}</p>}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center" }}>
        <button type="button" className="btn-primary" style={{ border: "none", opacity: pdfGenerating ? 0.6 : 1 }} disabled={pdfGenerating} onClick={handleDownloadPdf}>
          {pdfGenerating ? "Generating PDF..." : "Download as PDF"}
        </button>

        {!isDeletedView ? (
          <button
            type="button"
            className="btn-ghost"
            style={{ borderColor: "#B4432F", color: "#B4432F" }}
            onClick={() => {
              if (window.confirm("Delete this application? It will be moved to Deleted and permanently removed after 30 days.")) {
                onSoftDelete(app);
              }
            }}
          >
            Delete Application
          </button>
        ) : (
          <>
            <button type="button" className="btn-ghost" onClick={() => onRestore(app)}>
              Restore
            </button>
            <button
              type="button"
              className="btn-ghost"
              style={{ borderColor: "#B4432F", color: "#B4432F" }}
              onClick={() => {
                if (window.confirm("Permanently delete this application and its documents now? This cannot be undone.")) {
                  onPermanentDelete(app);
                }
              }}
            >
              Delete Permanently
            </button>
            {purgeDate && (
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.72rem", color: "#A89880" }}>
                Auto-purges on {purgeDate.toLocaleDateString()}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function LoginForm({ onSignedIn }: { onSignedIn: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    onSignedIn();
  };

  return (
    <div style={{ background: "#F5F0E8", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}>
      <div style={{ width: "100%", maxWidth: "380px" }}>
        <span className="label-text">Admin</span>
        <h1 style={{ fontFamily: "'Libre Baskerville', serif", fontWeight: 700, fontSize: "1.75rem", color: "#1C1A17", margin: "0.75rem 0 2rem" }}>
          Sign in
        </h1>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div>
            <label className="form-label">Email</label>
            <input type="email" required className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="form-label">Password</label>
            <input type="password" required className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <p style={{ color: "#B4432F", fontSize: "0.8rem" }}>{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary" style={{ border: "none", opacity: loading ? 0.6 : 1 }}>
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ background: "#FBF9F5", border: "1px solid #DDD5C8", borderRadius: "6px", padding: "1.25rem 1.5rem" }}>
      <span className="label-text">{label}</span>
      <p style={{ fontFamily: "'Libre Baskerville', serif", fontWeight: 700, fontSize: "2rem", color: "#1C1A17", margin: "0.35rem 0 0" }}>
        {value}
      </p>
    </div>
  );
}

export default function Admin() {
  const [session, setSession] = useState<Session | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [applications, setApplications] = useState<RentalApplicationRow[]>([]);
  const [loadingApps, setLoadingApps] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [tab, setTab] = useState<"active" | "deleted">("active");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setCheckingSession(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;
    setLoadingApps(true);
    supabase
      .from("rental_applications")
      .select("*")
      .order("created_at", { ascending: false })
      .then(async ({ data, error }) => {
        setLoadingApps(false);
        if (error) {
          setLoadError(error.message);
          return;
        }
        const rows = (data as RentalApplicationRow[]) ?? [];

        // Lazily purge anything past the 30-day soft-delete retention window.
        const toPurge = rows.filter((r) => r.deleted_at && daysSince(r.deleted_at) > RETENTION_DAYS);
        for (const row of toPurge) {
          const paths = [row.photo_id_path, ...(row.income_doc_paths ?? []), ...(row.additional_doc_paths ?? []), ...(row.admin_attachment_paths ?? [])].filter(
            (p): p is string => !!p
          );
          if (paths.length) await supabase.storage.from(RENTAL_DOCS_BUCKET).remove(paths);
          await supabase.from("rental_applications").delete().eq("id", row.id);
        }

        const purgedIds = new Set(toPurge.map((r) => r.id));
        setApplications(rows.filter((r) => !purgedIds.has(r.id)));
      });
  }, [session]);

  const updateApplication = (id: string, patch: Partial<RentalApplicationRow>) => {
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  };

  const handleSoftDelete = async (app: RentalApplicationRow) => {
    const deleted_at = new Date().toISOString();
    const { error } = await supabase.from("rental_applications").update({ deleted_at }).eq("id", app.id);
    if (!error) {
      updateApplication(app.id, { deleted_at });
      setExpandedId(null);
    }
  };

  const handleRestore = async (app: RentalApplicationRow) => {
    const { error } = await supabase.from("rental_applications").update({ deleted_at: null }).eq("id", app.id);
    if (!error) {
      updateApplication(app.id, { deleted_at: null });
      setExpandedId(null);
    }
  };

  const handlePermanentDelete = async (app: RentalApplicationRow) => {
    const paths = [app.photo_id_path, ...(app.income_doc_paths ?? []), ...(app.additional_doc_paths ?? []), ...(app.admin_attachment_paths ?? [])].filter(
      (p): p is string => !!p
    );
    if (paths.length) await supabase.storage.from(RENTAL_DOCS_BUCKET).remove(paths);
    const { error } = await supabase.from("rental_applications").delete().eq("id", app.id);
    if (!error) {
      setApplications((prev) => prev.filter((a) => a.id !== app.id));
      setExpandedId(null);
    }
  };

  if (checkingSession) return null;

  if (!session) {
    return <LoginForm onSignedIn={() => {}} />;
  }

  const activeApps = applications.filter((a) => !a.deleted_at);
  const deletedApps = applications.filter((a) => a.deleted_at);
  const newCount = activeApps.filter((a) => a.status === "New").length;
  const visibleApps = tab === "active" ? activeApps : deletedApps;

  return (
    <div style={{ background: "#F5F0E8", minHeight: "100vh", padding: "4rem 0 6rem" }}>
      <div className="container">
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "1rem", marginBottom: "2rem" }}>
          <div>
            <span className="label-text">Admin</span>
            <h1 style={{ fontFamily: "'Libre Baskerville', serif", fontWeight: 700, fontSize: "clamp(1.4rem, 4vw, 2rem)", color: "#1C1A17", margin: "0.5rem 0 0" }}>
              Rental Applications — 300 Centre St, Unit 605
            </h1>
          </div>
          <button className="btn-ghost" onClick={() => supabase.auth.signOut()}>
            Sign Out
          </button>
        </div>

        <div className="rental-grid-2" style={{ marginBottom: "2rem" }}>
          <StatCard label="New Applications" value={newCount} />
          <StatCard label="Total Applications" value={activeApps.length} />
        </div>

        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
          <button
            className={tab === "active" ? "btn-primary" : "btn-ghost"}
            style={tab === "active" ? { border: "none" } : undefined}
            onClick={() => setTab("active")}
          >
            Active ({activeApps.length})
          </button>
          <button
            className={tab === "deleted" ? "btn-primary" : "btn-ghost"}
            style={tab === "deleted" ? { border: "none" } : undefined}
            onClick={() => setTab("deleted")}
          >
            Deleted ({deletedApps.length})
          </button>
        </div>

        {loadingApps && <p style={{ fontFamily: "'Instrument Sans', sans-serif", color: "#6B6055" }}>Loading applications...</p>}
        {loadError && <p style={{ color: "#B4432F" }}>{loadError}</p>}
        {!loadingApps && visibleApps.length === 0 && (
          <p style={{ fontFamily: "'Instrument Sans', sans-serif", color: "#6B6055" }}>
            {tab === "active" ? "No applications submitted yet." : "Nothing in the deleted bin."}
          </p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {visibleApps.map((app) => (
            <div key={app.id} style={{ border: "1px solid #DDD5C8" }}>
              <button
                onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}
                style={{
                  width: "100%",
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "0.75rem",
                  padding: "1.25rem 1.5rem",
                  background: "transparent",
                  border: "none",
                  textAlign: "left",
                  fontFamily: "'Instrument Sans', sans-serif",
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                  <StatusBadge status={app.status} />
                  <span style={{ fontWeight: 500, color: "#1C1A17" }}>
                    {app.full_name}
                    {app.application_number && (
                      <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 400, color: "#A89880", marginLeft: "0.6rem", fontSize: "0.8rem" }}>
                        {app.application_number}
                      </span>
                    )}
                  </span>
                </span>
                <span style={{ fontSize: "0.8rem", color: "#6B6055" }}>
                  {new Date(app.created_at).toLocaleString()} {expandedId === app.id ? "▲" : "▼"}
                </span>
              </button>
              {expandedId === app.id && (
                <ApplicationDetail
                  app={app}
                  isDeletedView={tab === "deleted"}
                  onUpdate={updateApplication}
                  onSoftDelete={handleSoftDelete}
                  onRestore={handleRestore}
                  onPermanentDelete={handlePermanentDelete}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
