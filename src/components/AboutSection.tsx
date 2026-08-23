/* ==========================================================================
   ABOUT — two-column: bio + experience timeline. No headshot.
   ========================================================================== */

import { useEffect, useRef } from "react";
import Eyebrow from "@/components/Eyebrow";

const experience = [
  {
    role: "Marketing Manager",
    company: "Paragon Living",
    companyUrl: "https://www.paragonliving.com/",
    period: "July 2026 — Current",
    desc: "Digital campaigns, content strategy, market research, and resident engagement across a portfolio of multifamily residential communities.",
  },
  {
    role: "Leasing & Marketing Manager",
    company: "Sunrex Management Ltd.",
    companyUrl: "https://www.sunrex.ca/",
    period: "June 2024 — June 2026",
    desc: "Digital ad campaigns, social content, lease renewal systems, property showings, and resident communications across a residential portfolio.",
  },
  {
    role: "Co-Owner & Creative Director",
    company: "Side Lane Studio",
    companyUrl: "https://www.sidelanestudio.com/",
    period: "Ongoing",
    desc: "Full-service creative studio offering UI/UX design, branding, and digital marketing for businesses across Canada and globally.",
  },
  {
    role: "Freelance UI/UX Designer",
    company: "Self-employed",
    period: "Ongoing",
    desc: "Product design, branding, and web projects for clients across Canada and globally.",
  },
  {
    role: "Sales Representative",
    company: "SM Automotive Solutions",
    companyUrl: "https://share.google/aArLZnINm87C5lpRH",
    period: "Ongoing",
    desc: "Automotive sales and client relations, driving revenue through consultative selling and customer service excellence.",
  },
  {
    role: "Real Estate Investor",
    company: "Bridgewater Centre, Rental Condo",
    period: "Ongoing",
    desc: "Owner and investor of a rental condominium unit at Bridgewater Centre, managing tenant relations and long-term asset growth.",
  },
];

export default function AboutSection() {
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
      { threshold: 0.08 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="about"
      ref={ref}
      style={{ background: "var(--pf-paper)", padding: "8rem 0", borderBottom: "1px solid var(--pf-line)" }}
    >
      <div className="container">
        {/* Section header */}
        <div className="fade-up" style={{ marginBottom: "5rem" }}>
          <Eyebrow>about</Eyebrow>
        </div>

        {/* Two-column layout */}
        <div className="pf-about-grid">
          {/* Left: Bio */}
          <div>
            <div className="fade-up" style={{ marginBottom: "2.5rem" }}>
              <h2
                className="pf-serif"
                style={{
                  fontWeight: 500,
                  fontSize: "clamp(2rem, 4vw, 3.25rem)",
                  lineHeight: 1.15,
                  letterSpacing: "-0.02em",
                  color: "var(--pf-ink)",
                  margin: 0,
                }}
              >
                A designer who reads the spreadsheet, too.
              </h2>
            </div>

            <div className="fade-up">
              <p style={{
                fontSize: "0.975rem",
                fontWeight: 400,
                lineHeight: 1.85,
                color: "var(--pf-ink-soft)",
                marginBottom: "1.25rem",
              }}>
                I'm Shaun Vincent, a UI/UX designer and marketing creative currently working at{" "}
                <a href="https://www.paragonliving.com/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--pf-ink)", fontWeight: 600, textDecoration: "underline", textUnderlineOffset: "3px", textDecorationColor: "var(--pf-line)" }}>Paragon Living</a>{" "}
                as Marketing Manager. I handle everything from digital ad campaigns and content strategy to market research and resident engagement across a portfolio of multifamily residential communities.
              </p>
              <p style={{
                fontSize: "0.975rem",
                fontWeight: 400,
                lineHeight: 1.85,
                color: "var(--pf-ink-soft)",
              }}>
                My background combines design, economics (<a href="https://umanitoba.ca/" target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "underline", textUnderlineOffset: "3px" }}>University of Manitoba</a>, B.A.), and hands-on marketing execution. That means I design things that don't just look good, they{" "}
                <em className="pf-serif" style={{ fontStyle: "italic", color: "var(--pf-pen)" }}>perform</em>.
              </p>
            </div>

            {/* Tags */}
            <div className="fade-up" style={{ marginTop: "2.5rem", display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {["Strategy-first", "Figma-native", "Fast turnaround", "Works globally"].map((tag) => (
                <span key={tag} className="pf-chip">{tag}</span>
              ))}
            </div>
          </div>

          {/* Right: Experience */}
          <div>
            <div className="fade-up" style={{ marginBottom: "2rem" }}>
              <span className="pf-mono" style={{ fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--pf-ink-faint)" }}>
                Experience
              </span>
            </div>

            {experience.map((exp, i) => (
              <div
                key={i}
                className="fade-up"
                style={{
                  padding: "1.75rem 0",
                  borderTop: "1px solid var(--pf-line)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", marginBottom: "0.5rem" }}>
                  <div>
                    <h3 style={{
                      fontSize: "0.95rem",
                      fontWeight: 600,
                      color: "var(--pf-ink)",
                      margin: "0 0 0.2rem",
                    }}>
                      {exp.role}
                    </h3>
                    {(exp as any).companyUrl ? (
                      <a
                        href={(exp as any).companyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: "0.82rem",
                          color: "var(--pf-pen)",
                          textDecoration: "none",
                          fontWeight: 500,
                          borderBottom: "1px solid rgba(42,70,217,0.3)",
                          transition: "border-color 0.2s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--pf-pen)")}
                        onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(42,70,217,0.3)")}
                      >
                        {exp.company} ↗
                      </a>
                    ) : (
                      <span style={{ fontSize: "0.82rem", color: "var(--pf-pen)", fontWeight: 500 }}>
                        {exp.company}
                      </span>
                    )}
                  </div>
                  <span className="pf-mono" style={{ fontSize: "0.65rem", color: "var(--pf-ink-faint)", letterSpacing: "0.04em", whiteSpace: "nowrap", marginTop: "0.15rem" }}>
                    {exp.period}
                  </span>
                </div>
                <p style={{
                  fontSize: "0.875rem",
                  fontWeight: 400,
                  color: "var(--pf-ink-soft)",
                  lineHeight: 1.7,
                  margin: 0,
                }}>
                  {exp.desc}
                </p>
              </div>
            ))}

            {/* Education */}
            <div className="fade-up" style={{ marginTop: "2.5rem" }}>
              <span className="pf-mono" style={{ display: "block", marginBottom: "1rem", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--pf-ink-faint)" }}>
                Education
              </span>
              <div style={{ borderTop: "1px solid var(--pf-line)", paddingTop: "1.5rem" }}>
                <a href="https://umanitoba.ca/" target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--pf-ink)", margin: "0 0 0.2rem", display: "block", textDecoration: "underline", textUnderlineOffset: "3px", textDecorationColor: "var(--pf-line)" }}>
                  University of Manitoba ↗
                </a>
                <p style={{ fontSize: "0.82rem", color: "var(--pf-pen)", margin: 0, fontWeight: 500 }}>B.A. Economics · Minor in Computer Science</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
