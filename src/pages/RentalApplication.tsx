/* ==========================================================================
   RENTAL APPLICATION — 300 Centre Street, Unit 605
   Password-gated application form. Matches the Warm Beige Minimalism
   design system used across the rest of the site.
   ========================================================================== */

import { useRef, useState } from "react";
import { RENTAL_DOCS_BUCKET, supabase } from "@/lib/supabaseClient";

const ACCESS_PASSWORD = "300centre";
const SESSION_KEY = "rental-application-300-centre-unlocked";
const MAX_FILE_SIZE_MB = 30;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

function generateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    try {
      return crypto.randomUUID();
    } catch {
      // falls through to manual generation below (e.g. insecure-context browsers)
    }
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Real-world filenames (e.g. "IMG_0001 (2).jpg", accented names, emoji from
// phone camera apps) can contain characters Supabase Storage object keys
// reject. Strip anything but letters/digits/dot/dash/underscore.
function sanitizeFilename(name: string): string {
  const lastDot = name.lastIndexOf(".");
  const base = lastDot > 0 ? name.slice(0, lastDot) : name;
  const ext = lastDot > 0 ? name.slice(lastDot) : "";
  const safeBase = base.replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 80) || "file";
  const safeExt = ext.replace(/[^a-zA-Z0-9.]/g, "").slice(0, 10);
  return `${safeBase}${safeExt}`;
}

const LENGTH_OPTIONS = ["Less than a year", "1 year", "2 years", "3 years", "4+ years"];

function formatPhoneNumber(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 10);
  const area = digits.slice(0, 3);
  const prefix = digits.slice(3, 6);
  const line = digits.slice(6, 10);
  if (digits.length > 6) return `${area}-${prefix}-${line}`;
  if (digits.length > 3) return `${area}-${prefix}`;
  return area;
}

function withCountryCode(formattedPhone: string): string | null {
  return formattedPhone ? `+1 ${formattedPhone}` : null;
}

function generateApplicationNumber(): string {
  const n = Math.floor(Math.random() * 10000000);
  return `#${n.toString().padStart(7, "0")}`;
}

// Native HTML5 `type="email"` validation doesn't require a valid-looking
// domain extension (e.g. "a@b" passes). This enforces a real TLD.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email.trim());
}

type Occupant = { name: string; age: string; email: string; phone: string };

const emptyOccupant: Occupant = { name: "", age: "", email: "", phone: "" };

type Vehicle = { make: string; model: string; year: string; plate: string };

const emptyVehicle: Vehicle = { make: "", model: "", year: "", plate: "" };

const CANADIAN_PROVINCES = [
  "Alberta",
  "British Columbia",
  "Manitoba",
  "New Brunswick",
  "Newfoundland and Labrador",
  "Northwest Territories",
  "Nova Scotia",
  "Nunavut",
  "Ontario",
  "Prince Edward Island",
  "Quebec",
  "Saskatchewan",
  "Yukon",
];

// Canadian postal code format: A1A 1A1
const POSTAL_CODE_PATTERN = /^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/;

function isValidPostalCode(postalCode: string): boolean {
  return POSTAL_CODE_PATTERN.test(postalCode.trim());
}

type FormState = {
  monthlyRent: string;
  desiredMoveInDate: string;

  fullName: string;
  dateOfBirth: string;
  phone: string;
  email: string;

  currentAddress: string;
  currentCity: string;
  currentProvince: string;
  currentPostalCode: string;
  lengthAtCurrentAddress: string;
  reasonForLeaving: string;
  landlordName: string;
  landlordPhone: string;

  employerName: string;
  jobTitle: string;
  employerPhone: string;
  employmentLength: string;
  monthlyIncome: string;
  additionalIncomeSource: string;
  additionalIncomeAmount: string;

  hasPets: "yes" | "no";
  petDetails: string;

  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactPhone: string;
  emergencyContactEmail: string;

  signatureFullName: string;
};

const initialFormState: FormState = {
  monthlyRent: "",
  desiredMoveInDate: "",
  fullName: "",
  dateOfBirth: "",
  phone: "",
  email: "",
  currentAddress: "",
  currentCity: "",
  currentProvince: "",
  currentPostalCode: "",
  lengthAtCurrentAddress: "",
  reasonForLeaving: "",
  landlordName: "",
  landlordPhone: "",
  employerName: "",
  jobTitle: "",
  employerPhone: "",
  employmentLength: "",
  monthlyIncome: "",
  additionalIncomeSource: "",
  additionalIncomeAmount: "",
  hasPets: "no",
  petDetails: "",
  emergencyContactName: "",
  emergencyContactRelationship: "",
  emergencyContactPhone: "",
  emergencyContactEmail: "",
  signatureFullName: "",
};

