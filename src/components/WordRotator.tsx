/* ==========================================================================
   WORD ROTATOR — cycles through a list of words in place, each underlined
   via PenUnderline.

   The visible word (and its underline) is absolutely positioned over an
   invisible spacer reserved at the widest word's width. That split matters:
   the spacer — sized once, in normal document flow — is what the parent
   heading wraps around, so the heading's line breaks never change as words
   rotate. The visible box is free to width-transition to hug each word's
   actual length (so the underline tracks real length, not the widest word)
   without that resize ever touching the page's layout, which would count
   as a layout shift. An earlier version sized the flow itself to the
   current word; under real load a rotation could land mid-transition at a
   width that changed the heading's wrap and produced this page's entire
   CLS score — this structure makes that impossible by construction.

   PenUnderline wraps .pf-rotator (not the other way around) so its SVG,
   which intentionally overflows slightly below the text baseline, isn't
   clipped by .pf-rotator's own overflow:hidden (needed for the width
   transition itself).

   Respects prefers-reduced-motion (locks to the first word, no timer).
   ========================================================================== */

import { useEffect, useRef, useState } from "react";
import PenUnderline from "@/components/PenUnderline";

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
  // idle -> out (old word lifts + blurs away) -> in (new word placed below,
  // no transition) -> idle (new word settles up into place).
  const [phase, setPhase] = useState<"idle" | "out" | "in">("idle");
  const [widths, setWidths] = useState<number[] | null>(null);
  const measureRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const widestWord = words.reduce((a, b) => (b.length > a.length ? b : a), words[0] ?? "");

  useEffect(() => {
    const measure = () => setWidths(measureRefs.current.map((el) => el?.getBoundingClientRect().width ?? 0));
    measure();
    // Fonts load non-blocking (see index.html), so the first measurement can
    // be taken in the fallback face, which is wider than Fraunces and left
    // the underline overshooting the word. `fonts.ready` alone isn't enough:
    // the stylesheet swaps in after mount, so ready can resolve before the
    // face is even requested. Re-measure whenever a font load finishes.
    const fonts = document.fonts;
    if (!fonts) return;
    let cancelled = false;
    fonts.ready.then(() => !cancelled && measure());
    fonts.addEventListener("loadingdone", measure);
    return () => {
      cancelled = true;
      fonts.removeEventListener("loadingdone", measure);
    };
    // words is expected to be a stable list for the component's lifetime
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timers: number[] = [];
    const id = setInterval(() => {
      setPhase("out");
      timers.push(
        window.setTimeout(() => {
          setIndex((i) => (i + 1) % words.length);
          setPhase("in");
          // Two frames so the "in" start position paints before settling.
          requestAnimationFrame(() => requestAnimationFrame(() => setPhase("idle")));
        }, 260)
      );
    }, interval);
    return () => {
      clearInterval(id);
      timers.forEach(clearTimeout);
    };
  }, [words, interval]);

  const width = widths?.[index];

  return (
    <span style={{ position: "relative", display: "inline-block", verticalAlign: "bottom" }}>
      {/* Reserves layout space at the widest word — always present, never resized. */}
      <span aria-hidden="true" style={{ visibility: "hidden" }} className={className}>
        {widestWord}
      </span>

      {/* Offscreen: measures every word's width once on mount. */}
      <span aria-hidden="true" style={{ position: "absolute", top: 0, left: 0, width: 0, height: 0, overflow: "hidden" }}>
        <span style={{ position: "absolute", whiteSpace: "nowrap" }}>
          {words.map((word, i) => (
            <span key={word} ref={(el) => { measureRefs.current[i] = el; }} className={className}>
              {word}
            </span>
          ))}
        </span>
      </span>

      {/* Visible + animated: absolutely positioned, so its own width-transition
          never affects the reserved layout space above. */}
      <span aria-hidden="true" style={{ position: "absolute", top: 0, left: 0 }}>
        <PenUnderline>
          <span
            className="pf-rotator"
            style={width != null ? { width } : undefined}
          >
            <span className={`pf-rotator-word ${className ?? ""}${phase !== "idle" ? ` is-${phase}` : ""}`}>
              {words[index]}
            </span>
          </span>
        </PenUnderline>
      </span>

      <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)" }}>
        {words.join(" / ")}
      </span>
    </span>
  );
}
