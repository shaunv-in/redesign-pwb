/* ==========================================================================
   CREDIBILITY — Warm Beige Minimalism
   Simple stat row + pull quote. No icons, no cards.
   ========================================================================== */

import { useEffect, useRef } from "react";

const stats = [
  { value: "18+", label: "Dribbble shots published" },
  { value: "5+", label: "Years of experience" },
  { value: "3", label: "Service disciplines" },
  { value: "B.A.", label: "Economics, U of Manitoba" },
];

export default function CredibilitySection() {
  const ref = useRef<HTMLDivElement>(null);

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
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="credibility"
      ref={ref}
      style={{ background: "#EDE8DF", padding: "8rem 0", borderBottom: "1px solid #DDD5C8" }}
    >
      <div className="container">
        {/* Header */}
        <div className="fade-up" style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "5rem" }}>
          <span className="label-text">04 — Trusted By</span>
          <div style={{ flex: 1, height: "1px", background: "#DDD5C8" }} />
        </div>

        {/* Stats row */}
        <div
          className="cred-grid"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0", marginBottom: "6rem" }}
        >
          {stats.map((stat, i) => (
            <div
              key={i}
              className="fade-up"
              style={{
                padding: "2.5rem 0",
                borderTop: "1px solid #DDD5C8",
                paddingRight: "2rem",
              }}
            >
              <div style={{
                fontFamily: "'Libre Baskerville', serif",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 700,
                color: "#1C1A17",
                letterSpacing: "-0.03em",
                lineHeight: 1,
                marginBottom: "0.5rem",
              }}>
                {stat.value}
              </div>
              <div style={{
                fontFamily: "'Instrument Sans', sans-serif",
                fontSize: "0.82rem",
                fontWeight: 300,
                color: "#6B6055",
                lineHeight: 1.5,
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Pull quote */}
        <div className="fade-up" style={{ maxWidth: "720px" }}>
          <blockquote style={{ margin: 0, padding: 0 }}>
            <p style={{
              fontFamily: "'Libre Baskerville', serif",
              fontStyle: "italic",
              fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)",
              fontWeight: 400,
              color: "#1C1A17",
              lineHeight: 1.55,
              margin: "0 0 2rem",
              letterSpacing: "-0.01em",
            }}>
              "Every pixel has a purpose. From SaaS dashboards to real estate marketing — design that doesn't just look good, it performs."
            </p>
            <footer style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "0.68rem",
              letterSpacing: "0.1em",
              color: "#A89880",
              textTransform: "uppercase",
            }}>
              — Shaun Vincent, UI/UX Designer · Winnipeg, Canada
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