function FormSection({
  index,
  title,
  description,
  children,
}: {
  index: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rental-section-card"
      style={{
        background: "#FBF9F5",
        border: "1px solid #DDD5C8",
        borderRadius: "6px",
        margin: "2rem 0",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", marginBottom: description ? "0.5rem" : "1.75rem" }}>
        <span
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "0.72rem",
            fontWeight: 700,
            color: "#F5F0E8",
            background: "#8B6F47",
            borderRadius: "999px",
            width: "1.6rem",
            height: "1.6rem",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {index}
        </span>
        <h2
          style={{
            fontFamily: "'Libre Baskerville', serif",
            fontWeight: 700,
            fontSize: "1.15rem",
            color: "#1C1A17",
            margin: 0,
          }}
        >
          {title}
        </h2>
      </div>
      {description && (
        <p style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "0.82rem", color: "#6B6055", fontWeight: 300, margin: "0 0 1.75rem" }}>
          {description}
        </p>
      )}
      {children}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        className="form-label"
        style={{ fontWeight: 700, fontSize: "0.78rem", color: "#1C1A17", letterSpacing: "0.04em" }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function PhoneField({
  label,
  name,
  value,
  onChange,
  required,
}: {
  label: string;
  name?: string;
  value: string;
  onChange: (formatted: string) => void;
  required?: boolean;
}) {
  return (
    <Field label={label}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: "0.5rem" }}>
        <span
          style={{
            fontFamily: "'Instrument Sans', sans-serif",
            fontSize: "0.9rem",
            fontWeight: 300,
            color: "#6B6055",
            padding: "0.625rem 0",
            borderBottom: "1px solid #DDD5C8",
          }}
        >
          +1
        </span>
        <input
          type="tel"
          name={name}
          required={required}
          inputMode="numeric"
          placeholder="000-000-0000"
          className="form-input"
          value={value}
          onChange={(e) => onChange(formatPhoneNumber(e.target.value))}
        />
      </div>
    </Field>
  );
}

function EmailField({
  label,
  name,
  value,
  onChange,
  required,
}: {
  label: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  const [touched, setTouched] = useState(false);
  const invalid = touched && value.trim() !== "" && !isValidEmail(value);

  return (
    <Field label={label}>
      <input
        type="email"
        name={name}
        required={required}
        className="form-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setTouched(true)}
        style={invalid ? { borderBottomColor: "#B4432F" } : undefined}
      />
      {invalid && (
        <p style={{ color: "#B4432F", fontSize: "0.75rem", marginTop: "0.35rem" }}>
          Enter a valid email address (e.g. name@example.com).
        </p>
      )}
    </Field>
  );
}

function FileUploadField({
  label,
  file,
  onChange,
  accept,
}: {
  label: string;
  file: File | null;
  onChange: (file: File | null) => void;
  accept?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Field label={label}>
      {/* Native `required` on a hidden input silently blocks submit with no visible focus target; validation is enforced in handleSubmit instead. */}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        style={{ display: "none" }}
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
        <button
          type="button"
          className="btn-ghost"
          style={{ padding: "0.6rem 1.1rem", fontSize: "0.78rem" }}
          onClick={() => inputRef.current?.click()}
        >
          {file ? "Change File" : "+ Upload File"}
        </button>
        {file ? (
          <span style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontFamily: "'Instrument Sans', sans-serif", fontSize: "0.82rem", color: "#1C1A17" }}>
            {file.name}
            <button
              type="button"
              onClick={() => {
                onChange(null);
                if (inputRef.current) inputRef.current.value = "";
              }}
              style={{ background: "none", border: "none", color: "#B4432F", cursor: "pointer", fontSize: "0.78rem", padding: 0 }}
            >
              Remove
            </button>
          </span>
        ) : (
          <span style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "0.82rem", color: "#A89880" }}>No file selected</span>
        )}
      </div>
    </Field>
  );
}

function getMinMoveInDate(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().slice(0, 10);
}

