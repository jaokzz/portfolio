"use client";

import dynamic from "next/dynamic";

// Carregam em chunks separados após o hero — Three.js e animações pesadas não bloqueiam o FCP
const SolutionsSection = dynamic(() => import("@/components/solutions-section"));
const ProjectsSection  = dynamic(() => import("@/components/projects-section"));
const SkillsSection    = dynamic(() => import("@/components/skills-section"));
const AboutSection     = dynamic(() => import("@/components/about-section"));
const ContactSection   = dynamic(() => import("@/components/contact-section"));
const Footer           = dynamic(() => import("@/components/footer"));

export default function LazySections() {
  return (
    <>
      <SolutionsSection />
      <ProjectsSection />
      <SkillsSection />
      <AboutSection />
      <ContactSection />
      <Footer />
    </>
  );
}
