/* ==========================================================================
   SERVICES — editorial list. Ordinal words instead of mono "01/02/03".
   ========================================================================== */

import { useEffect, useRef } from "react";
import Eyebrow from "@/components/Eyebrow";

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
    desc: "Social media content, Meta/Facebook lead gen ads, signage, and digital campaigns, designed to convert.",
    tags: ["Meta Ads", "Social Content", "Digital Campaigns", "Signage"],
  },
  {
    num: "04",
    title: "Web Development & Automation",
    desc: "Front-end builds for the designs above, plus the integrations and automated workflows that keep forms, data, and tools talking to each other without manual busywork.",
    tags: ["Front-End Dev", "Workflow Automation", "API Integrations", "No-Code Tools"],
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
      style={{ background: "var(--pf-paper-alt)", padding: "8rem 0", borderBottom: "1px solid var(--pf-line)" }}
    >
      <div className="container">
        {/* Header */}
        <div className="fade-up" style={{ marginBottom: "3rem" }}>
          <Eyebrow>services</Eyebrow>
        </div>

        <div className="fade-up" style={{ marginBottom: "4rem" }}>
          <h2 className="pf-serif" style={{
            fontWeight: 500,
            fontSize: "clamp(2rem, 4vw, 3.25rem)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: "var(--pf-ink)",
            margin: 0,
          }}>
            A few ways I can help.
          </h2>
        </div>

        {/* List */}
        <div className="pf-services-grid">
          {services.map((s, i) => (
            <div
              key={i}
              className="fade-up pf-lift"
              style={{
                padding: "3rem 0",
                borderTop: "1px solid var(--pf-line)",
              }}
            >
              <div>
                <h3 className="pf-serif" style={{
                  fontSize: "1.35rem",
                  fontWeight: 500,
                  color: "var(--pf-ink)",
                  margin: "0 0 1rem",
                  letterSpacing: "-0.01em",
                }}>
                  <span className="pf-mono" style={{ fontSize: "0.75rem", color: "var(--pf-pen)", letterSpacing: "0.04em", marginRight: "0.75rem", verticalAlign: "middle" }}>
                    {s.num}
                  </span>
                  {s.title}
                </h3>
                <p style={{
                  fontSize: "0.92rem",
                  fontWeight: 400,
                  color: "var(--pf-ink-soft)",
                  lineHeight: 1.75,
                  margin: "0 0 1.5rem",
                  maxWidth: "520px",
                }}>
                  {s.desc}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {s.tags.map((tag) => (
                    <span key={tag} className="pf-chip">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="fade-up" style={{ marginTop: "4rem", paddingTop: "3rem", borderTop: "1px solid var(--pf-line)" }}>
          <a href="#contact" className="pf-btn">Start a Project →</a>
        </div>
      </div>
    </section>
  );
}
