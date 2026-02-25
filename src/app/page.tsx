import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import ResearchSection from "@/components/sections/ResearchSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import CreativeSection from "@/components/sections/CreativeSection";
import AwardsSection from "@/components/sections/AwardsSection";
import FooterSection from "@/components/sections/FooterSection";
import NavBar from "@/components/NavBar";

export default function Home() {
  return (
    <main>
      <NavBar />
      <HeroSection />
      <AboutSection />
      <ResearchSection />
      <ProjectsSection />
      <CreativeSection />
      <AwardsSection />
      <FooterSection />
    </main>
  );
}
