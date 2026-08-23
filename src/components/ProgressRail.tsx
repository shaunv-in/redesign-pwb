/* ==========================================================================
   PROGRESS RAIL — thin top scroll-progress bar + a fixed right-edge dot nav
   (desktop only) that tracks which section is in view and jumps on click.
   ========================================================================== */

import { useEffect, useRef, useState } from "react";

const SECTIONS = [
  { id: "hero", label: "Top" },
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "work", label: "Work" },
  { id: "credibility", label: "Credibility" },
  { id: "contact", label: "Contact" },
];

export default function ProgressRail() {
  const [active, setActive] = useState("hero");
  const [progress, setProgress] = useState(0);
  const ticking = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const doc = document.documentElement;
        const max = doc.scrollHeight - doc.clientHeight;
        setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
        ticking.current = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const elements = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => !!el
    );
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
      <div className="pf-progress-bar" style={{ width: `${progress * 100}%` }} aria-hidden="true" />
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