export default function RentalApplication() {
  const [minMoveInDate] = useState(getMinMoveInDate);
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(SESSION_KEY) === "1");
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [occupants, setOccupants] = useState<Occupant[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [photoIdFile, setPhotoIdFile] = useState<File | null>(null);
  const [incomeDocFiles, setIncomeDocFiles] = useState<(File | null)[]>([null, null]);
  const [additionalFileSlots, setAdditionalFileSlots] = useState<(File | null)[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [postalCodeTouched, setPostalCodeTouched] = useState(false);

  const [consentCreditCheck, setConsentCreditCheck] = useState(false);
  const [consentPhotoId, setConsentPhotoId] = useState(false);
  const [consentIncomeDocs, setConsentIncomeDocs] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [applicationNumber, setApplicationNumber] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ACCESS_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "1");
      setUnlocked(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleIncomeDocChange = (idx: number, file: File | null) => {
    if (file && file.size > MAX_FILE_SIZE_BYTES) {
      setFileError(`"${file.name}" is larger than ${MAX_FILE_SIZE_MB}MB. Please upload a smaller file.`);
      return;
    }
    setFileError(null);
    setIncomeDocFiles((prev) => {
      const next = [...prev];
      next[idx] = file;
      return next;
    });
  };

  const handlePhotoIdChange = (file: File | null) => {
    if (file && file.size > MAX_FILE_SIZE_BYTES) {
      setFileError(`"${file.name}" is larger than ${MAX_FILE_SIZE_MB}MB. Please upload a smaller file.`);
      return;
    }
    setFileError(null);
    setPhotoIdFile(file);
  };

  const addAdditionalFileSlot = () => setAdditionalFileSlots((prev) => [...prev, null]);
  const removeAdditionalFileSlot = (idx: number) => setAdditionalFileSlots((prev) => prev.filter((_, i) => i !== idx));
  const handleAdditionalFileChange = (idx: number, file: File | null) => {
    if (file && file.size > MAX_FILE_SIZE_BYTES) {
      setFileError(`"${file.name}" is larger than ${MAX_FILE_SIZE_MB}MB. Please upload a smaller file.`);
      return;
    }
    setFileError(null);
    setAdditionalFileSlots((prev) => {
      const next = [...prev];
      next[idx] = file;
      return next;
    });
  };

  const addOccupant = () => setOccupants((prev) => [...prev, { ...emptyOccupant }]);
  const removeOccupant = (idx: number) => setOccupants((prev) => prev.filter((_, i) => i !== idx));
  const updateOccupant = (idx: number, field: keyof Occupant, value: string) => {
    setOccupants((prev) => prev.map((o, i) => (i === idx ? { ...o, [field]: value } : o)));
  };

  const addVehicle = () => setVehicles((prev) => [...prev, { ...emptyVehicle }]);
  const removeVehicle = (idx: number) => setVehicles((prev) => prev.filter((_, i) => i !== idx));
  const updateVehicle = (idx: number, field: keyof Vehicle, value: string) => {
    setVehicles((prev) => prev.map((v, i) => (i === idx ? { ...v, [field]: value } : v)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isValidEmail(formData.email)) {
      setError("Please enter a valid email address (e.g. name@example.com).");
      return;
    }
    if (formData.emergencyContactEmail && !isValidEmail(formData.emergencyContactEmail)) {
      setError("Please enter a valid emergency contact email address (e.g. name@example.com).");
      return;
    }
    const invalidOccupantEmail = occupants.find((o) => o.email && !isValidEmail(o.email));
    if (invalidOccupantEmail) {
      setError(`Please enter a valid email address for occupant "${invalidOccupantEmail.name || "unnamed"}".`);
      return;
    }
    if (!isValidPostalCode(formData.currentPostalCode)) {
      setError("Please enter a valid Canadian postal code (e.g. R3Y 1Z8).");
      return;
    }
    if (formData.desiredMoveInDate < minMoveInDate) {
      setError("Desired move-in date must be a future date.");
      return;
    }

    if (!consentCreditCheck || !consentPhotoId || !consentIncomeDocs) {
      setError("Please acknowledge all disclosures before submitting.");
      return;
    }
    if (!photoIdFile) {
      setError("Please upload a valid photo ID.");
      return;
    }
    const incomeDocs = incomeDocFiles.filter((f): f is File => f !== null);
    if (incomeDocs.length < 2) {
      setError("Please upload two recent bank statements or two recent pay stubs.");
      return;
    }
    const additionalFiles = additionalFileSlots.filter((f): f is File => f !== null);
    if ([photoIdFile, ...incomeDocs, ...additionalFiles].some((f) => f.size > MAX_FILE_SIZE_BYTES)) {
      setError(`Each uploaded file must be ${MAX_FILE_SIZE_MB}MB or smaller.`);
      return;
    }
    if (!formData.signatureFullName.trim()) {
      setError("Please type your full name as your signature.");
      return;
    }

    setSubmitting(true);
    try {
      const applicationId = generateId();
      const applicationNumber = generateApplicationNumber();

      const photoIdPath = `${applicationId}/photo-id-${sanitizeFilename(photoIdFile.name)}`;
      const { error: photoUploadError } = await supabase.storage
        .from(RENTAL_DOCS_BUCKET)
        .upload(photoIdPath, photoIdFile);
      if (photoUploadError) throw photoUploadError;

      const incomeDocPaths: string[] = [];
      for (let i = 0; i < incomeDocs.length; i++) {
        const path = `${applicationId}/income-doc-${i + 1}-${sanitizeFilename(incomeDocs[i].name)}`;
        const { error: incomeUploadError } = await supabase.storage
          .from(RENTAL_DOCS_BUCKET)
          .upload(path, incomeDocs[i]);
        if (incomeUploadError) throw incomeUploadError;
        incomeDocPaths.push(path);
      }

      const additionalDocPaths: string[] = [];
      for (let i = 0; i < additionalFiles.length; i++) {
        const path = `${applicationId}/additional-doc-${i + 1}-${sanitizeFilename(additionalFiles[i].name)}`;
        const { error: additionalUploadError } = await supabase.storage
          .from(RENTAL_DOCS_BUCKET)
          .upload(path, additionalFiles[i]);
        if (additionalUploadError) throw additionalUploadError;
        additionalDocPaths.push(path);
      }

      const { error: insertError } = await supabase.from("rental_applications").insert({
        id: applicationId,
        application_number: applicationNumber,
        property_address: "300 Centre Street",
        unit: "605",
        monthly_rent: formData.monthlyRent ? Number(formData.monthlyRent) : null,
        desired_move_in_date: formData.desiredMoveInDate || null,
        full_name: formData.fullName,
        date_of_birth: formData.dateOfBirth || null,
        phone: withCountryCode(formData.phone),
        email: formData.email,
        current_address: formData.currentAddress,
        current_city: formData.currentCity,
        current_province: formData.currentProvince,
        current_postal_code: formData.currentPostalCode,
        length_at_current_address: formData.lengthAtCurrentAddress,
        reason_for_leaving: formData.reasonForLeaving,
        landlord_name: formData.landlordName,
        landlord_phone: withCountryCode(formData.landlordPhone),
        employer_name: formData.employerName,
        job_title: formData.jobTitle,
        employer_phone: withCountryCode(formData.employerPhone),
        employment_length: formData.employmentLength,
        monthly_income: formData.monthlyIncome ? Number(formData.monthlyIncome) : null,
        additional_income_source: formData.additionalIncomeSource,
        additional_income_amount: formData.additionalIncomeAmount
          ? Number(formData.additionalIncomeAmount)
          : null,
        occupants: occupants.length
          ? JSON.stringify(occupants.map((o) => ({ ...o, phone: withCountryCode(o.phone) ?? "" })))
          : null,
        has_pets: formData.hasPets === "yes",
        pet_details: formData.hasPets === "yes" ? formData.petDetails : null,
        vehicle_info: vehicles.length ? JSON.stringify(vehicles) : null,
        emergency_contact_name: formData.emergencyContactName,
        emergency_contact_relationship: formData.emergencyContactRelationship,
        emergency_contact_phone: withCountryCode(formData.emergencyContactPhone),
        emergency_contact_email: formData.emergencyContactEmail,
        photo_id_path: photoIdPath,
        income_doc_paths: incomeDocPaths,
        additional_doc_paths: additionalDocPaths.length ? additionalDocPaths : null,
        consent_soft_credit_check: consentCreditCheck,
        consent_photo_id_required: consentPhotoId,
        consent_income_docs_required: consentIncomeDocs,
        signature_full_name: formData.signatureFullName,
        signed_at: new Date().toISOString(),
      });
      if (insertError) throw insertError;

      setApplicationNumber(applicationNumber);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      const message =
        err instanceof Error
          ? err.message
          : typeof err === "object" && err !== null && "message" in err
            ? String((err as { message: unknown }).message)
            : null;
      setError(
        message
          ? `Something went wrong submitting your application: ${message}`
          : "Something went wrong submitting your application. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!unlocked) {
    return (
      <div
        style={{
          background: "#F5F0E8",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1.5rem",
        }}
      >
        <div style={{ width: "100%", maxWidth: "380px" }}>
          <span className="label-text">Rental Application</span>
          <h1
            style={{
              fontFamily: "'Libre Baskerville', serif",
              fontWeight: 700,
              fontSize: "1.75rem",
              color: "#1C1A17",
              margin: "0.75rem 0 0.5rem",
            }}
          >
            300 Centre Street
          </h1>
          <p style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "0.9rem", color: "#6B6055", fontWeight: 300, marginBottom: "2rem" }}>
            This application is password protected. Please enter the access code you were given.
          </p>
          <form onSubmit={handlePasswordSubmit}>
            <Field label="Access Code">
              <input
                type="password"
                className="form-input"
                autoFocus
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setPasswordError(false);
                }}
              />
            </Field>
            {passwordError && (
              <p style={{ color: "#B4432F", fontSize: "0.8rem", marginTop: "0.75rem" }}>
                Incorrect access code. Please try again.
              </p>
            )}
            <button type="submit" className="btn-primary" style={{ border: "none", marginTop: "2rem" }}>
              Continue →
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div
        style={{
          background: "#F5F0E8",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1.5rem",
        }}
      >
        <div style={{ width: "100%", maxWidth: "480px", textAlign: "center" }}>
          <h1
            style={{
              fontFamily: "'Libre Baskerville', serif",
              fontWeight: 700,
              fontSize: "2rem",
              color: "#1C1A17",
              marginBottom: "1rem",
            }}
          >
            Application received.
          </h1>
          <p style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "0.95rem", color: "#6B6055", fontWeight: 300 }}>
            Thank you for applying for 300 Centre Street, Unit 605. We've received your documents
            and will be in touch after review.
          </p>
          {applicationNumber && (
            <div
              style={{
                marginTop: "2rem",
                display: "inline-block",
                background: "#FBF9F5",
                border: "1px solid #DDD5C8",
                borderRadius: "6px",
                padding: "1rem 1.75rem",
              }}
            >
              <span className="label-text">Application Number</span>
              <p
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "#1C1A17",
                  margin: "0.35rem 0 0",
                }}
              >
                {applicationNumber}
              </p>
            </div>
          )}
          <p style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "0.8rem", color: "#A89880", fontWeight: 300, marginTop: "1rem" }}>
            Please save this number for your records.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#F5F0E8", minHeight: "100vh", padding: "4rem 0 8rem" }}>
      <div className="container" style={{ maxWidth: "780px" }}>
        <div
          style={{
            borderBottom: "2px solid #1C1A17",
            paddingBottom: "1.75rem",
            marginBottom: "0.5rem",
          }}
        >
          <span className="label-text">Rental Application Form</span>
          <h1
            style={{
              fontFamily: "'Libre Baskerville', serif",
              fontWeight: 700,
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              color: "#1C1A17",
              margin: "0.75rem 0 0.5rem",
            }}
          >
            300 Centre Street, Unit 605
          </h1>
          <p style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "0.9rem", color: "#6B6055", fontWeight: 300, margin: 0 }}>
            Please complete every section below as accurately as possible. Fields marked with an
            asterisk (*) are required. Your application will be reviewed after submission.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <FormSection index="01" title="Property Information">
            <div className="rental-grid-2">
              <Field label="Property Address">
                <input className="form-input" value="300 Centre Street" disabled />
              </Field>
              <Field label="Unit">
                <input className="form-input" value="605" disabled />
              </Field>
              <Field label="Monthly Rent ($) *">
                <input
                  name="monthlyRent"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  placeholder="e.g. 2400"
                  className="form-input"
                  value={formData.monthlyRent}
                  onChange={handleChange}
                />
              </Field>
              <Field label="Desired Move-in Date *">
                <input
                  name="desiredMoveInDate"
                  type="date"
                  required
                  min={minMoveInDate}
                  className="form-input"
                  value={formData.desiredMoveInDate}
                  onChange={handleChange}
                />
              </Field>
            </div>
          </FormSection>

          <FormSection index="02" title="Applicant Information">
            <div className="rental-grid-2">
              <Field label="Full Legal Name *">
                <input name="fullName" required className="form-input" value={formData.fullName} onChange={handleChange} />
              </Field>
              <Field label="Date of Birth *">
                <input name="dateOfBirth" type="date" required className="form-input" value={formData.dateOfBirth} onChange={handleChange} />
              </Field>
              <PhoneField label="Phone *" name="phone" required value={formData.phone} onChange={(v) => setFormData((prev) => ({ ...prev, phone: v }))} />
              <EmailField label="Email *" name="email" required value={formData.email} onChange={(v) => setFormData((prev) => ({ ...prev, email: v }))} />
            </div>
          </FormSection>

          <FormSection index="03" title="Current Residence">
            <div className="rental-grid-2">
              <Field label="Current Address *">
                <input name="currentAddress" required className="form-input" value={formData.currentAddress} onChange={handleChange} />
              </Field>
              <Field label="City *">
                <input name="currentCity" required className="form-input" value={formData.currentCity} onChange={handleChange} />
              </Field>
              <Field label="Province *">
                <select name="currentProvince" required className="form-input" style={{ appearance: "none", cursor: "pointer", background: "transparent" }} value={formData.currentProvince} onChange={handleChange}>
                  <option value="" disabled>Select province</option>
                  {CANADIAN_PROVINCES.map((prov) => (
                    <option key={prov} value={prov}>{prov}</option>
                  ))}
                </select>
              </Field>
              <Field label="Postal Code *">
                <input
                  name="currentPostalCode"
                  required
                  placeholder="A1A 1A1"
                  className="form-input"
                  style={postalCodeTouched && formData.currentPostalCode && !isValidPostalCode(formData.currentPostalCode) ? { borderBottomColor: "#B4432F" } : undefined}
                  value={formData.currentPostalCode}
                  onChange={handleChange}
                  onBlur={() => setPostalCodeTouched(true)}
                />
                {postalCodeTouched && formData.currentPostalCode && !isValidPostalCode(formData.currentPostalCode) && (
                  <p style={{ color: "#B4432F", fontSize: "0.75rem", marginTop: "0.35rem" }}>
                    Enter a valid Canadian postal code (e.g. R3Y 1Z8).
                  </p>
                )}
              </Field>
              <Field label="Length at Current Address *">
                <select name="lengthAtCurrentAddress" required className="form-input" style={{ appearance: "none", cursor: "pointer", background: "transparent" }} value={formData.lengthAtCurrentAddress} onChange={handleChange}>
                  <option value="" disabled>Select length of time</option>
                  {LENGTH_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </Field>
              <Field label="Reason for Leaving">
                <input name="reasonForLeaving" className="form-input" value={formData.reasonForLeaving} onChange={handleChange} />
              </Field>
              <Field label="Current Landlord Name">
                <input name="landlordName" className="form-input" value={formData.landlordName} onChange={handleChange} />
              </Field>
              <PhoneField label="Current Landlord Phone" name="landlordPhone" value={formData.landlordPhone} onChange={(v) => setFormData((prev) => ({ ...prev, landlordPhone: v }))} />
            </div>
          </FormSection>

          <FormSection index="04" title="Employment & Income" description="If you're not currently employed, leave this section blank.">
            <div className="rental-grid-2">
              <Field label="Employer Name">
                <input name="employerName" className="form-input" value={formData.employerName} onChange={handleChange} />
              </Field>
              <Field label="Job Title">
                <input name="jobTitle" className="form-input" value={formData.jobTitle} onChange={handleChange} />
              </Field>
              <PhoneField label="Employer Phone" name="employerPhone" value={formData.employerPhone} onChange={(v) => setFormData((prev) => ({ ...prev, employerPhone: v }))} />
              <Field label="Length of Employment">
                <select name="employmentLength" className="form-input" style={{ appearance: "none", cursor: "pointer", background: "transparent" }} value={formData.employmentLength} onChange={handleChange}>
                  <option value="" disabled>Select length of time</option>
                  {LENGTH_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </Field>
              <Field label="Monthly Gross Income ($)">
                <input name="monthlyIncome" type="number" min="0" step="0.01" className="form-input" value={formData.monthlyIncome} onChange={handleChange} />
              </Field>
              <Field label="Additional Income Source">
                <input name="additionalIncomeSource" className="form-input" value={formData.additionalIncomeSource} onChange={handleChange} />
              </Field>
              <Field label="Additional Income Amount ($)">
                <input name="additionalIncomeAmount" type="number" min="0" step="0.01" className="form-input" value={formData.additionalIncomeAmount} onChange={handleChange} />
              </Field>
            </div>
          </FormSection>

          <FormSection index="05" title="Household">
            <div>
              <label className="form-label" style={{ fontWeight: 700, fontSize: "0.78rem", color: "#1C1A17", letterSpacing: "0.04em" }}>
                Other Occupants
              </label>
              <p style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "0.82rem", color: "#6B6055", fontWeight: 300, margin: "0 0 1rem" }}>
                List anyone else who will be living in the unit.
              </p>
              {occupants.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "1.25rem" }}>
                  {occupants.map((occupant, idx) => (
                    <div
                      key={idx}
                      className="rental-occupant-row"
                      style={{
                        paddingBottom: "1rem",
                        borderBottom: idx < occupants.length - 1 ? "1px solid #DDD5C8" : "none",
                      }}
                    >
                      <Field label="Name">
                        <input className="form-input" value={occupant.name} onChange={(e) => updateOccupant(idx, "name", e.target.value)} />
                      </Field>
                      <Field label="Age">
                        <input type="number" min="0" className="form-input" value={occupant.age} onChange={(e) => updateOccupant(idx, "age", e.target.value)} />
                      </Field>
                      <EmailField label="Email" name="occupantEmail" value={occupant.email} onChange={(v) => updateOccupant(idx, "email", v)} />
                      <PhoneField label="Phone" name="occupantPhone" value={occupant.phone} onChange={(v) => updateOccupant(idx, "phone", v)} />
                      <button type="button" className="btn-ghost" style={{ padding: "0.6rem 0.9rem" }} onClick={() => removeOccupant(idx)}>
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <button type="button" className="btn-ghost" onClick={addOccupant}>
                + Add Occupant
              </button>
            </div>

            <div style={{ height: "1px", background: "#DDD5C8", margin: "2rem 0" }} />

            <div className="rental-grid-2">
              <Field label="Do you have pets? *">
                <select name="hasPets" required className="form-input" style={{ appearance: "none", cursor: "pointer", background: "transparent" }} value={formData.hasPets} onChange={handleChange}>
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </Field>
              {formData.hasPets === "yes" && (
                <Field label="Pet Details (type, breed, weight)">
                  <input name="petDetails" className="form-input" value={formData.petDetails} onChange={handleChange} />
                </Field>
              )}
            </div>

            <div style={{ height: "1px", background: "#DDD5C8", margin: "2rem 0" }} />

            <div>
              <label className="form-label" style={{ fontWeight: 700, fontSize: "0.78rem", color: "#1C1A17", letterSpacing: "0.04em" }}>
                Vehicle Information
              </label>
              {vehicles.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", margin: "1rem 0" }}>
                  {vehicles.map((vehicle, idx) => (
                    <div
                      key={idx}
                      className="rental-occupant-row"
                      style={{
                        paddingBottom: "1rem",
                        borderBottom: idx < vehicles.length - 1 ? "1px solid #DDD5C8" : "none",
                      }}
                    >
                      <Field label="Make">
                        <input className="form-input" value={vehicle.make} onChange={(e) => updateVehicle(idx, "make", e.target.value)} />
                      </Field>
                      <Field label="Model">
                        <input className="form-input" value={vehicle.model} onChange={(e) => updateVehicle(idx, "model", e.target.value)} />
                      </Field>
                      <Field label="Year">
                        <input className="form-input" value={vehicle.year} onChange={(e) => updateVehicle(idx, "year", e.target.value)} />
                      </Field>
                      <Field label="License Plate">
                        <input className="form-input" value={vehicle.plate} onChange={(e) => updateVehicle(idx, "plate", e.target.value)} />
                      </Field>
                      <button type="button" className="btn-ghost" style={{ padding: "0.6rem 0.9rem" }} onClick={() => removeVehicle(idx)}>
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <button type="button" className="btn-ghost" style={{ marginTop: vehicles.length ? 0 : "1rem" }} onClick={addVehicle}>
                + Add Vehicle
              </button>
            </div>
          </FormSection>

          <FormSection index="06" title="Emergency Contact">
            <div className="rental-grid-2">
              <Field label="Name *">
                <input name="emergencyContactName" required className="form-input" value={formData.emergencyContactName} onChange={handleChange} />
              </Field>
              <Field label="Relationship *">
                <input name="emergencyContactRelationship" required className="form-input" value={formData.emergencyContactRelationship} onChange={handleChange} />
              </Field>
              <PhoneField label="Phone *" name="emergencyContactPhone" required value={formData.emergencyContactPhone} onChange={(v) => setFormData((prev) => ({ ...prev, emergencyContactPhone: v }))} />
              <EmailField label="Email" name="emergencyContactEmail" value={formData.emergencyContactEmail} onChange={(v) => setFormData((prev) => ({ ...prev, emergencyContactEmail: v }))} />
            </div>
          </FormSection>

          <FormSection index="07" title="Required Documents" description={`Accepted formats: JPG, PNG, or PDF. Maximum ${MAX_FILE_SIZE_MB}MB per file.`}>
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              <FileUploadField
                label="Valid Photo ID *"
                accept="image/*,.pdf"
                file={photoIdFile}
                onChange={handlePhotoIdChange}
              />
              <div>
                <label className="form-label" style={{ fontWeight: 700, fontSize: "0.78rem", color: "#1C1A17", letterSpacing: "0.04em" }}>
                  Proof of Income *
                </label>
                <p style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "0.82rem", color: "#6B6055", fontWeight: 300, margin: "0.35rem 0 1rem" }}>
                  Upload two recent bank statements OR two recent pay stubs.
                </p>
                <div className="rental-grid-2">
                  <FileUploadField
                    label="Document 1 *"
                    accept="image/*,.pdf"
                    file={incomeDocFiles[0]}
                    onChange={(file) => handleIncomeDocChange(0, file)}
                  />
                  <FileUploadField
                    label="Document 2 *"
                    accept="image/*,.pdf"
                    file={incomeDocFiles[1]}
                    onChange={(file) => handleIncomeDocChange(1, file)}
                  />
                </div>
              </div>
              <div>
                <label className="form-label" style={{ fontWeight: 700, fontSize: "0.78rem", color: "#1C1A17", letterSpacing: "0.04em" }}>
                  Additional Documents (optional)
                </label>
                <p style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "0.82rem", color: "#6B6055", fontWeight: 300, margin: "0.35rem 0 1rem" }}>
                  Anything else you'd like to include (e.g. reference letters, additional ID).
                </p>
                {additionalFileSlots.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "1.25rem" }}>
                    {additionalFileSlots.map((file, idx) => (
                      <div key={idx} style={{ display: "flex", alignItems: "flex-end", gap: "1rem" }}>
                        <div style={{ flex: 1 }}>
                          <FileUploadField
                            label={`Additional Document ${idx + 1}`}
                            accept="image/*,.pdf"
                            file={file}
                            onChange={(f) => handleAdditionalFileChange(idx, f)}
                          />
                        </div>
                        <button type="button" className="btn-ghost" style={{ padding: "0.6rem 0.9rem" }} onClick={() => removeAdditionalFileSlot(idx)}>
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <button type="button" className="btn-ghost" onClick={addAdditionalFileSlot}>
                  + Add Additional File
                </button>
              </div>
              {fileError && <p style={{ color: "#B4432F", fontSize: "0.82rem" }}>{fileError}</p>}
            </div>
          </FormSection>

          <FormSection index="08" title="Disclosures & Consent">
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {[
                {
                  checked: consentCreditCheck,
                  onChange: setConsentCreditCheck,
                  label: "I understand and consent that a soft credit check will be conducted as part of this application.",
                },
                {
                  checked: consentPhotoId,
                  onChange: setConsentPhotoId,
                  label: "I understand that a valid, government-issued photo ID is required to process this application.",
                },
                {
                  checked: consentIncomeDocs,
                  onChange: setConsentIncomeDocs,
                  label: "I understand that proof of income — two recent bank statements or two recent pay stubs — is required to process this application.",
                },
              ].map((item) => (
                <label key={item.label} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    required
                    checked={item.checked}
                    onChange={(e) => item.onChange(e.target.checked)}
                    style={{ marginTop: "0.25rem" }}
                  />
                  <span style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "0.85rem", color: "#1C1A17", fontWeight: 300, lineHeight: 1.6 }}>
                    {item.label}
                  </span>
                </label>
              ))}

              <div style={{ marginTop: "1rem" }}>
                <Field label="Signature (type your full legal name) *">
                  <input
                    name="signatureFullName"
                    required
                    className="form-input"
                    value={formData.signatureFullName}
                    onChange={handleChange}
                  />
                </Field>
              </div>
            </div>
          </FormSection>

          {error && (
            <p style={{ color: "#B4432F", fontSize: "0.85rem", marginTop: "1.5rem" }}>{error}</p>
          )}

          <div style={{ marginTop: "1.5rem" }}>
            <button type="submit" disabled={submitting} className="btn-primary" style={{ border: "none", opacity: submitting ? 0.6 : 1, padding: "0.9rem 2.25rem", fontSize: "0.9rem" }}>
              {submitting ? "Submitting..." : "Submit Application →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
