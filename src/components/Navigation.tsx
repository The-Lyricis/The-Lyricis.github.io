import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Globe, ChevronDown } from "lucide-react";
import { useLocale } from "../i18n";
import {
  buildHomeSectionPath,
  isProjectDetailPath,
  navigateTo,
} from "../lib/routing";

interface NavItem {
  id: string;
  label: string;
  href: string;
}

export function Navigation() {
  const { locale, messages, setLocale } = useLocale();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isMouseTop, setIsMouseTop] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const languages = useMemo(
    () => [
      { value: "en" as const, label: "English", shortLabel: "EN" },
      { value: "zh" as const, label: "中文", shortLabel: "中文" },
    ],
    [],
  );

  const currentLanguage =
    languages.find((language) => language.value === locale) ?? languages[0];
  const resumeFileName = locale === "zh" ? "resume-zh.pdf" : "resume-en.pdf";
  const resumeHref = `${import.meta.env.BASE_URL}${resumeFileName}`;
  const servicesNavLabel = messages.navigation.servicesandskills;

  const navItems: NavItem[] = [
    { id: "home", label: messages.navigation.home, href: "#home" },
    { id: "about", label: messages.navigation.about, href: "#be-an-artist" },
    {
      id: "services",
      label: servicesNavLabel,
      href: "#skills-services",
    },
    { id: "projects", label: messages.navigation.projects, href: "#featured-projects" },
    { id: "contact", label: messages.navigation.contact, href: "#contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const handleMouseMove = (e: MouseEvent) => {
      setIsMouseTop(e.clientY < 100);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    if (!isLangMenuOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest("[data-language-toggle]")) {
        setIsLangMenuOpen(false);
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    return () => window.removeEventListener("mousedown", handlePointerDown);
  }, [isLangMenuOpen]);

  const isNavVisible =
    !isScrolled || isMouseTop || isMobileMenuOpen || isLangMenuOpen;

  useEffect(() => {
    if (!isNavVisible && isLangMenuOpen) {
      setIsLangMenuOpen(false);
    }
  }, [isLangMenuOpen, isNavVisible]);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    setIsMobileMenuOpen(false);

    const sectionMap: Record<string, string> = {
      home: "home",
      about: "be-an-artist",
      services: "skills-services",
      projects: "featured-projects",
      contact: "contact",
    };

    const horizontalSlideMap: Record<string, string | undefined> = {
      about: "manifesto",
      services: "services",
    };

    const targetId = sectionMap[id] || id;
    const targetSlide = horizontalSlideMap[id];

    const navigateHorizontalSection = () => {
      document
        .getElementById(targetId)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });

      if (targetSlide) {
        const eventName =
          id === "services"
            ? "horizontal-skills:navigate"
            : "horizontal-about:navigate";
        window.dispatchEvent(
          new CustomEvent(eventName, {
            detail: { slideKey: targetSlide },
          }),
        );
      }
    };

    if (isProjectDetailPath(window.location.pathname)) {
      navigateTo(buildHomeSectionPath(targetId));
      requestAnimationFrame(() => {
        navigateHorizontalSection();
      });
      return;
    }

    const targetElement = document.getElementById(targetId);

    if (!targetElement) return;

    navigateHorizontalSection();
  };

  const handleResumeClick = () => {
    setIsMobileMenuOpen(false);
  };

  const renderLanguageToggle = () => (
    <div className="relative w-40" data-language-toggle>
      <motion.button
        type="button"
        onClick={() => setIsLangMenuOpen((prev) => !prev)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex w-full items-center justify-between gap-2 rounded-full border backdrop-blur-md px-4 py-2 transition-all duration-300"
        style={{
          borderColor: isLangMenuOpen
            ? "rgba(100, 255, 218, 0.5)"
            : "rgba(100, 255, 218, 0.25)",
          backgroundColor: isLangMenuOpen
            ? "rgba(10, 25, 47, 0.9)"
            : "rgba(10, 25, 47, 0.7)",
        }}
      >
        <Globe
          className="w-4 h-4"
          style={{ color: "#64FFDA", opacity: 0.8 }}
        />
        <span
          className="text-xs font-medium tracking-wider"
          style={{ color: "#E6F1FF" }}
        >
          {currentLanguage.shortLabel}
        </span>
        <ChevronDown
          className="w-3.5 h-3.5 transition-colors duration-300"
          style={{
            color: isLangMenuOpen ? "#E6F1FF" : "#64FFDA",
            opacity: isLangMenuOpen ? 0.9 : 0.6,
          }}
        />
      </motion.button>

      <AnimatePresence>
        {isLangMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute top-full mt-2 right-0 w-full rounded-lg border backdrop-blur-xl overflow-hidden shadow-2xl z-50"
            style={{
              borderColor: "rgba(100, 255, 218, 0.3)",
              backgroundColor: "rgba(10, 25, 47, 0.98)",
            }}
          >
            {languages.map((language, index) => {
              const isActive = locale === language.value;

              return (
                <button
                  key={language.value}
                  type="button"
                  onClick={() => {
                    setLocale(language.value);
                    setIsLangMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 text-left flex items-center justify-between gap-3 transition-colors duration-200 hover:bg-[rgba(100,255,218,0.05)]"
                  style={{
                    backgroundColor: isActive
                      ? "rgba(100, 255, 218, 0.1)"
                      : "transparent",
                    color: isActive ? "#64FFDA" : "#8892B0",
                    borderBottom:
                      index < languages.length - 1
                        ? "1px solid rgba(100, 255, 218, 0.1)"
                        : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "#E6F1FF";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "#8892B0";
                    }
                  }}
                >
                  <span className="text-sm font-medium tracking-wide">
                    {language.label}
                  </span>
                  {isActive && (
                    <div
                      className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                      style={{ backgroundColor: "#64FFDA" }}
                    />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <>
      <motion.nav
        initial={{ y: 0 }}
        animate={{ y: isNavVisible ? 0 : -100 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed top-0 left-0 right-0 z-50 px-8 py-4 transition-all duration-300"
        onMouseEnter={() => setIsMouseTop(true)}
        style={{
          backgroundColor: isScrolled
            ? "rgba(15, 39, 68, 0.85)"
            : "rgba(8, 20, 38, 0.5)",
          backdropFilter: isScrolled ? "blur(12px)" : "blur(8px)",
          borderBottom: isScrolled
            ? "1px solid rgba(100, 255, 218, 0.15)"
            : "1px solid rgba(100, 255, 218, 0.08)",
          boxShadow: isScrolled ? "0 4px 20px rgba(0, 0, 0, 0.3)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex shrink-0 items-center gap-4">
            <motion.a
              href={buildHomeSectionPath("home")}
              whileHover={{ scale: 1.05 }}
              onClick={(e) => {
                e.preventDefault();
                if (isProjectDetailPath(window.location.pathname)) {
                  navigateTo(buildHomeSectionPath("home"));
                  requestAnimationFrame(() => {
                    document
                      .getElementById("home")
                      ?.scrollIntoView({ behavior: "smooth", block: "start" });
                  });
                  return;
                }
                scrollToSection("home");
              }}
              className="text-xl tracking-wider font-bold"
              style={{
                color: "#64FFDA",
                textShadow: "0 0 10px rgba(100, 255, 218, 0.3)",
              }}
            >
              {"<JY />"}
            </motion.a>

            <motion.a
              href={resumeHref}
              download={resumeFileName}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleResumeClick}
              className="inline-flex items-center justify-center px-4 py-2 border-2 rounded text-sm font-medium tracking-wider transition-all duration-300"
              style={{
                borderColor: "#64FFDA",
                color: "#64FFDA",
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  "rgba(100, 255, 218, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              {messages.navigation.resume}
            </motion.a>
          </div>

          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item, index) => (
              <motion.a
                key={item.id}
                href={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(item.id);
                }}
                className="relative inline-block text-center text-sm tracking-wider transition-colors duration-300"
                style={{
                  color: activeSection === item.id ? "#64FFDA" : "#8892B0",
                  minWidth: "56px",
                }}
                onMouseEnter={(e) => {
                  if (activeSection !== item.id) {
                    e.currentTarget.style.color = "#E6F1FF";
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeSection !== item.id) {
                    e.currentTarget.style.color = "#8892B0";
                  }
                }}
              >
                {item.label}
                {isNavVisible && activeSection === item.id && (
                  <div
                    className="absolute -bottom-1 left-0 right-0 h-0.5"
                    style={{ backgroundColor: "#64FFDA" }}
                  />
                )}
              </motion.a>
            ))}

            {renderLanguageToggle()}
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="md:hidden w-10 h-10 flex items-center justify-center"
            style={{ color: "#64FFDA" }}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </motion.button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 bottom-0 w-72 md:hidden z-40 backdrop-blur-xl border-l shadow-2xl"
            style={{
              backgroundColor: "rgba(10, 25, 47, 0.98)",
              borderColor: "rgba(100, 255, 218, 0.2)",
            }}
          >
            <div className="flex flex-col h-full pt-24 px-8 pb-8">
              <nav className="flex-1 space-y-6">
                {navItems.map((item, index) => (
                  <motion.a
                    key={item.id}
                    href={item.href}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: index * 0.08,
                      type: "spring",
                      stiffness: 300,
                      damping: 24,
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(item.id);
                    }}
                    className="block text-lg tracking-wider transition-colors duration-300"
                    style={{
                      color: activeSection === item.id ? "#64FFDA" : "#8892B0",
                    }}
                  >
                    {item.label}
                  </motion.a>
                ))}

                <motion.a
                  href={resumeHref}
                  download={resumeFileName}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: navItems.length * 0.08,
                    type: "spring",
                    stiffness: 300,
                    damping: 24,
                  }}
                  onClick={handleResumeClick}
                  className="block px-6 py-3 border-2 rounded text-center tracking-wider transition-all duration-300"
                  style={{
                    borderColor: "#64FFDA",
                    color: "#64FFDA",
                    backgroundColor: "transparent",
                  }}
                >
                  {messages.navigation.resume}
                </motion.a>
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: (navItems.length + 1) * 0.08,
                  type: "spring",
                  stiffness: 300,
                  damping: 24,
                }}
                className="pt-6 border-t space-y-4"
                style={{ borderColor: "rgba(100, 255, 218, 0.1)" }}
              >
                <div className="flex items-center gap-3">
                  <Globe
                    className="w-4 h-4"
                    style={{ color: "#64FFDA", opacity: 0.6 }}
                  />
                  <span
                    className="text-xs tracking-wider"
                    style={{ color: "#8892B0" }}
                  >
                    Language / 语言
                  </span>
                </div>

                <div className="space-y-2">
                  {languages.map((language) => {
                    const isActive = locale === language.value;

                    return (
                      <button
                        key={language.value}
                        type="button"
                        onClick={() => setLocale(language.value)}
                        className="w-full px-4 py-2.5 rounded-lg text-left flex items-center justify-between transition-all duration-300"
                        style={{
                          backgroundColor: isActive
                            ? "rgba(100, 255, 218, 0.15)"
                            : "rgba(100, 255, 218, 0.05)",
                          color: isActive ? "#64FFDA" : "#8892B0",
                          border: isActive
                            ? "1px solid rgba(100, 255, 218, 0.3)"
                            : "1px solid transparent",
                        }}
                      >
                        <span className="text-sm font-medium tracking-wide">
                          {language.label}
                        </span>
                        {isActive && (
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300"
                            style={{ backgroundColor: "#64FFDA" }}
                          >
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: "#0A192F" }}
                            />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 md:hidden z-30"
            style={{ backgroundColor: "rgba(2, 12, 27, 0.8)" }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
