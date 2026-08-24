import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import { loadAnalytics } from "./lib/analytics";
import "./index.css";

const root = document.getElementById("root")!;

// The "/" route ships prerendered markup (see scripts/prerender.mjs) so the
// browser paints content before JS runs; hydrate onto it instead of
// discarding and re-rendering. Every other route (and local `vite dev`,
// which serves the raw unprerendered index.html) gets a plain client render.
if (root.hasChildNodes() && window.location.pathname === "/") {
  hydrateRoot(root, <App />);
} else {
  createRoot(root).render(<App />);
}

loadAnalytics();
