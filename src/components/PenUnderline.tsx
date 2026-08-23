/* ==========================================================================
   PEN UNDERLINE — a single hand-drawn stroke under a word/phrase.
   Draws itself in once the element scrolls into view.
   ========================================================================== */

import { useEffect, useRef } from "react";

export default function PenUnderline({
  children,
  color,
}: {
  children: React.ReactNode;
  color?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add("pf-drawn");
            observer.disconnect();
          }
        });
      },
      { threshold: 0.6 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <span className="pf-pen-underline" ref={ref}>
      {children}
      <svg viewBox="0 0 300 20" preserveAspectRatio="none" aria-hidden="true">
        <path
          pathLength={1}
          d="M2,13 C 60,18 110,7 150,11 C 190,15 230,6 298,10"
          style={color ? { stroke: color } : undefined}
        />
      </svg>
    </span>
  );
}
