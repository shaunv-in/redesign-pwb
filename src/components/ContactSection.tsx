/* ==========================================================================
   CONTACT — two-column: headline + links, and a validated inline form that
   hands off to the visitor's email app (mailto), which the copy says plainly.
   ========================================================================== */

import { useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import Eyebrow from "@/components/Eyebrow";
import { useReveal } from "@/hooks/useReveal";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const links = [
  { label: "shaun@shaunvincent.net", href: "mailto:shaun@shaunvincent.net" },
  { label: "@shaunvnzt on Dribbble", href: "https://dribbble.com/shaunvnzt" },
  { label: "@shaunvnzt on Behance", href: "https://www.behance.net/shaunvnzt" },
  { label: "Shaun Vincent on LinkedIn", href: "https://www.linkedin.com/in/shaunvnzt/" },
];

export default function ContactSection() {
  const ref = useReveal<HTMLElement>();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", projectType: "", message: "" });
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const emailValid = formData.email === "" || EMAIL_RE.test(formData.email);
  const showEmailError = touched.email && (!emailValid || formData.email === "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!EMAIL_RE.test(formData.email)) {
      setTouched((prev) => ({ ...prev, email: true }));
      document.getElementById("email")?.focus();
      return;
    }
    setSubmitting(true);
    const subject = encodeURIComponent(`Portfolio Inquiry: ${formData.projectType || "New Project"}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\nProject Type: ${formData.projectType}\n\nMessage:\n${formData.message}`
    );
    window.location.href = `mailto:shaun@shaunvincent.net?subject=${subject}&body=${body}`;
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <section id="contact" ref={ref} className="pf-section">
      <div className="container">
        <div className="pf-contact-grid">
          {/* Left: Copy */}
          <div>
            <div className="fade-up" style={{ marginBottom: "2rem" }}>
              <Eyebrow>let's work together</Eyebrow>
            </div>
            <h2 className="pf-h2 fade-up" style={{ marginBottom: "1.5rem" }}>
              Have a project in mind?
            </h2>
            <p className="pf-lede fade-up" style={{ maxWidth: "38ch" }}>
              I'd love to hear about it. Send a few details and I'll get back to you within 24 hours.
            </p>

            <div className="pf-contact-links fade-up">
              {links.map((link) => {
                const external = link.href.startsWith("http");
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                  >
                    <ArrowRight size={16} strokeWidth={1.75} aria-hidden="true" />
                    {link.label}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Right: Form */}
          <div className="pf-form-card fade-up">
            {submitted ? (
              <div className="pf-form-done" role="status">
                <h3>Almost there.</h3>
                <p>Your email app should have opened with your message. Hit send and I'll reply within 24 hours.</p>
                <button type="button" className="pf-btn-ghost" onClick={() => setSubmitted(false)}>
                  Edit Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="pf-form">
                <div className="pf-form-row">
                  <div className="pf-field">
                    <label className="pf-label" htmlFor="name">
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="pf-input"
                    />
                  </div>
                  <div className="pf-field">
                    <label className="pf-label" htmlFor="email">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`pf-input${showEmailError ? " pf-invalid" : ""}`}
                      aria-invalid={showEmailError || undefined}
                      aria-describedby={showEmailError ? "email-error" : undefined}
                    />
                    {showEmailError && (
                      <p className="pf-error" id="email-error">
                        Enter a valid email address so I can reply.
                      </p>
                    )}
                  </div>
                </div>

                <div className="pf-field">
                  <label className="pf-label" htmlFor="projectType">
                    Project Type
                  </label>
                  <div className="pf-select-wrap">
                    <select
                      id="projectType"
                      name="projectType"
                      required
                      value={formData.projectType}
                      onChange={handleChange}
                      className="pf-input"
                    >
                      <option value="" disabled>
                        Select project type
                      </option>
                      <option value="UI/UX Design">UI/UX Design</option>
                      <option value="Branding">Branding</option>
                      <option value="Marketing Creative">Marketing Creative</option>
                      <option value="Web Design">Web Design</option>
                      <option value="Other">Other</option>
                    </select>
                    <ChevronDown size={18} strokeWidth={1.75} aria-hidden="true" />
                  </div>
                </div>

                <div className="pf-field">
                  <label className="pf-label" htmlFor="message">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    placeholder="Tell me about your project..."
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="pf-input"
                    style={{ resize: "vertical", minHeight: "110px" }}
                  />
                </div>

                <div>
                  <button type="submit" disabled={submitting} className="pf-btn">
                    {submitting ? "Opening email..." : "Send Message"}
                    {!submitting && <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />}
                  </button>
                  <p className="pf-help">Opens your email app with this message ready to send.</p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
