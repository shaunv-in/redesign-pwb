/* ==========================================================================
   CREDIBILITY — stat row + pull quote. No icons, no cards.
   ========================================================================== */

import { useEffect, useRef } from "react";
import Eyebrow from "@/components/Eyebrow";

const stats = [
  { value: "18+", label: "Dribbble shots published" },
  { value: "5+", label: "Years of experience" },
  { value: "4", label: "Service disciplines" },
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
      style={{ background: "var(--pf-paper-alt)", padding: "8rem 0", borderBottom: "1px solid var(--pf-line)" }}
    >
      <div className="container">
        {/* Header */}
        <div className="fade-up" style={{ marginBottom: "5rem" }}>
          <Eyebrow>by the numbers</Eyebrow>
        </div>

        {/* Stats row */}
        <div className="pf-cred-grid" style={{ marginBottom: "6rem" }}>
          {stats.map((stat, i) => (
            <div
              key={i}
              className="fade-up"
              style={{ padding: "2.5rem 0", borderTop: "1px solid var(--pf-line)", paddingRight: "2rem" }}
            >
              <div className="pf-serif" style={{
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 500,
                color: "var(--pf-ink)",
                letterSpacing: "-0.02em",
                lineHeight: 1,
                marginBottom: "0.5rem",
              }}>
                {stat.value}
              </div>
              <div style={{ fontSize: "0.85rem", fontWeight: 400, color: "var(--pf-ink-soft)", lineHeight: 1.5 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Pull quote */}
        <div className="fade-up" style={{ maxWidth: "760px", position: "relative" }}>
          <span className="pf-serif" aria-hidden="true" style={{
            position: "absolute",
            top: "-2.5rem",
            left: "-0.5rem",
            fontSize: "5rem",
            fontStyle: "italic",
            color: "var(--pf-pen)",
            opacity: 0.25,
            lineHeight: 1,
          }}>
            "
          </span>
          <blockquote style={{ margin: 0, padding: 0 }}>
            <p className="pf-serif" style={{
              fontStyle: "italic",
              fontSize: "clamp(1.25rem, 2.5vw, 1.85rem)",
              fontWeight: 400,
              color: "var(--pf-ink)",
              lineHeight: 1.55,
              margin: "0 0 2rem",
              letterSpacing: "-0.01em",
              position: "relative",
            }}>
              Every pixel has a purpose. From SaaS dashboards to real estate marketing, design that doesn't just look good. It performs.
            </p>
            <footer style={{ fontSize: "0.82rem", color: "var(--pf-ink-soft)", fontWeight: 500 }}>
              — Shaun Vincent, UI/UX Designer · Winnipeg, Canada
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
