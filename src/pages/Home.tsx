/* ==========================================================================
   HOME — assembles all sections in order. Work (led by Tucked) sits right
   after the hero so the strongest proof is the first thing a visitor meets.
   ========================================================================== */

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import WorkSection from "@/components/WorkSection";
import CredibilitySection from "@/components/CredibilitySection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ProgressRail from "@/components/ProgressRail";

export default function Home() {
  return (
    <div className="pf" style={{ position: "relative" }}>
      {/* Navbar watches this to know when the page has left the top. */}
      <div id="pf-top-sentinel" aria-hidden="true" style={{ position: "absolute", top: 0, left: 0, width: 1, height: 40 }} />
      <a href="#main" className="pf-skip-link">
        Skip to content
      </a>
      <ProgressRail />
      <Navbar />
      <main id="main">
        <HeroSection />
        <WorkSection />
        <AboutSection />
        <ServicesSection />
        <CredibilitySection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
