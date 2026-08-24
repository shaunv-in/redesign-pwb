/* ==========================================================================
   HERO — full-height, text-led. No stock badge, no photo.
   A live Winnipeg clock stands in for the generic "available for work"
   pill, and the headline uses a rotating word + a hand-drawn underline
   instead of the italic-accent-line formula.
   ========================================================================== */

import { useEffect, useState } from "react";
import WordRotator from "@/components/WordRotator";

function useWinnipegClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const format = () =>
      new Intl.DateTimeFormat("en-CA", {
        hour: "numeric",
        minute: "2-digit",
        timeZone: "America/Winnipeg",
      }).format(new Date());
    setTime(format());
    const id = setInterval(() => setTime(format()), 30_000);
    return () => clearInterval(id);
  }, []);

  return time;
}

export default function HeroSection() {
  const time = useWinnipegClock();

  return (
    <section
      id="hero"
      className="pf-grid-texture"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        paddingBottom: "5rem",
        paddingTop: "9rem",
        borderBottom: "1px solid var(--pf-line)",
        backgroundColor: "var(--pf-paper)",
        backgroundPosition: "-11px -11px",
      }}
    >
      <div className="container">
        {/* Live status line — replaces the generic "available for new projects" badge */}
        <div style={{ marginBottom: "3rem", display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
          <span style={{ display: "inline-block", width: "6px", height: "6px", borderRadius: "50%", background: "var(--pf-pen)" }} />
          <span className="pf-mono" style={{ fontSize: "0.72rem", letterSpacing: "0.05em", color: "var(--pf-ink-soft)" }}>
            {/* Fixed-width slot (JetBrains Mono is a true monospace, so `ch` is exact) reserves
                space for the longest realistic time string up front — otherwise the clock
                effect populating this after mount grows the line and shifts everything below
                it. A smaller, real contributor to layout shift on this page. */}
            <span style={{ display: "inline-block", minWidth: "10ch" }}>{time}</span> in Winnipeg. Marketing Manager at Paragon Living, open to select freelance work
          </span>
        </div>

        {/* Main headline */}
        <div style={{ marginBottom: "3.5rem" }}>
          <h1
            className="pf-serif"
            style={{
              fontWeight: 500,
              fontSize: "clamp(2.75rem, 8vw, 7.25rem)",
              lineHeight: 0.98,
              letterSpacing: "-0.02em",
              color: "var(--pf-ink)",
              margin: 0,
            }}
          >
            Design that{" "}
            <WordRotator
              words={["converts.", "performs.", "connects.", "sells."]}
              className="pf-serif"
              interval={2200}
            />
          </h1>
        </div>

        {/* Sub-line + CTAs */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "2.5rem",
          }}
        >
          <p style={{
            fontSize: "1rem",
            fontWeight: 400,
            color: "var(--pf-ink-soft)",
            margin: 0,
            lineHeight: 1.75,
            maxWidth: "380px",
          }}>
            UI/UX & visual designer and growing entrepreneur.<br />
            5+ years across product design, branding, marketing, and sales.
          </p>

          <div style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap" }}>
            <a href="#contact" className="pf-btn">Work With Me</a>
            <a href="#work" className="pf-btn-ghost">View Work</a>
          </div>
        </div>

        {/* Bottom meta row */}
        <div
          style={{
            marginTop: "5rem",
            paddingTop: "2rem",
            borderTop: "1px solid var(--pf-line)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div style={{ display: "flex", gap: "1.5rem 2.5rem", flexWrap: "wrap" }}>
            {[
              { label: "Dribbble", href: "https://dribbble.com/shaunvnzt" },
              { label: "Behance", href: "https://www.behance.net/shaunvnzt" },
              { label: "LinkedIn", href: "https://www.linkedin.com/in/shaunvnzt/" },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="pf-mono"
                style={{
                  fontSize: "0.72rem",
                  letterSpacing: "0.06em",
                  color: "var(--pf-ink-soft)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--pf-pen)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--pf-ink-soft)")}
              >
                {s.label} ↗
              </a>
            ))}
          </div>
          <span className="pf-mono" style={{ fontSize: "0.72rem", letterSpacing: "0.06em", color: "var(--pf-ink-soft)" }}>
            Winnipeg, Canada
          </span>
        </div>
      </div>
    </section>
  );
}
