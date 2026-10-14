/* ==========================================================================
   USE MOUNTED — false during prerender and the hydration render, true right
   after. Used to hold back below-the-fold image `src`s: on phones the Work
   images sit inside the browser's lazy-load distance, so with a src in the
   prerendered HTML they started downloading alongside the document and
   pushed back the first paint in mobile Lighthouse. The app bundle itself
   loads after first paint (scripts/prerender.mjs), so anything gated on this
   starts after the page is already visible.
   ========================================================================== */

import { useEffect, useState } from "react";

export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
