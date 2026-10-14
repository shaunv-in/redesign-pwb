/* ==========================================================================
   SERVICES — hairline 2x2 grid of tiles (distinct from Work's media tiles).
   ========================================================================== */

import { Code, Megaphone, Palette, PenTool } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";

const services = [
  {
    icon: PenTool,
    title: "UI/UX & Product Design",
    desc: "Wireframes, user flows, high-fidelity mockups, and interactive prototypes. Figma-native. Built for hand-off.",
    tags: ["Figma", "Wireframing", "Prototyping", "User Flows"],
  },
  {
    icon: Palette,
    title: "Branding & Visual Design",
    desc: "Logos, identity systems, and brand guidelines that make your business recognizable and memorable.",
    tags: ["Logo Design", "Brand Identity", "Style Guides", "Visual Systems"],
  },
  {
    icon: Megaphone,
    title: "Marketing & Ad Creative",
    desc: "Social media content, Meta/Facebook lead gen ads, signage, and digital campaigns, designed to convert.",
    tags: ["Meta Ads", "Social Content", "Digital Campaigns", "Signage"],
  },
  {
    icon: Code,
    title: "Web Development & Automation",
    desc: "Front-end builds for the designs above, plus the integrations and automated workflows that keep forms, data, and tools talking to each other without manual busywork.",
    tags: ["Front-End Dev", "Workflow Automation", "API Integrations", "No-Code Tools"],
  },
];

export default function ServicesSection() {
  const ref = useReveal<HTMLElement>();

  return (
    <section
      id="services"
      ref={ref}
      className="pf-section"
      style={{ background: "var(--pf-paper-alt)", borderBottom: "1px solid var(--pf-line)" }}
    >
      <div className="container">
        <div className="pf-section-head fade-up">
          <h2 className="pf-h2">A few ways I can help.</h2>
        </div>

        <div className="pf-services-grid fade-up">
          {services.map(({ icon: Icon, title, desc, tags }) => (
            <div key={title} className="pf-service">
              <span className="pf-service-icon" aria-hidden="true">
                <Icon size={20} strokeWidth={1.75} />
              </span>
              <h3>{title}</h3>
              <p>{desc}</p>
              <div className="pf-tags">
                {tags.map((tag) => (
                  <span key={tag} className="pf-chip">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
