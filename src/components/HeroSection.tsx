/* ==========================================================================
   HERO — full-height, text-led. A live Winnipeg clock stands in for the
   generic "available for work" pill, and the headline uses a rotating word
   + a hand-drawn underline. One orchestrated entrance on load (CSS only,
   content visible by default).
   ========================================================================== */

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
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

const socials = [
  { label: "Dribbble", href: "https://dribbble.com/shaunvnzt" },
  { label: "Behance", href: "https://www.behance.net/shaunvnzt" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/shaunvnzt/" },
];

export default function HeroSection() {
  const time = useWinnipegClock();

  return (
    <section id="hero" className="pf-hero">
      <div className="container pf-hero-in">
        <div className="pf-hero-status pf-mono">
          {/* Fixed-width slot (the clock uses a monospace stack, so `ch` is exact) reserves
              space for the longest realistic time string up front, so the clock populating
              after mount never shifts the layout below it. */}
          <span>
            <span style={{ display: "inline-block", minWidth: "10ch" }}>{time}</span> in Winnipeg
          </span>
        </div>

        <h1 className="pf-hero-title">
          Design that{" "}
          <WordRotator words={["converts.", "performs.", "connects.", "sells."]} className="pf-serif" interval={2200} />
        </h1>

        <div className="pf-hero-row">
          <p className="pf-hero-sub">
            UI/UX & visual designer and growing entrepreneur. 5+ years across product design, branding, marketing,
            and sales.
          </p>
          <div className="pf-hero-ctas">
            <a href="#contact" className="pf-btn">
              Work With Me
            </a>
            <a href="#work" className="pf-btn-ghost">
              View Work
            </a>
          </div>
        </div>

        <div className="pf-hero-meta">
          <div className="pf-social">
            {socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">
                {s.label}
                <ArrowUpRight size={14} strokeWidth={1.75} aria-hidden="true" />
              </a>
            ))}
          </div>
          <span className="pf-hero-place">Winnipeg, Canada</span>
        </div>
      </div>
    </section>
  );
}
