import { useEffect, useState } from "react";

/** Auto-advance hero slides using each slide's durationSeconds. */
export default function useHeroSlideCarousel(slides, { enabled = true } = {}) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [slides.length, slides.map((slide) => slide.imageUrl).join("|")]);

  useEffect(() => {
    if (!enabled || slides.length <= 1) return undefined;
    const duration = (slides[activeIndex]?.durationSeconds || 5) * 1000;
    const timer = window.setTimeout(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, duration);
    return () => window.clearTimeout(timer);
  }, [slides, activeIndex, enabled]);

  return { activeIndex, setActiveIndex };
}
