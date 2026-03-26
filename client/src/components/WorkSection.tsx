/* ==========================================================================
   WORK — Warm Beige Minimalism
   Real Dribbble shot thumbnails. Load More reveals 6 at a time.
   ========================================================================== */

import { useState, useEffect, useRef } from "react";

const BATCH = 6;

const dribbbleShots = [
  {
    title: "Scheduling App",
    url: "https://dribbble.com/shots/17444291-Scheduling-App",
    img: "https://cdn.dribbble.com/userupload/35373727/file/original-471dd354dca9f7a092bbd5ed6452ae64.png?format=webp&resize=400x300&vertical=center",
  },
  {
    title: "Triant - Redesign",
    url: "https://dribbble.com/shots/14856176-Triant-Redesign",
    img: "https://cdn.dribbble.com/userupload/30110837/file/original-66d306d4372c73c4b7a177aba02eb557.png?format=webp&resize=400x300&vertical=center",
  },
  {
    title: "eCommerce Website",
    url: "https://dribbble.com/shots/10895073-eCommerce-Website",
    img: "https://cdn.dribbble.com/userupload/26646878/file/original-3ee6378210644282fac82a591e961fcf.png?format=webp&resize=400x300&vertical=center",
  },
  {
    title: "Dashboard Design",
    url: "https://dribbble.com/shots/9711575-Dashboard-design",
    img: "https://cdn.dribbble.com/userupload/25895547/file/original-3df3bddf2b0ca129321331336fb89195.png?format=webp&resize=400x300&vertical=center",
  },
  {
    title: "Personal Website 2019",
    url: "https://dribbble.com/shots/6781507-Personal-Website-2019",
    img: "https://cdn.dribbble.com/userupload/42441828/file/original-c453ab7ab54397ae1bb454bc0103f6bd.png?format=webp&resize=400x300&vertical=center",
  },
  {
    title: "Dashboard",
    url: "https://dribbble.com/shots/6241344-Dashboard",
    img: "https://cdn.dribbble.com/userupload/42119963/file/original-7317a1848e191b4eb6d7d5f2c8fe44c1.png?format=webp&resize=400x300&vertical=center",
  },
  {
    title: "myWallet - App",
    url: "https://dribbble.com/shots/6116744-myWallet-App",
    img: "https://cdn.dribbble.com/userupload/24378634/file/original-d67182a03713a0316739240a35247055.png?format=webp&resize=400x300&vertical=center",
  },
  {
    title: "Waved - App",
    url: "https://dribbble.com/shots/6113585-Waved-App",
    img: "https://cdn.dribbble.com/userupload/24375606/file/original-fe151e93677509d950fbb93d6531ea34.png?format=webp&resize=400x300&vertical=center",
  },
  {
    title: "Project Management",
    url: "https://dribbble.com/shots/4990234-Project-Management",
    img: "https://cdn.dribbble.com/userupload/23410881/file/original-b40254d873f143ecae98b8eed2a43303.png?format=webp&resize=400x300&vertical=center",
  },
  {
    title: "Personal Website 2",
    url: "https://dribbble.com/shots/4726476-Personal-Website-2-Dribbble",
    img: "https://cdn.dribbble.com/userupload/23143045/file/original-995a53b9200494d49bea4ec10dca64fc.png?format=webp&resize=400x300&vertical=center",
  },
  {
    title: "Letter A",
    url: "https://dribbble.com/shots/4560707-Letter-A",
    img: "https://cdn.dribbble.com/userupload/22967690/file/original-850c21c5134261bb45f4367207d17703.png?format=webp&resize=400x300&vertical=center",
  },
  {
    title: "Website - Agency",
    url: "https://dribbble.com/shots/4558701-Website-Agency",
    img: "https://cdn.dribbble.com/userupload/22965128/file/original-b5c8bc67a3323e9d269a18987560ccfa.png?format=webp&resize=400x300&vertical=center",
  },
  {
    title: "Cafe Illustration",
    url: "https://dribbble.com/shots/4542250-Cafe-Illustration",
    img: "https://cdn.dribbble.com/userupload/22947847/file/original-22d2f799ede952439566983b29232533.png?format=webp&resize=400x300&vertical=center",
  },
  {
    title: "Website - Homepage",
    url: "https://dribbble.com/shots/4538756-Website-Homepage",
    img: "https://cdn.dribbble.com/userupload/22944230/file/original-e638b60258e522b9da332d93929a3b9d.png?format=webp&resize=400x300&vertical=center",
  },
  {
    title: "Cafe Illustration 2",
    url: "https://dribbble.com/shots/4511033-Cafe-Illustration",
    img: "https://cdn.dribbble.com/userupload/22914536/file/original-30e039121c22b460e36d28022313470b.png?format=webp&resize=400x300&vertical=center",
  },
  {
    title: "Portfolio",
    url: "https://dribbble.com/shots/4042113-Portfolio",
    img: "https://cdn.dribbble.com/userupload/22418111/file/original-5857493a2970841f26380aecd31f7507.png?format=webp&resize=400x300&vertical=center",
  },
  {
    title: "Sign in / Sign up",
    url: "https://dribbble.com/shots/4040421-Sign-in-Sign-up",
    img: "https://cdn.dribbble.com/userupload/22416387/file/original-3ec73d72c8af40df35cb68fa6361d6ff.png?format=webp&resize=400x300&vertical=center",
  },
  {
    title: "Agency - Homepage",
    url: "https://dribbble.com/shots/4040386-Agency-Homepage",
    img: "https://cdn.dribbble.com/userupload/22416360/file/original-5da86d7f9b91b630040aa4d95e9546df.png?format=webp&resize=400x300&vertical=center",
  },
];

