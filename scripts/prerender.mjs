// Injects the prerendered Home markup (built by `vite build --ssr` into
// dist-ssr/entry-server.js) into dist/index.html, then removes the
// SSR-only build output so it never ships to the client.
import { readFile, writeFile, rm } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const ssrEntry = path.join(root, "dist-ssr", "entry-server.js");
const indexHtml = path.join(root, "dist", "index.html");

const { render } = await import(ssrEntry);
const appHtml = render();

let html = await readFile(indexHtml, "utf8");
if (!html.includes('<div id="root"></div>')) {
  throw new Error('prerender.mjs: expected `<div id="root"></div>` in dist/index.html — check the build output shape before editing this script.');
}
html = html.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
await writeFile(indexHtml, html);

await rm(path.join(root, "dist-ssr"), { recursive: true, force: true });

console.log(`Prerendered ${(appHtml.length / 1024).toFixed(1)} KB of markup into dist/index.html`);
