/* ==========================================================================
   ABOUT — two-column: bio + experience timeline. No headshot.
   ========================================================================== */

import { ArrowUpRight } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";

type Experience = {
  role: string;
  company: string;
  companyUrl?: string;
  period: string;
  desc: string;
  highlight?: boolean;
};

const experience: Experience[] = [
  {
    role: "Founder",
    company: "Tucked",
    companyUrl: "https://tucked.ca",
    period: "Current",
    desc: "A free, private budget app made in Canada. The web app is live now, with a native iPhone app coming soon.",
    highlight: true,
  },
  {
    role: "Marketing Manager",
    company: "Paragon Living",
    companyUrl: "https://www.paragonliving.com/",
    period: "July 2026 - Current",
    desc: "Digital campaigns, content strategy, market research, and resident engagement across a portfolio of multifamily residential communities.",
  },
  {
    role: "Leasing & Marketing Manager",
    company: "Sunrex Management Ltd.",
    companyUrl: "https://www.sunrex.ca/",
    period: "June 2024 - June 2026",
    desc: "Digital ad campaigns, social content, lease renewal systems, property showings, and resident communications across a residential portfolio.",
  },
  {
    role: "Co-Owner",
    company: "Side Lane Studio",
    companyUrl: "https://www.sidelanestudio.com/",
    period: "Ongoing",
    desc: "Full-service creative studio offering UI/UX design, branding, and digital marketing for businesses across Canada and globally.",
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
  {
    role: "Freelance UI/UX Designer",
    company: "Self-employed",
    period: "Until May 2019",
    desc: "Product design, branding, and web projects for clients across Canada and globally.",
  },
];

export default function AboutSection() {
  const ref = useReveal<HTMLElement>();

  return (
    <section id="about" ref={ref} className="pf-section" style={{ borderBottom: "1px solid var(--pf-line)" }}>
      <div className="container">
        <div className="pf-about-grid">
          {/* Left: Bio */}
          <div>
            <h2 className="pf-h2 fade-up" style={{ marginBottom: "2.25rem" }}>
              A designer who reads the spreadsheet, too.
            </h2>

            <div className="pf-about-copy fade-up">
              <p>
                I'm Shaun Vincent, a UI/UX designer and marketing creative, currently Marketing Manager at{" "}
                <a href="https://www.paragonliving.com/" target="_blank" rel="noopener noreferrer" className="pf-link">
                  Paragon Living
                </a>
                . I handle everything from digital ad campaigns and content strategy to market research and resident
                engagement across a portfolio of multifamily residential communities.
              </p>
              <p>
                I'm also the founder of{" "}
                <a href="https://tucked.ca" target="_blank" rel="noopener noreferrer" className="pf-link">
                  Tucked
                </a>
                , a calm, private budget app. The web app is live, and the iPhone app is on the way.
              </p>
              <p>
                My background combines design, economics (
                <a href="https://umanitoba.ca/" target="_blank" rel="noopener noreferrer" className="pf-link">
                  University of Manitoba
                </a>
                , B.A.), and hands-on marketing execution. That means I design things that don't just look good, they{" "}
                <em>perform</em>.
              </p>
            </div>

            <div className="pf-tags fade-up">
              {["Strategy-first", "Figma-native", "Ships real products", "Works globally"].map((tag) => (
                <span key={tag} className="pf-chip">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Experience */}
          <div>
            <span className="pf-subhead fade-up">Experience</span>
            <ul className="pf-xp">
              {experience.map((exp) => (
                <li key={exp.role + exp.company} className={`fade-up${exp.highlight ? " is-highlight" : ""}`}>
                  <h3>{exp.role}</h3>
                  <span className="pf-xp-period">{exp.period}</span>
                  {exp.companyUrl ? (
                    <a href={exp.companyUrl} target="_blank" rel="noopener noreferrer" className="pf-xp-company">
                      {exp.company}
                      <ArrowUpRight size={14} strokeWidth={1.75} aria-hidden="true" />
                    </a>
                  ) : (
                    <span className="pf-xp-company">{exp.company}</span>
                  )}
                  <p>{exp.desc}</p>
                </li>
              ))}
            </ul>

            <div className="pf-edu fade-up">
              <span className="pf-subhead">Education</span>
              <a href="https://umanitoba.ca/" target="_blank" rel="noopener noreferrer" className="pf-link">
                University of Manitoba
              </a>
              <p>B.A. Economics, Minor in Computer Science</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
