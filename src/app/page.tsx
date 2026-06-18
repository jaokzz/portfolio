import Navbar from "@/components/navbar";
import AetherFlowHero from "@/components/ui/aether-flow-hero";
import SolutionsSection from "@/components/solutions-section";
import ProjectsSection from "@/components/projects-section";
import SkillsSection from "@/components/skills-section";
import AboutSection from "@/components/about-section";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <AetherFlowHero />
      <SolutionsSection />
      <ProjectsSection />
      <SkillsSection />
      <AboutSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
