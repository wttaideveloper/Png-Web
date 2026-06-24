import { getImageUrl } from "../styles/themeUtils";

function parseItems(items) {
  if (!items) return {};
  if (typeof items === "string") {
    try {
      return JSON.parse(items) || {};
    } catch {
      return {};
    }
  }
  return items;
}

function slideImageUrl(slide) {
  return getImageUrl(
    slide?.imageUrl ||
      slide?.image ||
      slide?.imageMedia?.url ||
      slide?.imageMedia
  );
}

/** Normalize slides from CMS hero section for the public slider. */
export function resolveHeroSlides(hero) {
  const items = parseItems(hero?.items);
  const fromItems = Array.isArray(items.heroSlides) ? items.heroSlides : [];

  const slides = fromItems
    .map((slide) => ({
      imageUrl: slideImageUrl(slide),
      durationSeconds: Number(slide.durationSeconds) > 0 ? Number(slide.durationSeconds) : 5,
    }))
    .filter((slide) => slide.imageUrl);

  if (slides.length) return slides;

  const fallback = getImageUrl(hero?.imageSettings?.image, items.heroImageUrl);
  if (fallback) return [{ imageUrl: fallback, durationSeconds: 5 }];
  return [];
}

/** Normalize slides from admin form state for preview. */
export function resolveHeroSlidesFromForm(formSlides = [], fallbackImage) {
  const slides = (formSlides || [])
    .map((slide) => ({
      imageUrl: slideImageUrl(slide),
      durationSeconds: Number(slide.durationSeconds) > 0 ? Number(slide.durationSeconds) : 5,
    }))
    .filter((slide) => slide.imageUrl);

  if (slides.length) return slides;

  const fallback = getImageUrl(fallbackImage?.url || fallbackImage);
  if (fallback) return [{ imageUrl: fallback, durationSeconds: 5 }];
  return [];
}

export function buildPreviewHero(formSlides, fallbackImage) {
  return {
    items: {
      heroSlides: resolveHeroSlidesFromForm(formSlides, fallbackImage).map((slide) => ({
        imageUrl: slide.imageUrl,
        durationSeconds: slide.durationSeconds,
      })),
    },
    imageSettings: fallbackImage?.url ? { image: fallbackImage } : undefined,
  };
}
