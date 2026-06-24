import { useMemo } from "react";
import useHeroSlideCarousel from "../../hooks/useHeroSlideCarousel";
import { resolveHeroSlides } from "../../utils/heroSlides";

export function HeroSliderTrack({ slides, activeIndex, className = "" }) {
  if (!slides.length) return null;

  return (
    <div className={`hero-slider-track${className ? ` ${className}` : ""}`} aria-hidden="true">
      {slides.map((slide, index) => (
        <div
          key={`${slide.imageUrl}-${index}`}
          className={`hero-slider-slide${index === activeIndex ? " is-active" : ""}`}
          style={{
            backgroundImage: `linear-gradient(105deg, rgba(3,38,76,0.94) 0%, rgba(7,45,81,0.88) 36%, rgba(37,77,112,0.46) 100%), url(${slide.imageUrl})`,
          }}
        />
      ))}
    </div>
  );
}

export function HeroSliderDots({ slides, activeIndex, onSelect, className = "" }) {
  if (slides.length <= 1) return null;

  return (
    <div className={`hero-slider-dots${className ? ` ${className}` : ""}`} aria-label="Hero slides">
      {slides.map((_, index) => (
        <button
          key={index}
          type="button"
          className={`hero-slider-dot${index === activeIndex ? " is-active" : ""}`}
          onClick={() => onSelect(index)}
          aria-label={`Go to slide ${index + 1}`}
          aria-current={index === activeIndex ? "true" : undefined}
        />
      ))}
    </div>
  );
}

export default function HeroSlider({ hero, heroStyle, children, autoPlay = true }) {
  const slides = useMemo(() => resolveHeroSlides(hero), [hero]);
  const { activeIndex, setActiveIndex } = useHeroSlideCarousel(slides, { enabled: autoPlay });

  const textStyle = heroStyle?.color ? { color: heroStyle.color } : undefined;

  return (
    <section className="pngum-hero pngum-hero-slider" style={textStyle}>
      <HeroSliderTrack slides={slides} activeIndex={activeIndex} />
      <div className="container hero-slider-content">{children}</div>
      <HeroSliderDots slides={slides} activeIndex={activeIndex} onSelect={setActiveIndex} />
    </section>
  );
}
