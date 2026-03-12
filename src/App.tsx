import React, { useState } from "react";
import { Toaster } from "sonner";
import { AboutSection } from "./components/AboutSection";
import { BackToTop } from "./components/BackToTop";
import { ContactSection } from "./components/ContactSection";
import { ExperienceTimeline } from "./components/ExperienceTimeline";
import { Hero } from "./components/Hero";
import { InteractiveFooter } from "./components/InteractiveFooter";
import { ManifestoSection } from "./components/ManifestoSection";
import { Navigation } from "./components/Navigation";
import { ParticleField } from "./components/ParticleField";
import { ProjectGallery } from "./components/ProjectGallery";
import { Services } from "./components/Services";
import { TechStack } from "./components/TechStack";

export default function App() {
  const [themeIndex, setThemeIndex] = useState(0);

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

  return (
    <div
      className="relative w-full min-h-screen overflow-hidden"
      style={{
        background: "linear-gradient(to bottom, #020C1B 0%, #0A192F 100%)",
      }}
    >
      <ParticleField themeIndex={themeIndex} />
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
        <section id="home">
          <Hero />
        </section>
        <section id="about">
          <AboutSection />
        </section>
        <ManifestoSection />
        <section id="services">
          <Services />
        </section>
        <TechStack />
        <ExperienceTimeline />
        <section id="featured-projects">
          <ProjectGallery />
        </section>
        <section id="contact">
          <ContactSection />
        </section>
        <InteractiveFooter />
        <BackToTop />
      </div>
    </div>
  );
}
