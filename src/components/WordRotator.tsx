/* ==========================================================================
   WORD ROTATOR — cycles through a list of words in place. The wrapping box
   width-transitions to hug each word's actual rendered width (rather than
   staying pinned to the widest word), so a pen-underline wrapped around it
   tracks the visible word's real length.
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
  const [width, setWidth] = useState<number | null>(null);
  const wordRef = useRef<HTMLSpanElement>(null);

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

  useLayoutEffect(() => {
    if (wordRef.current) setWidth(wordRef.current.getBoundingClientRect().width);
  }, [index]);

  return (
    <>
      <span
        className="pf-rotator"
        style={width != null ? { width } : undefined}
        aria-hidden="true"
      >
        <span ref={wordRef} className={`pf-rotator-word ${className ?? ""}`} style={{ opacity: fading ? 0 : 1 }}>
          {words[index]}
        </span>
      </span>
      <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)" }}>
        {words.join(" / ")}
      </span>
    </>
  );
}
