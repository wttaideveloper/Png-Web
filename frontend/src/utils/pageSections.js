import { emptyMediaRef } from "../styles/themeUtils";

export const PAGE_SECTION_TYPES = [
  { type: "banner", label: "Banner", description: "Big header photo", icon: "banner" },
  { type: "heading", label: "Heading", description: "Title & subtitle", icon: "heading" },
  { type: "text", label: "Text", description: "Paragraphs", icon: "text" },
  { type: "image", label: "Image", description: "Photo with caption", icon: "image" },
  { type: "split", label: "Text + Image", description: "Side by side", icon: "split" },
  { type: "columns", label: "Two columns", description: "Text in 2 columns", icon: "columns" },
  { type: "quote", label: "Quote", description: "Highlighted quote", icon: "quote" },
  { type: "video", label: "Video", description: "YouTube or link", icon: "video" },
  { type: "divider", label: "Spacer", description: "Visual break", icon: "divider" },
  { type: "cta", label: "Button", description: "Action link", icon: "cta" },
];

export const PAGE_TEMPLATES = [
  {
    id: "starter",
    label: "Quick start",
    description: "Heading + text — perfect for a simple page",
    emoji: "✨",
    sections: ["heading", "text"],
  },
  {
    id: "ministry",
    label: "Ministry page",
    description: "Banner, story, photo, and button",
    emoji: "⛪",
    sections: ["banner", "heading", "text", "split", "cta"],
  },
  {
    id: "about",
    label: "About us",
    description: "Banner, intro, and full-width image",
    emoji: "📖",
    sections: ["banner", "heading", "text", "image"],
  },
  {
    id: "blank",
    label: "Empty page",
    description: "Start from scratch — add your own blocks",
    emoji: "📄",
    sections: [],
  },
];

export function createSectionId() {
  return `sec-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export function defaultSection(type) {
  const base = { id: createSectionId(), type, align: "left" };
  switch (type) {
    case "banner":
      return { ...base, image: emptyMediaRef(), height: "medium" };
    case "heading":
      return { ...base, eyebrow: "", title: "Section heading", subtitle: "", align: "center" };
    case "text":
      return { ...base, content: "Write your content here.\n\nAdd another paragraph after a blank line.", size: "normal" };
    case "image":
      return { ...base, image: emptyMediaRef(), caption: "", size: "large", align: "center" };
    case "split":
      return {
        ...base,
        content: "Tell your story here. Explain your ministry, program, or message.",
        image: emptyMediaRef(),
        imagePosition: "right",
      };
    case "columns":
      return {
        ...base,
        leftContent: "Left column text goes here.",
        rightContent: "Right column text goes here.",
      };
    case "quote":
      return { ...base, content: "A meaningful quote or highlight.", author: "", align: "center" };
    case "video":
      return { ...base, videoUrl: "", caption: "", align: "center" };
    case "divider":
      return { ...base, style: "line" };
    case "cta":
      return { ...base, buttonText: "Learn more", buttonLink: "#", style: "primary", align: "center" };
    default:
      return { ...base, type: "text", content: "" };
  }
}

export function sectionsFromTemplate(templateId) {
  const template = PAGE_TEMPLATES.find((t) => t.id === templateId) || PAGE_TEMPLATES[0];
  return template.sections.map((type) => defaultSection(type));
}

export function defaultPageSections() {
  return sectionsFromTemplate("starter");
}

function normalizeImageRef(image) {
  if (!image) return emptyMediaRef();
  if (typeof image === "string") return { id: null, url: image };
  return {
    id: image.id ?? image.data?.id ?? null,
    url: image.url || image.data?.attributes?.url || "",
  };
}

function normalizeSection(section) {
  if (!section || !section.type) return null;
  const normalized = {
    id: section.id || createSectionId(),
    type: section.type,
    align: section.align || "left",
  };

  switch (section.type) {
    case "banner":
      return { ...normalized, image: normalizeImageRef(section.image), height: section.height || "medium" };
    case "heading":
      return {
        ...normalized,
        eyebrow: section.eyebrow || "",
        title: section.title || "",
        subtitle: section.subtitle || "",
        align: section.align || "center",
      };
    case "text":
      return { ...normalized, content: section.content || "", size: section.size || "normal" };
    case "image":
      return {
        ...normalized,
        image: normalizeImageRef(section.image),
        caption: section.caption || "",
        size: section.size || "large",
        align: section.align || "center",
      };
    case "split":
      return {
        ...normalized,
        content: section.content || "",
        image: normalizeImageRef(section.image),
        imagePosition: section.imagePosition === "left" ? "left" : "right",
      };
    case "columns":
      return {
        ...normalized,
        leftContent: section.leftContent || "",
        rightContent: section.rightContent || "",
      };
    case "quote":
      return {
        ...normalized,
        content: section.content || "",
        author: section.author || "",
        align: section.align || "center",
      };
    case "video":
      return {
        ...normalized,
        videoUrl: section.videoUrl || "",
        caption: section.caption || "",
        align: section.align || "center",
      };
    case "divider":
      return { ...normalized, style: section.style || "line" };
    case "cta":
      return {
        ...normalized,
        buttonText: section.buttonText || "",
        buttonLink: section.buttonLink || "#",
        style: section.style || "primary",
        align: section.align || "center",
      };
    default:
      return null;
  }
}

export function migrateLegacyPageSections(page) {
  if (Array.isArray(page?.sections) && page.sections.length) {
    return page.sections.map(normalizeSection).filter(Boolean);
  }

  const sections = [];
  const bannerImage = normalizeImageRef(page?.bannerImage || (page?.showBannerImage ? page?.heroImage : null));
  const sideImage = normalizeImageRef(page?.sideImage || (page?.showSideImage ? page?.heroImage : null));

  if (page?.showBannerImage && bannerImage.url) {
    sections.push({ id: createSectionId(), type: "banner", image: bannerImage, height: "medium", align: "left" });
  }

  if (page?.body?.trim()) {
    if (page?.showSideImage && sideImage.url) {
      sections.push({
        id: createSectionId(),
        type: "split",
        content: page.body,
        image: sideImage,
        imagePosition: "right",
        align: "left",
      });
    } else {
      sections.push({ id: createSectionId(), type: "text", content: page.body, align: "left" });
    }
  }

  if (page?.showPageButton && page?.pageButtonText) {
    sections.push({
      id: createSectionId(),
      type: "cta",
      buttonText: page.pageButtonText,
      buttonLink: page.pageButtonLink || "#",
      align: "center",
    });
  }

  return sections.length ? sections : defaultPageSections();
}

export function ensurePageSections(page) {
  return migrateLegacyPageSections(page);
}

export function serializePageSections(sections = []) {
  return (sections || []).map(normalizeSection).filter(Boolean);
}

export function sectionCountLabel(page) {
  const count = ensurePageSections(page).length;
  return `${count} block${count === 1 ? "" : "s"}`;
}

export function sectionTypeLabel(type) {
  return PAGE_SECTION_TYPES.find((t) => t.type === type)?.label || type;
}
