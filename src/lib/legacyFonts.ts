/* ==========================================================================
   LEGACY FONTS — Libre Baskerville, Instrument Sans, IBM Plex Mono are only
   used by the rental application and admin pages (hardcoded inline styles).
   Previously loaded unconditionally on every page, including the home page
   which never uses them. Call this from those pages' mount effect instead.
   ========================================================================== */

let injected = false;

export function loadLegacyFonts() {
  if (injected) return;
  injected = true;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Instrument+Sans:ital,wght@0,300;0,400;0,500;1,300&family=IBM+Plex+Mono:wght@400;500&display=swap";
  document.head.appendChild(link);
}
