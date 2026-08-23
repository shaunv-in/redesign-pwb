/* ==========================================================================
   HOME — assembles all sections in order.
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
    <div className="pf">
      <a href="#main" className="pf-skip-link">Skip to content</a>
      <ProgressRail />
      <Navbar />
      <main id="main">
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <WorkSection />
        <CredibilitySection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
