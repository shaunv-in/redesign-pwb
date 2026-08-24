/* ==========================================================================
   SSR ENTRY — renders Home to a static HTML string at build time so the
   browser's initial paint doesn't wait on JS to download/parse/execute
   before anything appears. Only used by scripts/prerender.mjs; never
   shipped to the client. Home's render tree touches no browser-only APIs
   outside useEffect, so this is safe to run in Node.
   ========================================================================== */

import { renderToString } from "react-dom/server";
import Home from "./pages/Home";

export function render() {
  return renderToString(<Home />);
}
