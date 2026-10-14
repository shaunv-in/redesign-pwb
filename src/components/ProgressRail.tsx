/* ==========================================================================
   PROGRESS RAIL — thin top scroll-progress bar (pure CSS scroll-driven
   animation, see .pf-progress-bar) + a fixed right-edge dot nav (wide
   desktop only) that tracks which section is in view and jumps on click.
   ========================================================================== */

import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "hero", label: "Top" },
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "credibility", label: "Numbers" },
  { id: "contact", label: "Contact" },
];

export default function ProgressRail() {
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const elements = SECTIONS.map((s) => document.getElementById(s.id)).filter((el): el is HTMLElement => !!el);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const jumpTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <div className="pf-progress-bar" aria-hidden="true" />
      <nav className="pf-rail" aria-label="Section navigation">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`pf-rail-item${active === s.id ? " is-active" : ""}`}
            onClick={() => jumpTo(s.id)}
            aria-current={active === s.id ? "true" : undefined}
            aria-label={`Jump to ${s.label}`}
          >
            <span className="pf-rail-label">{s.label}</span>
            <span className="pf-rail-dot" />
          </button>
        ))}
      </nav>
    </>
  );
}
