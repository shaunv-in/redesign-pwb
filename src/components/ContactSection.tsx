/* ==========================================================================
   CONTACT — two-column: headline + links, and a validated inline form.
   ========================================================================== */

import { useEffect, useRef, useState } from "react";
import Eyebrow from "@/components/Eyebrow";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", projectType: "", message: "" });
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".fade-up").forEach((el, i) => {
              setTimeout(() => (el as HTMLElement).classList.add("visible"), i * 100);
            });
          }
        });
      },
      { threshold: 0.08 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const emailValid = formData.email === "" || EMAIL_RE.test(formData.email);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!EMAIL_RE.test(formData.email)) {
      setTouched((prev) => ({ ...prev, email: true }));
      return;
    }
    setSubmitting(true);
    const subject = encodeURIComponent(`Portfolio Inquiry: ${formData.projectType || "New Project"}`);
    const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\nProject Type: ${formData.projectType}\n\nMessage:\n${formData.message}`);
    window.location.href = `mailto:shaun@shaunvincent.net?subject=${subject}&body=${body}`;
    setTimeout(() => { setSubmitting(false); setSubmitted(true); }, 800);
  };

  return (
    <section
      id="contact"
      ref={ref}
      style={{ background: "var(--pf-paper)", padding: "8rem 0", borderBottom: "1px solid var(--pf-line)" }}
    >
      <div className="container">
        {/* Header */}
        <div className="fade-up" style={{ marginBottom: "5rem" }}>
          <Eyebrow>let's work together</Eyebrow>
        </div>

        <div className="pf-contact-grid">
          {/* Left: Copy */}
          <div>
            <div className="fade-up" style={{ marginBottom: "2rem" }}>
              <h2 className="pf-serif" style={{
                fontWeight: 500,
                fontSize: "clamp(2rem, 4vw, 3.25rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                color: "var(--pf-ink)",
                margin: 0,
              }}>
                Have a project in mind?
              </h2>
            </div>

            <div className="fade-up">
              <p style={{ fontSize: "0.975rem", fontWeight: 400, color: "var(--pf-ink-soft)", lineHeight: 1.8, marginBottom: "2.5rem", maxWidth: "360px" }}>
                I'd love to hear about it. Fill out the form and I'll get back to you within 24 hours.
              </p>
            </div>

            <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {[
                { label: "shaun@shaunvincent.net", href: "mailto:shaun@shaunvincent.net" },
                { label: "@shaunvnzt on Dribbble", href: "https://dribbble.com/shaunvnzt" },
                { label: "@shaunvnzt on Behance", href: "https://www.behance.net/shaunvnzt" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  style={{
                    fontSize: "0.88rem",
                    color: "var(--pf-ink-soft)",
                    textDecoration: "none",
                    transition: "color 0.2s",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--pf-ink)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--pf-ink-soft)")}
                >
                  <span style={{ color: "var(--pf-pen)" }}>→</span>
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <div className="fade-up">
            {submitted ? (
              <div style={{ padding: "3rem 0" }}>
                <p className="pf-serif" style={{ fontSize: "1.5rem", fontWeight: 500, color: "var(--pf-ink)", marginBottom: "0.75rem" }}>
                  Message sent.
                </p>
                <p style={{ fontSize: "0.9rem", color: "var(--pf-ink-soft)", fontWeight: 400 }}>
                  I'll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.75rem" }}>
                  <div className="pf-field">
                    <label className="pf-label" htmlFor="name">Name</label>
                    <input id="name" name="name" type="text" required placeholder="Your name" value={formData.name} onChange={handleChange} onBlur={handleBlur} className="pf-input" />
                  </div>
                  <div className="pf-field">
                    <label className="pf-label" htmlFor="email">Email</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`pf-input${touched.email && !emailValid ? " pf-invalid" : ""}`}
                      aria-invalid={touched.email && !emailValid}
                      aria-describedby={touched.email && !emailValid ? "email-error" : undefined}
                    />
                    {touched.email && !emailValid && (
                      <p className="pf-error" id="email-error">Enter a valid email address.</p>
                    )}
                  </div>
                </div>

                <div className="pf-field">
                  <label className="pf-label" htmlFor="projectType">Project Type</label>
                  <select id="projectType" name="projectType" required value={formData.projectType} onChange={handleChange} className="pf-input" style={{ appearance: "none", cursor: "pointer", background: "transparent" }}>
                    <option value="" disabled>Select project type</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Branding">Branding</option>
                    <option value="Marketing Creative">Marketing Creative</option>
                    <option value="Web Design">Web Design</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="pf-field">
                  <label className="pf-label" htmlFor="message">Message</label>
                  <textarea id="message" name="message" required rows={4} placeholder="Tell me about your project..." value={formData.message} onChange={handleChange} onBlur={handleBlur} className="pf-input" style={{ resize: "vertical", minHeight: "100px" }} />
                </div>

                <div>
                  <button type="submit" disabled={submitting} className="pf-btn" style={{ border: "none", opacity: submitting ? 0.6 : 1 }}>
                    {submitting ? "Sending..." : "Send It →"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
