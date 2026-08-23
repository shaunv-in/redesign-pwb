/* ==========================================================================
   EYEBROW — small rotated marginalia label, replaces the "01 — Section"
   numbered mono-eyebrow pattern used throughout the previous design.
   ========================================================================== */

export default function Eyebrow({ children }: { children: React.ReactNode }) {
  return <span className="pf-eyebrow">{children}</span>;
}
