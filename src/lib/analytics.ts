/* ==========================================================================
   ANALYTICS — loads the Umami script only when both env vars are actually
   configured. The previous approach hardcoded the script tag in index.html
   using Vite's %ENV_VAR% HTML replacement; when the vars weren't set at
   build time, it shipped a literal "%VITE_ANALYTICS_ENDPOINT%/umami" URL
   that 404s and logs a console error on every page load.
   ========================================================================== */

export function loadAnalytics() {
  const endpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT;
  const websiteId = import.meta.env.VITE_ANALYTICS_WEBSITE_ID;
  if (!endpoint || !websiteId) return;

  const script = document.createElement("script");
  script.defer = true;
  script.src = `${endpoint}/umami`;
  script.dataset.websiteId = websiteId;
  document.body.appendChild(script);
}
