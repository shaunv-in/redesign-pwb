/* ==========================================================================
   CONTACT — Warm Beige Minimalism
   Two-column: left = headline + contact links, right = minimal form
   ========================================================================== */

import { useEffect, useRef, useState } from "react";

export default function ContactSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", projectType: "", message: "" });

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      style={{ background: "#F5F0E8", padding: "8rem 0", borderBottom: "1px solid #DDD5C8" }}
    >
      <div className="container">
        {/* Header */}
        <div className="fade-up" style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "5rem" }}>
          <span className="label-text">05 — Let's Work Together</span>
          <div style={{ flex: 1, height: "1px", background: "#DDD5C8" }} />
        </div>

        <div
          className="contact-grid"
          style={{ display: "grid", gridTemplateColumns: "1fr", gap: "5rem" }}
        >
          {/* Left: Copy */}
          <div>
            <div className="fade-up" style={{ marginBottom: "2rem" }}>
              <h2 style={{
                fontFamily: "'Libre Baskerville', serif",
                fontWeight: 700,
                fontSize: "clamp(2rem, 4vw, 3.25rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.025em",
                color: "#1C1A17",
                margin: 0,
              }}>
                Have a project<br />
                <em style={{ fontStyle: "italic", fontWeight: 400, color: "#8B6F47" }}>in mind?</em>
              </h2>
            </div>

            <div className="fade-up">
              <p style={{
                fontFamily: "'Instrument Sans', sans-serif",
                fontSize: "0.975rem",
                fontWeight: 300,
                color: "#6B6055",
                lineHeight: 1.8,
                marginBottom: "2.5rem",
                maxWidth: "360px",
              }}>
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
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: "0.75rem",
                    letterSpacing: "0.06em",
                    color: "#6B6055",
                    textDecoration: "none",
                    transition: "color 0.2s",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#1C1A17")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#6B6055")}
                >
                  <span style={{ color: "#8B6F47" }}>→</span>
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <div className="fade-up">
            {submitted ? (
              <div style={{ padding: "3rem 0" }}>
                <p style={{
                  fontFamily: "'Libre Baskerville', serif",
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "#1C1A17",
                  marginBottom: "0.75rem",
                }}>
                  Message sent.
                </p>
                <p style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "0.9rem", color: "#6B6055", fontWeight: 300 }}>
                  I'll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                  <div>
                    <label className="form-label" htmlFor="name">Name</label>
                    <input id="name" name="name" type="text" required placeholder="Your name" value={formData.name} onChange={handleChange} className="form-input" />
                  </div>
                  <div>
                    <label className="form-label" htmlFor="email">Email</label>
                    <input id="email" name="email" type="email" required placeholder="your@email.com" value={formData.email} onChange={handleChange} className="form-input" />
                  </div>
                </div>

                <div>
                  <label className="form-label" htmlFor="projectType">Project Type</label>
                  <select id="projectType" name="projectType" required value={formData.projectType} onChange={handleChange} className="form-input" style={{ appearance: "none", cursor: "pointer", background: "transparent" }}>
                    <option value="" disabled>Select project type</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Branding">Branding</option>
                    <option value="Marketing Creative">Marketing Creative</option>
                    <option value="Web Design">Web Design</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="form-label" htmlFor="message">Message</label>
                  <textarea id="message" name="message" required rows={4} placeholder="Tell me about your project..." value={formData.message} onChange={handleChange} className="form-input" style={{ resize: "vertical", minHeight: "100px" }} />
                </div>

                <div>
                  <button type="submit" disabled={submitting} className="btn-primary" style={{ border: "none", opacity: submitting ? 0.6 : 1 }}>
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
