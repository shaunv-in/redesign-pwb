/* ==========================================================================
   FOOTER — brand + tagline, site nav, and connect links in three columns,
   with a bottom bar for copyright and a back-to-top affordance.
   ========================================================================== */

import { ArrowRight, ArrowUp, ArrowUpRight } from "lucide-react";
import { navLinks } from "@/components/Navbar";

const connectLinks = [
  { label: "Tucked", href: "https://tucked.ca" },
  { label: "Dribbble", href: "https://dribbble.com/shaunvnzt" },
  { label: "Behance", href: "https://www.behance.net/shaunvnzt" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/shaunvnzt/" },
  { label: "Side Lane Studio", href: "https://www.sidelanestudio.com/" },
];

function FooterLink({ label, href }: { label: string; href: string }) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="pf-footer-link"
    >
      {label}
      {external && <ArrowUpRight size={14} strokeWidth={1.75} aria-hidden="true" />}
    </a>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  const backToTop = () => {
    document.getElementById("hero")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <footer className="pf-footer">
      <div className="container">
        <div className="pf-footer-grid">
          <div>
            <a href="#hero" className="pf-wordmark" style={{ color: "#F4F4F1", textDecoration: "none" }}>
              Shaun Vincent
            </a>
            <p className="pf-footer-blurb">
              UI/UX & visual designer based in Winnipeg, founder of Tucked, and open to select freelance work.
            </p>
            <a href="mailto:shaun@shaunvincent.net" className="pf-footer-hello">
              shaun@shaunvincent.net <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
            </a>
          </div>

          <div>
            <span className="pf-footer-label">Navigate</span>
            <div className="pf-footer-links">
              {navLinks.map((link) => (
                <FooterLink key={link.label} {...link} />
              ))}
            </div>
          </div>

          <div>
            <span className="pf-footer-label">Connect</span>
            <div className="pf-footer-links">
              {connectLinks.map((link) => (
                <FooterLink key={link.label} {...link} />
              ))}
            </div>
          </div>
        </div>

        <div className="pf-footer-bar">
          <span>© {year} Shaun Vincent</span>
          <button type="button" onClick={backToTop} className="pf-footer-top">
            Back to top <ArrowUp size={14} strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
}
