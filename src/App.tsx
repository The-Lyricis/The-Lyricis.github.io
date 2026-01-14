import React, { useState } from 'react';
import { ParticleField } from './components/ParticleField';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { ManifestoSection } from './components/ManifestoSection';
import { AboutSection } from './components/AboutSection';
import { Services } from './components/Services';
import { TechStack } from './components/TechStack';
import { ExperienceTimeline } from './components/ExperienceTimeline';
import { ProjectGallery } from './components/ProjectGallery';
import { ContactSection } from './components/ContactSection';
import { InteractiveFooter } from './components/InteractiveFooter';
import { BackToTop } from './components/BackToTop';
import { RippleDistortion } from './components/shaders/RippleDistortion';
import { Toaster } from 'sonner@2.0.3';

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [themeIndex, setThemeIndex] = useState(0);

  // Manage theme cycling here for Particles only
  React.useEffect(() => {
    // Initial random theme
    setThemeIndex(Math.floor(Math.random() * 5));

    const interval = setInterval(() => {
      setThemeIndex(prev => {
        let next;
        do {
          next = Math.floor(Math.random() * 5);
        } while (next === prev);
        return next;
      });
    }, 20000); // 20s cycle for stars

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full min-h-screen overflow-hidden" style={{ background: 'linear-gradient(to bottom, #020C1B 0%, #0A192F 100%)' }}>
      {/* Particle Background */}
      <ParticleField themeIndex={themeIndex} />
      
      {/* Ripple Click Effect */}
      {/* <RippleDistortion /> */}
      
      {/* Navigation */}
      <Navigation />
      
      {/* Toast Notifications */}
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#0A192F',
            border: '2px solid #64FFDA',
            color: '#E6F1FF',
          },
        }}
      />
      
      {/* Main Content */}
      <div className="relative z-10">
        <section id="home">
          <Hero onExplore={() => setActiveSection('about')} />
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