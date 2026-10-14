/* ==========================================================================
   TUCKED FEATURE — lead project in Work. Shaun's own product, shown in its
   own dark world with real app screens (public/work/tucked, from tucked.ca).
   Status lines reflect tucked.ca: the web app is live now; the native
   iPhone app is coming soon.
   ========================================================================== */

import { ArrowUpRight, Globe, Smartphone } from "lucide-react";

const screens = [
  { src: "/work/tucked/bills.webp", alt: "Tucked bills screen with upcoming bills and paydays" },
  { src: "/work/tucked/home.webp", alt: "Tucked home screen showing money left this month" },
  { src: "/work/tucked/rewards.webp", alt: "Tucked rewards screen with budgeting streaks and badges" },
];

export default function TuckedFeature() {
  return (
    <article className="pf-feature fade-up" aria-labelledby="tucked-title">
      <div className="pf-feature-copy">
        <div className="pf-feature-brand">
          <img src="/work/tucked/tucked-logo-on-dark.svg" alt="Tucked" width={91} height={30} />
        </div>

        <h3 id="tucked-title" className="pf-feature-title">
          The calm, private <em>budget app.</em>
        </h3>

        <p className="pf-feature-body">
          See what's left this month, which bills and paydays are coming, and how your savings are tracking. Free, no
          ads, made in Canada.
        </p>

        <ul className="pf-feature-status">
          <li>
            <Globe size={18} strokeWidth={1.75} aria-hidden="true" />
            Web app, on any phone or computer
            <span className="pf-status-pill is-live">Live now</span>
          </li>
          <li className="is-soon">
            <Smartphone size={18} strokeWidth={1.75} aria-hidden="true" />
            Native iPhone app
            <span className="pf-status-pill is-soon">Coming soon</span>
          </li>
        </ul>

        <div className="pf-feature-ctas">
          <a href="https://tucked.ca" target="_blank" rel="noopener noreferrer" className="pf-btn">
            Visit tucked.ca <ArrowUpRight size={16} strokeWidth={2} aria-hidden="true" />
          </a>
          <a href="https://tucked.ca/signup" target="_blank" rel="noopener noreferrer" className="pf-btn-ghost">
            Try It Free
          </a>
        </div>
      </div>

      <div className="pf-feature-stage">
        {screens.map((s, i) => (
          <div key={s.src} className={`pf-phone pf-phone-${i}`}>
            <img src={s.src} alt={s.alt} width={780} height={1562} loading="lazy" decoding="async" />
          </div>
        ))}
      </div>
    </article>
  );
}
