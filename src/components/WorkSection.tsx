/* ==========================================================================
   WORK — Tucked (Shaun's own product) leads, then real Dribbble shot
   thumbnails as rounded tiles with captions. Load More reveals 6 at a time.
   ========================================================================== */

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import TuckedFeature from "@/components/TuckedFeature";
import { useReveal } from "@/hooks/useReveal";
import { useMounted } from "@/hooks/useMounted";

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
  const ref = useReveal<HTMLElement>(0.04, 60);
  const mounted = useMounted();
  const [visible, setVisible] = useState(BATCH);
  const [latestStart, setLatestStart] = useState<number | null>(null);

  const handleLoadMore = () => {
    setLatestStart(visible);
    setVisible((v) => Math.min(v + BATCH, dribbbleShots.length));
  };

  const shown = dribbbleShots.slice(0, visible);
  const remaining = dribbbleShots.length - visible;

  return (
    <section id="work" ref={ref} className="pf-section" style={{ borderBottom: "1px solid var(--pf-line)" }}>
      <div className="container">
        <div className="pf-section-head fade-up">
          <h2 className="pf-h2">Selected work.</h2>
        </div>

        <TuckedFeature />

        <div className="pf-work-sub fade-up">
          <h3 className="pf-h3">From the Dribbble archive</h3>
          <span className="pf-meta pf-num">
            {shown.length} of {dribbbleShots.length} shots
          </span>
        </div>

        <div className="pf-work-grid">
          {shown.map((shot, i) => {
            // First batch reveals with the section; later batches animate in as they're added.
            const cls = latestStart !== null && i >= latestStart ? "shot-new" : i < BATCH ? "fade-up" : "";
            return (
              <a key={shot.url} href={shot.url} target="_blank" rel="noopener noreferrer" className={`pf-shot ${cls}`}>
                <div className="pf-shot-media">
                  {/* src is attached after mount; see useMounted. */}
                  <img src={mounted ? shot.img : undefined} alt="" width={400} height={300} loading="lazy" decoding="async" />
                  <noscript>
                    <img src={shot.img} alt="" width={400} height={300} loading="lazy" />
                  </noscript>
                </div>
                <div className="pf-shot-caption">
                  <span>{shot.title}</span>
                  <ArrowUpRight size={16} strokeWidth={1.75} aria-hidden="true" />
                </div>
              </a>
            );
          })}
        </div>

        <div className="pf-work-foot">
          {remaining > 0 ? (
            <button type="button" onClick={handleLoadMore} className="pf-btn">
              Load More ({remaining} remaining)
            </button>
          ) : (
            <span className="pf-meta">That's the full archive.</span>
          )}
          <div className="pf-work-foot-links">
            <a href="https://dribbble.com/shaunvnzt" target="_blank" rel="noopener noreferrer" className="pf-btn-ghost">
              Dribbble <ArrowUpRight size={16} strokeWidth={1.75} aria-hidden="true" />
            </a>
            <a href="https://www.behance.net/shaunvnzt" target="_blank" rel="noopener noreferrer" className="pf-btn-ghost">
              Behance <ArrowUpRight size={16} strokeWidth={1.75} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
