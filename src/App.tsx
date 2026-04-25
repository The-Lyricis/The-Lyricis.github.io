import React, { useState } from "react";
import { Toaster } from "sonner";
import { BackToTop } from "./components/BackToTop";
import { ContactSection } from "./components/ContactSection";
import { Hero } from "./components/Hero";
import { HorizontalAboutSection } from "./components/HorizontalAboutSection";
import { HorizontalSkillsServicesSection } from "./components/HorizontalSkillsServicesSection";
import { InteractiveFooter } from "./components/InteractiveFooter";
import { Navigation } from "./components/Navigation";
import { ParticleField } from "./components/ParticleField";
import { ProjectGallery } from "./components/ProjectGallery";
import { ProjectDetailPage } from "./pages/ProjectDetailPage";
import {
  getProjectSlugFromPath,
  isProjectDetailPath,
  subscribeNavigation,
} from "./lib/routing";

export default function App() {
  const [themeIndex, setThemeIndex] = useState(0);
  const [pathname, setPathname] = useState(() => window.location.pathname);
  const [isHomeVisible, setIsHomeVisible] = useState(false);
  const homeSectionRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    setThemeIndex(Math.floor(Math.random() * 5));

    const interval = setInterval(() => {
      setThemeIndex((prev) => {
        let next = prev;
        while (next === prev) {
          next = Math.floor(Math.random() * 5);
        }
        return next;
      });
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    return subscribeNavigation(() => {
      setPathname(window.location.pathname);
    });
  }, []);

  const projectSlug = isProjectDetailPath(pathname)
    ? getProjectSlugFromPath(pathname)
    : null;

  React.useEffect(() => {
    const section = homeSectionRef.current;
    if (!section || projectSlug) {
      setIsHomeVisible(false);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHomeVisible(entry.isIntersecting);
      },
      { threshold: 0.15 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [projectSlug]);

  return (
    <div
      className="relative w-full min-h-screen overflow-hidden"
      style={{
        background: "linear-gradient(to bottom, #020C1B 0%, #0A192F 100%)",
      }}
    >
      <ParticleField themeIndex={themeIndex} active={!isHomeVisible} />
      <Navigation />

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#0A192F",
            border: "2px solid #64FFDA",
            color: "#E6F1FF",
          },
        }}
      />

      <div className="relative z-10">
        {projectSlug ? (
          <>
            <ProjectDetailPage slug={projectSlug} />
            <InteractiveFooter />
          </>
        ) : (
          <>
            <section id="home" data-particle-occluder ref={homeSectionRef}>
              <Hero />
            </section>
            <HorizontalAboutSection />
            <section id="featured-projects">
              <ProjectGallery />
            </section>
            <HorizontalSkillsServicesSection />
            <section id="contact" data-particle-occluder>
              <ContactSection />
            </section>
            <InteractiveFooter />
            <BackToTop />
          </>
        )}
      </div>
    </div>
  );
}
