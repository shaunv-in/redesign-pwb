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
  const [fading, setFading] = useState(false);
  const [widths, setWidths] = useState<number[] | null>(null);
  const measureRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const widestWord = words.reduce((a, b) => (b.length > a.length ? b : a), words[0] ?? "");

  useEffect(() => {
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
            <span className={`pf-rotator-word ${className ?? ""}`} style={{ opacity: fading ? 0 : 1 }}>
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
