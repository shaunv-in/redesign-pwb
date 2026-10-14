// Injects the prerendered Home markup (built by `vite build --ssr` into
// dist-ssr/entry-server.js) into dist/index.html, inlines the app's own
// compiled stylesheet so first paint doesn't wait on a render-blocking CSS
// request, then removes the SSR-only build output so it never ships to
// the client.
import { readFile, writeFile, rm } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const ssrEntry = path.join(root, "dist-ssr", "entry-server.js");
const indexHtml = path.join(root, "dist", "index.html");
const distDir = path.join(root, "dist");

const { render } = await import(ssrEntry);
const appHtml = render();

let html = await readFile(indexHtml, "utf8");
if (!html.includes('<div id="root"></div>')) {
  throw new Error('prerender.mjs: expected `<div id="root"></div>` in dist/index.html — check the build output shape before editing this script.');
}
// The email_off markers tell Cloudflare's Email Address Obfuscation to leave
// this markup alone. Without them it rewrites every address into an encoded
// span plus a decoder script, so the HTML React hydrates no longer matches
// what it rendered (React error #418, logged on every page load).
html = html.replace('<div id="root"></div>', `<!--email_off--><div id="root">${appHtml}</div><!--/email_off-->`);

// Inline the built CSS (small — a single ~20KB stylesheet shared by every
// route) so the browser never blocks first paint on fetching it separately.
const cssLinkMatch = html.match(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/);
if (!cssLinkMatch) {
  throw new Error('prerender.mjs: expected a built <link rel="stylesheet" href="/assets/*.css"> tag in dist/index.html — check the build output shape before editing this script.');
}
const cssPath = path.join(distDir, cssLinkMatch[1]);
const css = await readFile(cssPath, "utf8");
html = html.replace(cssLinkMatch[0], `<style>${css}</style>`);

// Start the app bundle after first paint on "/". The home page is fully
// prerendered, so nothing needs JS to appear; fetching ~75 KB of React at
// high priority alongside the HTML only delayed first paint on throttled
// mobile. Other routes (rental application, admin, 404) render client-side,
// so they still load the bundle immediately.
const moduleTag = html.match(/<script type="module" crossorigin src="(\/assets\/[^"]+\.js)"><\/script>/);
if (!moduleTag) {
  throw new Error('prerender.mjs: expected a built <script type="module" src="/assets/*.js"> tag in dist/index.html — check the build output shape before editing this script.');
}
html = html.replace(moduleTag[0], "");
const loader = `<script>(function(){var s=document.createElement("script");s.type="module";s.crossOrigin="";s.src=${JSON.stringify(moduleTag[1])};function go(){document.head.appendChild(s)}if(location.pathname==="/"){requestAnimationFrame(function(){requestAnimationFrame(go)})}else{go()}})()</script>`;
html = html.replace("</body>", `${loader}\n</body>`);

await writeFile(indexHtml, html);

await rm(path.join(root, "dist-ssr"), { recursive: true, force: true });

console.log(`Prerendered ${(appHtml.length / 1024).toFixed(1)} KB of markup and inlined ${(css.length / 1024).toFixed(1)} KB of CSS into dist/index.html`);
