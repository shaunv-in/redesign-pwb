/* ==========================================================================
   CREDIBILITY — stat band + pull quote. No icons, no cards.
   ========================================================================== */

import { useReveal } from "@/hooks/useReveal";

const stats = [
  { value: "5+", label: "Years across design, marketing, and sales" },
  { value: "18+", label: "Dribbble shots published" },
  { value: "1", label: "Product in market: Tucked, live on the web" },
  { value: "B.A.", label: "Economics, University of Manitoba" },
];

export default function CredibilitySection() {
  const ref = useReveal<HTMLElement>(0.1);

  return (
    <section
      id="credibility"
      ref={ref}
      className="pf-section"
      aria-label="By the numbers"
      style={{ borderBottom: "1px solid var(--pf-line)" }}
    >
      <div className="container">
        <div className="pf-cred-grid">
          {stats.map((stat) => (
            <div key={stat.label} className="fade-up">
              <div className="pf-stat-value">{stat.value}</div>
              <div className="pf-stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        <blockquote className="pf-quote fade-up">
          <p>Every pixel has a purpose. Design that doesn’t just look good. It performs.</p>
        </blockquote>
      </div>
    </section>
  );
}
