/* ==========================================================================
   WORD ROTATOR — cycles through a list of words in place. The wrapping box
   width-transitions to hug each word's actual rendered width (rather than
   staying pinned to the widest word), so a pen-underline wrapped around it
   tracks the visible word's real length.

   All word widths are measured once, up front, from an offscreen container
   instead of re-measuring the live DOM on every rotation — the latter forces
   a synchronous layout reflow each time (flagged by Lighthouse's "forced
   reflow" insight) for no benefit, since the word list never changes.

   Respects prefers-reduced-motion (locks to the first word, no timer).
   ========================================================================== */

import { useEffect, useLayoutEffect, useRef, useState } from "react";

export default function WordRotator({
  words,
  interval = 2200,
  className,
}: {
  words: string[];
  interval?: number;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const [widths, setWidths] = useState<number[] | null>(null);
  const measureRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useLayoutEffect(() => {
    setWidths(measureRefs.current.map((el) => el?.getBoundingClientRect().width ?? 0));
    // words is expected to be a stable list for the component's lifetime
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setIndex((i) => (i + 1) % words.length);
        setFading(false);
      }, 200);
    }, interval);
    return () => clearInterval(id);
  }, [words, interval]);

  const width = widths?.[index];

  return (
    <>
      {/* Offscreen: measured once on mount, never shown */}
      <span aria-hidden="true" style={{ position: "absolute", visibility: "hidden", pointerEvents: "none", whiteSpace: "nowrap", top: 0, left: 0 }}>
        {words.map((word, i) => (
          <span key={word} ref={(el) => { measureRefs.current[i] = el; }} className={className}>
            {word}
          </span>
        ))}
      </span>

      <span
        className="pf-rotator"
        style={width != null ? { width } : undefined}
        aria-hidden="true"
      >
        <span className={`pf-rotator-word ${className ?? ""}`} style={{ opacity: fading ? 0 : 1 }}>
          {words[index]}
        </span>
      </span>
      <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)" }}>
        {words.join(" / ")}
      </span>
    </>
  );
}
