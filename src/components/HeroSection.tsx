/* ==========================================================================
   HERO — Warm Beige Minimalism
   Full-height, text-only, bottom-anchored layout. No background image.
   ========================================================================== */

import { useEffect, useRef } from "react";

export default function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const items = ref.current?.querySelectorAll(".fade-up");
    items?.forEach((el, i) => {
      setTimeout(() => (el as HTMLElement).classList.add("visible"), 80 + i * 130);
    });
  }, []);

  return (
    <section
      id="hero"
      ref={ref}
      style={{
        background: "#F5F0E8",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        paddingBottom: "5rem",
        paddingTop: "9rem",
        borderBottom: "1px solid #DDD5C8",
      }}
    >
      <div className="container">

        {/* Eyebrow */}
        <div className="fade-up" style={{ marginBottom: "3rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span style={{ display: "inline-block", width: "6px", height: "6px", borderRadius: "50%", background: "#8B6F47" }} />
          <span className="label-text">Available for new projects</span>
        </div>

        {/* Main headline */}
        <div className="fade-up" style={{ marginBottom: "3.5rem" }}>
          <h1
            style={{
              fontFamily: "'Libre Baskerville', serif",
              fontWeight: 700,
              fontSize: "clamp(3rem, 8.5vw, 8rem)",
              lineHeight: 1.0,
              letterSpacing: "-0.03em",
              color: "#1C1A17",
              margin: 0,
            }}
          >
            UI/UX Design<br />
            <em style={{ fontStyle: "italic", fontWeight: 400, color: "#8B6F47" }}>that converts.</em>
          </h1>
        </div>

        {/* Sub-line + CTAs */}
        <div
          className="fade-up"
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "2.5rem",
          }}
        >
          <p style={{
            fontFamily: "'Instrument Sans', sans-serif",
            fontSize: "1rem",
            fontWeight: 300,
            color: "#6B6055",
            margin: 0,
            lineHeight: 1.75,
            maxWidth: "380px",
          }}>
            Winnipeg-based UI/UX &amp; visual designer.<br />
            5+ years across product design, branding, and web.
          </p>

          <div style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap" }}>
            <a href="#contact" className="btn-primary">Work With Me</a>
            <a href="#work" className="btn-ghost">View Work</a>
          </div>
        </div>

        {/* Bottom meta row */}
        <div
          className="fade-up"
          style={{
            marginTop: "5rem",
            paddingTop: "2rem",
            borderTop: "1px solid #DDD5C8",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div style={{ display: "flex", gap: "2.5rem" }}>
            {[
              { label: "Dribbble", href: "https://dribbble.com/shaunvnzt" },
              { label: "Behance", href: "https://www.behance.net/shaunvnzt" },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "0.68rem",
                  letterSpacing: "0.1em",
                  color: "#A89880",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#1C1A17")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#A89880")}
              >
                {s.label} ↗
              </a>
            ))}
          </div>
          <span className="label-text">Winnipeg, Canada</span>
        </div>
      </div>
    </section>
  );
}
