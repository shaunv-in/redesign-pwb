/* ==========================================================================
   USE REVEAL — staggers `.fade-up` children into view the first time their
   section scrolls into the viewport. Shared by every home-page section
   (each previously carried its own copy of this observer).
   ========================================================================== */

import { useEffect, useRef } from "react";

export function useReveal<T extends HTMLElement = HTMLElement>(threshold = 0.08, stagger = 90) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const timers: number[] = [];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.querySelectorAll(".fade-up:not(.visible)").forEach((child, i) => {
            timers.push(window.setTimeout(() => child.classList.add("visible"), i * stagger));
          });
          observer.unobserve(entry.target);
        });
      },
      { threshold }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      timers.forEach(clearTimeout);
    };
  }, [threshold, stagger]);

  return ref;
}
