/* ==========================================================================
   SERVICES — Warm Beige Minimalism
   Three-column grid. Numbered cards, no icons.
   ========================================================================== */

import { useEffect, useRef } from "react";

const services = [
  {
    num: "01",
    title: "UI/UX & Product Design",
    desc: "Wireframes, user flows, high-fidelity mockups, and interactive prototypes. Figma-native. Built for hand-off.",
    tags: ["Figma", "Wireframing", "Prototyping", "User Flows"],
  },
  {
    num: "02",
    title: "Branding & Visual Design",
    desc: "Logos, identity systems, and brand guidelines that make your business recognizable and memorable.",
    tags: ["Logo Design", "Brand Identity", "Style Guides", "Visual Systems"],
  },
  {
    num: "03",
    title: "Marketing & Ad Creative",
    desc: "Social media content, Meta/Facebook lead gen ads, signage, and digital campaigns — designed to convert.",
    tags: ["Meta Ads", "Social Content", "Digital Campaigns", "Signage"],
  },
];

export default function ServicesSection() {
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
      id="services"
      ref={ref}
      style={{ background: "#EDE8DF", padding: "8rem 0", borderBottom: "1px solid #DDD5C8" }}
    >
      <div className="container">
        {/* Header */}
        <div className="fade-up" style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "5rem" }}>
          <span className="label-text">02 — Services</span>
          <div style={{ flex: 1, height: "1px", background: "#DDD5C8" }} />
        </div>

        <div className="fade-up" style={{ marginBottom: "4rem" }}>
          <h2 style={{
            fontFamily: "'Libre Baskerville', serif",
            fontWeight: 700,
            fontSize: "clamp(2rem, 4vw, 3.25rem)",
            lineHeight: 1.1,
            letterSpacing: "-0.025em",
            color: "#1C1A17",
            margin: 0,
          }}>
            Services built<br />
            <em style={{ fontStyle: "italic", fontWeight: 400, color: "#8B6F47" }}>to perform.</em>
          </h2>
        </div>

        {/* Grid */}
        <div
          className="services-grid"
          style={{ display: "grid", gridTemplateColumns: "1fr", gap: "0" }}
        >
          {services.map((s, i) => (
            <div
              key={i}
              className="fade-up"
              style={{
                padding: "3rem 0",
                borderTop: "1px solid #DDD5C8",
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                gap: "3rem",
                alignItems: "start",
              }}
            >
              <span style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "0.7rem",
                color: "#A89880",
                letterSpacing: "0.1em",
                paddingTop: "0.2rem",
              }}>
                {s.num}
              </span>
              <div>
                <h3 style={{
                  fontFamily: "'Libre Baskerville', serif",
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: "#1C1A17",
                  margin: "0 0 1rem",
                  letterSpacing: "-0.01em",
                }}>
                  {s.title}
                </h3>
                <p style={{
                  fontFamily: "'Instrument Sans', sans-serif",
                  fontSize: "0.9rem",
                  fontWeight: 300,
                  color: "#6B6055",
                  lineHeight: 1.75,
                  margin: "0 0 1.5rem",
                  maxWidth: "520px",
                }}>
                  {s.desc}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {s.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: "0.65rem",
                        letterSpacing: "0.08em",
                        color: "#8B6F47",
                        border: "1px solid rgba(139,111,71,0.25)",
                        padding: "0.25rem 0.65rem",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="fade-up" style={{ marginTop: "4rem", paddingTop: "3rem", borderTop: "1px solid #DDD5C8" }}>
          <a href="#contact" className="btn-primary">Start a Project →</a>
        </div>
      </div>
    </section>
  );
}
