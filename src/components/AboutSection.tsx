/* ==========================================================================
   ABOUT — Warm Beige Minimalism
   Two-column: left = bio text, right = experience timeline
   No headshot. Typography-led layout.
   ========================================================================== */

import { useEffect, useRef } from "react";

const experience = [
  {
    role: "Leasing & Marketing Manager",
    company: "Sunrex Property Management",
    period: "Current",
    desc: "Digital ad campaigns, social content, lease renewal systems, and resident communications across residential portfolio.",
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
    period: "Past",
    desc: "Automotive sales and client relations, driving revenue through consultative selling and customer service excellence.",
  },
  {
    role: "Real Estate Investor",
    company: "Bridgewater Centre — Rental Condo",
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
      style={{ background: "#F5F0E8", padding: "8rem 0", borderBottom: "1px solid #DDD5C8" }}
    >
      <div className="container">
        {/* Section header */}
        <div className="fade-up" style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "5rem" }}>
          <span className="label-text">01 — About</span>
          <div style={{ flex: 1, height: "1px", background: "#DDD5C8" }} />
        </div>

        {/* Two-column layout */}
        <div
          className="about-grid"
          style={{ display: "grid", gridTemplateColumns: "1fr", gap: "5rem" }}
        >
          {/* Left: Bio */}
          <div>
            <div className="fade-up" style={{ marginBottom: "2.5rem" }}>
              <h2
                style={{
                  fontFamily: "'Libre Baskerville', serif",
                  fontWeight: 700,
                  fontSize: "clamp(2rem, 4vw, 3.25rem)",
                  lineHeight: 1.15,
                  letterSpacing: "-0.025em",
                  color: "#1C1A17",
                  margin: 0,
                }}
              >
                Designer who<br />
                <em style={{ fontStyle: "italic", fontWeight: 400, color: "#8B6F47" }}>performs.</em>
              </h2>
            </div>

            <div className="fade-up">
              <p style={{
                fontFamily: "'Instrument Sans', sans-serif",
                fontSize: "0.975rem",
                fontWeight: 300,
                lineHeight: 1.85,
                color: "#6B6055",
                marginBottom: "1.25rem",
              }}>
                I'm Shaun Vincent — a UI/UX designer and marketing creative currently working at{" "}
                <strong style={{ color: "#1C1A17", fontWeight: 500 }}>Sunrex Property Management</strong>{" "}
                as Leasing &amp; Marketing Manager. I handle everything from digital ad campaigns and social content to lease renewal systems and resident communications across our residential portfolio.
              </p>
              <p style={{
                fontFamily: "'Instrument Sans', sans-serif",
                fontSize: "0.975rem",
                fontWeight: 300,
                lineHeight: 1.85,
                color: "#6B6055",
              }}>
                My background combines design, economics (University of Manitoba, B.Sc.), and hands-on marketing execution — which means I design things that don't just look good, they{" "}
                <em style={{ fontStyle: "italic" }}>perform</em>.
              </p>
            </div>

            {/* Tags */}
            <div className="fade-up" style={{ marginTop: "2.5rem", display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {["Strategy-first", "Figma-native", "Fast turnaround", "Works globally"].map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: "0.68rem",
                    letterSpacing: "0.08em",
                    color: "#8B6F47",
                    border: "1px solid #DDD5C8",
                    padding: "0.3rem 0.75rem",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Experience */}
          <div>
            <div className="fade-up" style={{ marginBottom: "2rem" }}>
              <span className="label-text">Experience</span>
            </div>

            {experience.map((exp, i) => (
              <div
                key={i}
                className="fade-up"
                style={{
                  padding: "1.75rem 0",
                  borderTop: "1px solid #DDD5C8",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", marginBottom: "0.5rem" }}>
                  <div>
                    <h3 style={{
                      fontFamily: "'Instrument Sans', sans-serif",
                      fontSize: "0.95rem",
                      fontWeight: 500,
                      color: "#1C1A17",
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
                          fontFamily: "'IBM Plex Mono', monospace",
                          fontSize: "0.72rem",
                          color: "#8B6F47",
                          textDecoration: "none",
                          letterSpacing: "0.04em",
                          borderBottom: "1px solid rgba(139,111,71,0.3)",
                          transition: "border-color 0.2s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#8B6F47")}
                        onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(139,111,71,0.3)")}
                      >
                        {exp.company} ↗
                      </a>
                    ) : (
                      <span style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: "0.72rem",
                        color: "#8B6F47",
                        letterSpacing: "0.04em",
                      }}>
                        {exp.company}
                      </span>
                    )}
                  </div>
                  <span style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: "0.65rem",
                    color: "#A89880",
                    letterSpacing: "0.08em",
                    whiteSpace: "nowrap",
                    marginTop: "0.15rem",
                  }}>
                    {exp.period}
                  </span>
                </div>
                <p style={{
                  fontFamily: "'Instrument Sans', sans-serif",
                  fontSize: "0.875rem",
                  fontWeight: 300,
                  color: "#6B6055",
                  lineHeight: 1.7,
                  margin: 0,
                }}>
                  {exp.desc}
                </p>
              </div>
            ))}

            {/* Education */}
            <div className="fade-up" style={{ marginTop: "2.5rem" }}>
              <span className="label-text" style={{ display: "block", marginBottom: "1rem" }}>Education</span>
              <div style={{ borderTop: "1px solid #DDD5C8", paddingTop: "1.5rem" }}>
                <p style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "0.95rem", fontWeight: 500, color: "#1C1A17", margin: "0 0 0.2rem" }}>University of Manitoba</p>
                <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.72rem", color: "#8B6F47", margin: 0, letterSpacing: "0.04em" }}>B.A. Economics · Minor in Computer Science</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
