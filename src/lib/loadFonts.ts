/* ==========================================================================
   LOAD FONTS — attaches the self-hosted @font-face stylesheet once the page
   has painted. Declaring the faces in the inlined critical CSS instead made
   the browser fetch ~100 KB of fonts at top priority alongside the HTML,
   which measurably pushed back first paint on throttled mobile. Text renders
   in the fallback stack first and swaps in (font-display: swap).
   ========================================================================== */

let attached = false;

export function loadFonts() {
  if (attached || typeof document === "undefined") return;
  attached = true;
  const attach = () => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/fonts/fonts.css";
    document.head.appendChild(link);
  };
  // Two frames: guarantees at least one paint has happened first.
  requestAnimationFrame(() => requestAnimationFrame(attach));
}
