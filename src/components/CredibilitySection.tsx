/* ==========================================================================
   CREDIBILITY — stat band + pull quote. No icons, no cards.
   Stats count up once when the band scrolls into view; the quote inks in
   word by word, driven by scroll position (CSS view timeline, see
   .pf-quote-word). Both are static under reduced motion or without support.
   ========================================================================== */

import { useEffect, useRef } from "react";
import { useReveal } from "@/hooks/useReveal";

const stats = [
  { value: "5+", label: "Years across design, marketing, and sales" },
  { value: "18+", label: "Dribbble shots published" },
  { value: "1", label: "Product in market: Tucked, live on the web" },
  { value: "B.A.", label: "Economics, University of Manitoba" },
];

const QUOTE = "Every pixel has a purpose. Design that doesn’t just look good. It performs.";

/** Counts the numeric part of `value` up from 0 the first time it's in view.
    The prerendered/initial text is the final value, so nothing is lost
    without JS or with reduced motion. */
function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const match = value.match(/^(\d+)(.*)$/);
    if (!el || !match || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const target = Number(match[1]);
    const suffix = match[2];
    if (target < 2) return; // nothing to count
    let raf = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const duration = 1100;
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 4);
          el.textContent = `${Math.round(target * eased)}${suffix}`;
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        el.textContent = `0${suffix}`;
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  return (
    <div ref={ref} className="pf-stat-value">
      {value}
    </div>
  );
}

export default function CredibilitySection() {
  const ref = useReveal<HTMLElement>(0.1);
  const words = QUOTE.split(" ");

  return (
    <section
      id="credibility"
      ref={ref}
      className="pf-section"
      aria-label="By the numbers"
      style={{ borderBottom: "1px solid var(--pf-line)" }}
    >
      <div className="container">
        <div className="pf-cred-grid">
          {stats.map((stat) => (
            <div key={stat.label} className="fade-up">
              <CountUp value={stat.value} />
              <div className="pf-stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        <blockquote className="pf-quote">
          <p>
            <span className="pf-sr-only">{QUOTE}</span>
            {words.map((word, i) => (
              <span key={i} aria-hidden="true" className="pf-quote-word" style={{ "--i": i } as React.CSSProperties}>
                {word}
                {i < words.length - 1 ? " " : ""}
              </span>
            ))}
          </p>
        </blockquote>
      </div>
    </section>
  );
}
