/* ==========================================================================
   HOME — Warm Beige Minimalism
   Assembles all sections in order.
   ========================================================================== */

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import WorkSection from "@/components/WorkSection";
import CredibilitySection from "@/components/CredibilitySection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div style={{ background: "#F5F0E8" }}>
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <WorkSection />
      <CredibilitySection />
      <ContactSection />
      <Footer />
    </div>
  );
}