export default function WorkSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(BATCH);
  const [newlyAdded, setNewlyAdded] = useState<number[]>([]);

  // Intersection observer for section entrance
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".fade-up").forEach((el, i) => {
              setTimeout(() => (el as HTMLElement).classList.add("visible"), i * 60);
            });
          }
        });
      },
      { threshold: 0.05 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const handleLoadMore = () => {
    const nextStart = visible;
    const nextEnd = Math.min(visible + BATCH, dribbbleShots.length);
    setNewlyAdded(Array.from({ length: nextEnd - nextStart }, (_, i) => nextStart + i));
    setVisible(nextEnd);
  };

  const shown = dribbbleShots.slice(0, visible);
  const hasMore = visible < dribbbleShots.length;

  return (
    <section
      id="work"
      ref={ref}
      style={{ background: "#F5F0E8", padding: "8rem 0", borderBottom: "1px solid #DDD5C8" }}
    >
      <div className="container">
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1.5rem",
            marginBottom: "5rem",
          }}
        >
          <div>
            <div
              className="fade-up"
              style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "2.5rem" }}
            >
              <span className="label-text">03 — Selected Work</span>
              <div style={{ flex: 1, height: "1px", background: "#DDD5C8", minWidth: "60px" }} />
            </div>
            <div className="fade-up">
              <h2
                style={{
                  fontFamily: "'Libre Baskerville', serif",
                  fontWeight: 700,
                  fontSize: "clamp(2rem, 4vw, 3.25rem)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.025em",
                  color: "#1C1A17",
                  margin: 0,
                }}
              >
                18 shots.
                <br />
                <em style={{ fontStyle: "italic", fontWeight: 400, color: "#8B6F47" }}>
                  Every pixel purposeful.
                </em>
              </h2>
            </div>
          </div>
          <div className="fade-up">
            <a
              href="https://dribbble.com/shaunvnzt"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              View All on Dribbble ↗
            </a>
          </div>
        </div>

        {/* Grid */}
        <div
          className="portfolio-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1px",
            background: "#DDD5C8",
          }}
        >
          {shown.map((shot, i) => {
            const isNew = newlyAdded.includes(i);
            return (
              <a
                key={shot.url}
                href={shot.url}
                target="_blank"
                rel="noopener noreferrer"
                className={isNew ? "shot-new" : "fade-up"}
                style={{
                  display: "block",
                  position: "relative",
                  overflow: "hidden",
                  background: "#EDE8DF",
                  textDecoration: "none",
                  aspectRatio: "4/3",
                }}
                onMouseEnter={(e) => {
                  const overlay = e.currentTarget.querySelector(".work-overlay") as HTMLElement;
                  const img = e.currentTarget.querySelector("img") as HTMLElement;
                  if (overlay) overlay.style.opacity = "1";
                  if (img) img.style.transform = "scale(1.04)";
                }}
                onMouseLeave={(e) => {
                  const overlay = e.currentTarget.querySelector(".work-overlay") as HTMLElement;
                  const img = e.currentTarget.querySelector("img") as HTMLElement;
                  if (overlay) overlay.style.opacity = "0";
                  if (img) img.style.transform = "scale(1)";
                }}
              >
                <img
                  src={shot.img}
                  alt={shot.title}
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)",
                  }}
                />
                <div
                  className="work-overlay"
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(245, 240, 232, 0.93)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    opacity: 0,
                    transition: "opacity 0.3s ease",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Libre Baskerville', serif",
                      fontSize: "1rem",
                      fontWeight: 700,
                      color: "#1C1A17",
                      letterSpacing: "-0.01em",
                      textAlign: "center",
                      padding: "0 1rem",
                    }}
                  >
                    {shot.title}
                  </span>
                  <span
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: "0.65rem",
                      letterSpacing: "0.12em",
                      color: "#8B6F47",
                      textTransform: "uppercase",
                    }}
                  >
                    View on Dribbble ↗
                  </span>
                </div>
              </a>
            );
          })}
        </div>

        {/* Load More / Counter */}
        <div
          style={{
            marginTop: "3rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1.5rem",
            paddingTop: "2rem",
            borderTop: "1px solid #DDD5C8",
          }}
        >
          <span
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "0.7rem",
              letterSpacing: "0.1em",
              color: "#A89880",
            }}
          >
            Showing {shown.length} of {dribbbleShots.length} shots
          </span>

          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            {hasMore && (
              <button
                onClick={handleLoadMore}
                className="btn-primary"
                style={{ border: "none", cursor: "pointer" }}
              >
                Load More ({dribbbleShots.length - visible} remaining)
              </button>
            )}
            <a
              href="https://dribbble.com/shaunvnzt"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              Dribbble ↗
            </a>
            <a
              href="https://www.behance.net/shaunvnzt"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              Behance ↗
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shotReveal {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .shot-new {
          animation: shotReveal 0.45s cubic-bezier(0.16,1,0.3,1) both;
        }
        @media (max-width: 768px) {
          .portfolio-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 480px) {
          .portfolio-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
