import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ManifestoSection } from "./ManifestoSection";
import { AboutSection } from "./AboutSection";
import { ExperienceTimeline } from "./ExperienceTimeline";
import { GamingArchive } from "./GamingArchive";

export function HorizontalAboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const touchStartXRef = useRef<number | null>(null);
  const wheelLockedRef = useRef(false);
  const wheelUnlockTimeoutRef = useRef<number | null>(null);
  const currentSlideRef = useRef(0);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);

  const slides = useMemo(
    () => [
      { key: "manifesto", label: "BE AN ARTIST", content: <ManifestoSection /> },
      { key: "about", label: "ABOUT ME", content: <AboutSection /> },
      { key: "experience", label: "EXPERIENCE", content: <ExperienceTimeline /> },
      { key: "archive", label: "GAMING ARCHIVE", content: <GamingArchive /> },
    ],
    [],
  );

  const slideIndexByKey = useMemo(
    () =>
      Object.fromEntries(slides.map((slide, index) => [slide.key, index])) as Record<
        string,
        number
      >,
    [slides],
  );

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const updateWidth = () => {
      setViewportWidth(viewport.clientWidth);
    };

    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(viewport);
    window.addEventListener("resize", updateWidth);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  useEffect(() => {
    currentSlideRef.current = currentSlide;
  }, [currentSlide]);

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
        return;
      }

      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const wheelTravel = Math.abs(event.deltaY);
      const sectionTopReached = rect.top <= 1;
      const sectionVisible = rect.bottom > 0;
      const sectionAnchored = sectionTopReached && sectionVisible;
      const scrollingDown = event.deltaY > 0;
      const currentIndex = currentSlideRef.current;
      const canMoveHorizontally = scrollingDown
        ? currentIndex < slides.length - 1
        : currentIndex > 0;
      const enteringSection =
        sectionVisible &&
        ((scrollingDown && rect.top > 0 && rect.top <= wheelTravel + 32) ||
          (!scrollingDown &&
            rect.bottom < viewportHeight &&
            viewportHeight - rect.bottom <= wheelTravel + 32));

      const shouldLockVerticalScroll =
        (sectionAnchored || enteringSection) &&
        (canMoveHorizontally || wheelLockedRef.current);

      if (!sectionAnchored && !enteringSection) {
        return;
      }

      if (shouldLockVerticalScroll) {
        event.preventDefault();

        const sectionTop = window.scrollY + rect.top;
        window.scrollTo({
          top: sectionTop,
          behavior: "auto",
        });
      }

      if (wheelLockedRef.current) {
        return;
      }

      const nextSlide = scrollingDown ? currentIndex + 1 : currentIndex - 1;

      if (nextSlide < 0 || nextSlide >= slides.length) {
        return;
      }

      wheelLockedRef.current = true;
      currentSlideRef.current = nextSlide;
      setCurrentSlide(nextSlide);

      if (wheelUnlockTimeoutRef.current != null) {
        window.clearTimeout(wheelUnlockTimeoutRef.current);
      }

      wheelUnlockTimeoutRef.current = window.setTimeout(() => {
        wheelLockedRef.current = false;
        wheelUnlockTimeoutRef.current = null;
      }, 650);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleWheel);
      if (wheelUnlockTimeoutRef.current != null) {
        window.clearTimeout(wheelUnlockTimeoutRef.current);
      }
    };
  }, [slides.length]);

  const goToSlide = (nextIndex: number) => {
    const boundedIndex = Math.max(0, Math.min(nextIndex, slides.length - 1));
    const section = sectionRef.current;

    if (section) {
      const sectionTop = window.scrollY + section.getBoundingClientRect().top;
      window.scrollTo({
        top: sectionTop,
        behavior: "smooth",
      });
    }

    currentSlideRef.current = boundedIndex;
    setCurrentSlide(boundedIndex);
  };

  useEffect(() => {
    const handleExternalNavigation = (
      event: Event,
    ) => {
      const detail = (event as CustomEvent<{ slideKey?: string }>).detail;
      if (!detail?.slideKey) return;

      const slideIndex = slideIndexByKey[detail.slideKey];
      if (slideIndex == null) return;

      goToSlide(slideIndex);
    };

    window.addEventListener(
      "horizontal-about:navigate",
      handleExternalNavigation as EventListener,
    );

    return () => {
      window.removeEventListener(
        "horizontal-about:navigate",
        handleExternalNavigation as EventListener,
      );
    };
  }, [slideIndexByKey]);

  const canScrollLeft = currentSlide > 0;
  const canScrollRight = currentSlide < slides.length - 1;

  return (
    <section
      ref={sectionRef}
      id="be-an-artist"
      className="relative isolate h-screen w-full overflow-hidden"
    >
      <div ref={viewportRef} className="h-full w-full overflow-hidden">
        <motion.div
          className="flex h-full"
          animate={{ x: -(viewportWidth * currentSlide) }}
          transition={{ type: "spring", stiffness: 240, damping: 32 }}
          style={{
            width: viewportWidth ? `${viewportWidth * slides.length}px` : "300%",
          }}
        >
          {slides.map((slide, index) => (
            <div
              key={slide.key}
              className="relative h-full shrink-0 overflow-hidden"
              style={{
                width: viewportWidth ? `${viewportWidth}px` : "100vw",
                minWidth: viewportWidth ? `${viewportWidth}px` : "100vw",
                maxWidth: viewportWidth ? `${viewportWidth}px` : "100vw",
              }}
            >
              <div
                className="relative h-full w-full overflow-hidden"
                onTouchStart={(event) => {
                  touchStartXRef.current = event.touches[0]?.clientX ?? null;
                }}
                onTouchEnd={(event) => {
                  if (touchStartXRef.current == null) return;

                  const touchEndX = event.changedTouches[0]?.clientX ?? 0;
                  const deltaX = touchStartXRef.current - touchEndX;
                  touchStartXRef.current = null;

                  if (Math.abs(deltaX) < 50) return;
                  goToSlide(deltaX > 0 ? currentSlide + 1 : currentSlide - 1);
                }}
              >
                {slide.content}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {canScrollLeft && (
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => goToSlide(currentSlide - 1)}
          className="absolute left-8 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[#64FFDA] bg-[#112240] transition-all hover:scale-110 hover:bg-[#64FFDA] group"
          style={{ boxShadow: "0 0 20px rgba(100, 255, 218, 0.3)" }}
        >
          <ChevronLeft className="h-6 w-6 text-[#64FFDA] group-hover:text-[#0A192F]" />
        </motion.button>
      )}

      {canScrollRight && (
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => goToSlide(currentSlide + 1)}
          className="absolute right-8 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[#64FFDA] bg-[#112240] transition-all hover:scale-110 hover:bg-[#64FFDA] group"
          style={{ boxShadow: "0 0 20px rgba(100, 255, 218, 0.3)" }}
        >
          <ChevronRight className="h-6 w-6 text-[#64FFDA] group-hover:text-[#0A192F]" />
        </motion.button>
      )}

    </section>
  );
}
