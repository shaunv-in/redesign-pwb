/* ==========================================================================
   ADMIN — Rental Application Review
   Supabase-authenticated view of submitted 300 Centre Street applications.
   ========================================================================== */

import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { RENTAL_DOCS_BUCKET, supabase } from "@/lib/supabaseClient";

type RentalApplicationRow = {
  id: string;
  application_number: string | null;
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
  consent_soft_credit_check: boolean;
  consent_photo_id_required: boolean;
  consent_income_docs_required: boolean;
  signature_full_name: string | null;
  signed_at: string | null;
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

function ApplicationDetail({ app }: { app: RentalApplicationRow }) {
  const [photoIdUrl, setPhotoIdUrl] = useState<string | null>(null);
  const [incomeDocUrls, setIncomeDocUrls] = useState<string[]>([]);

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
    }
    loadLinks();
    return () => {
      cancelled = true;
    };
  }, [app.photo_id_path, app.income_doc_paths]);

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
        label="Vehicle"
        value={(() => {
          const vehicle = parseJson<Vehicle>(app.vehicle_info);
          if (!vehicle) return null;
          return [vehicle.year, vehicle.make, vehicle.model, vehicle.plate && `— plate ${vehicle.plate}`]
            .filter(Boolean)
            .join(" ");
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

      <div style={{ height: "1px", background: "#DDD5C8", margin: "1rem 0" }} />
      <Row label="Consents" value={`Soft credit check: ${app.consent_soft_credit_check ? "Yes" : "No"} · Photo ID: ${app.consent_photo_id_required ? "Yes" : "No"} · Income docs: ${app.consent_income_docs_required ? "Yes" : "No"}`} />
      <Row label="Signature" value={app.signature_full_name} />
      <Row label="Signed At" value={app.signed_at ? new Date(app.signed_at).toLocaleString() : null} />
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

export default function Admin() {
  const [session, setSession] = useState<Session | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [applications, setApplications] = useState<RentalApplicationRow[]>([]);
  const [loadingApps, setLoadingApps] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

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
      .then(({ data, error }) => {
        setLoadingApps(false);
        if (error) {
          setLoadError(error.message);
          return;
        }
        setApplications((data as RentalApplicationRow[]) ?? []);
      });
  }, [session]);

  if (checkingSession) return null;

  if (!session) {
    return <LoginForm onSignedIn={() => {}} />;
  }

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

        {loadingApps && <p style={{ fontFamily: "'Instrument Sans', sans-serif", color: "#6B6055" }}>Loading applications...</p>}
        {loadError && <p style={{ color: "#B4432F" }}>{loadError}</p>}
        {!loadingApps && applications.length === 0 && (
          <p style={{ fontFamily: "'Instrument Sans', sans-serif", color: "#6B6055" }}>No applications submitted yet.</p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {applications.map((app) => (
            <div key={app.id} style={{ border: "1px solid #DDD5C8" }}>
              <button
                onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "1.25rem 1.5rem",
                  background: "transparent",
                  border: "none",
                  textAlign: "left",
                  fontFamily: "'Instrument Sans', sans-serif",
                }}
              >
                <span style={{ fontWeight: 500, color: "#1C1A17" }}>
                  {app.full_name}
                  {app.application_number && (
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 400, color: "#A89880", marginLeft: "0.6rem", fontSize: "0.8rem" }}>
                      {app.application_number}
                    </span>
                  )}
                </span>
                <span style={{ fontSize: "0.8rem", color: "#6B6055" }}>
                  {new Date(app.created_at).toLocaleDateString()} {expandedId === app.id ? "▲" : "▼"}
                </span>
              </button>
              {expandedId === app.id && <ApplicationDetail app={app} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
