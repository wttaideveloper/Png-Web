import { emptyMediaRef } from "../styles/themeUtils";
import { normalizeVideoSlots } from "./videoEmbed";

export const PAGE_SECTION_TYPES = [
  { type: "banner", label: "Banner", description: "Big header photo at the top", icon: "banner" },
  { type: "heading", label: "Heading", description: "Title and subtitle", icon: "heading" },
  { type: "text", label: "Text", description: "Paragraphs and stories", icon: "text" },
  { type: "image", label: "Image", description: "Photo with optional caption", icon: "image" },
  { type: "split", label: "Text + Image", description: "Photo beside your text", icon: "split" },
  { type: "columns", label: "Two columns", description: "Side-by-side text blocks", icon: "columns" },
  { type: "quote", label: "Quote", description: "Highlighted quote or verse", icon: "quote" },
  { type: "video", label: "Video", description: "1–3 YouTube videos side by side", icon: "video" },
  { type: "divider", label: "Spacer", description: "Line or empty space", icon: "divider" },
  { type: "cta", label: "Button", description: "Call-to-action link", icon: "cta" },
];

export const PAGE_TEMPLATES = [
  {
    id: "starter",
    label: "Simple page",
    description: "Heading + paragraph — perfect for announcements",
    emoji: "✨",
    sections: ["heading", "text"],
    sampleKey: "starter",
  },
  {
    id: "ministry",
    label: "Ministry page",
    description: "Banner, story, photo, and sign-up button",
    emoji: "⛪",
    sections: ["banner", "heading", "text", "split", "cta"],
    sampleKey: "ministry",
  },
  {
    id: "about",
    label: "About us",
    description: "Welcome banner, history, and team photo",
    emoji: "📖",
    sections: ["banner", "heading", "text", "split", "quote"],
    sampleKey: "about",
  },
  {
    id: "youth",
    label: "Youth program",
    description: "Energetic layout for youth & young adults",
    emoji: "🎯",
    sections: ["banner", "heading", "text", "columns", "cta"],
    sampleKey: "youth",
  },
  {
    id: "events",
    label: "Events",
    description: "Promote an upcoming camp, retreat, or seminar",
    emoji: "📅",
    sections: ["banner", "heading", "text", "split", "cta"],
    sampleKey: "events",
  },
  {
    id: "contact",
    label: "Contact",
    description: "Location, hours, and get-in-touch button",
    emoji: "📍",
    sections: ["heading", "text", "columns", "cta"],
    sampleKey: "contact",
  },
  {
    id: "giving",
    label: "Giving / support",
    description: "Inspire generosity with story and donate button",
    emoji: "💝",
    sections: ["banner", "heading", "text", "quote", "cta"],
    sampleKey: "giving",
  },
  {
    id: "blank",
    label: "Blank page",
    description: "Start empty — add blocks one by one",
    emoji: "📄",
    sections: [],
    sampleKey: null,
  },
];

export const PAGE_QUICK_ADDS = [
  {
    id: "welcome",
    label: "Welcome intro",
    emoji: "👋",
    description: "Friendly heading + paragraph",
    sections: ["heading", "text"],
    sampleKey: "welcome",
  },
  {
    id: "story",
    label: "Story + photo",
    emoji: "📸",
    description: "Image beside your message",
    sections: ["split"],
    sampleKey: "story",
  },
  {
    id: "info-columns",
    label: "Two-column info",
    emoji: "📋",
    description: "Times, location, or details side by side",
    sections: ["columns"],
    sampleKey: "info-columns",
  },
  {
    id: "quote",
    label: "Featured quote",
    emoji: "💬",
    description: "Scripture or inspiring quote",
    sections: ["quote"],
    sampleKey: "quote",
  },
  {
    id: "banner-cta",
    label: "Banner + button",
    emoji: "🎯",
    description: "Photo header with action button",
    sections: ["banner", "cta"],
    sampleKey: "banner-cta",
  },
  {
    id: "video",
    label: "Video feature",
    emoji: "▶️",
    description: "Title with embedded video",
    sections: ["heading", "video"],
    sampleKey: "video",
  },
];

const SAMPLE_CONTENT = {
  starter: {
    heading: {
      eyebrow: "ANNOUNCEMENT",
      title: "Your page title",
      subtitle: "A short line to introduce this page",
      align: "center",
    },
    text: {
      content:
        "Write your main message here. Tell visitors what this page is about and why it matters.\n\nYou can press Enter twice to start a new paragraph — just like writing an email.",
    },
  },
  ministry: {
    heading: {
      eyebrow: "MINISTRY",
      title: "Sabbath School",
      subtitle: "Growing together in faith every week",
      align: "center",
    },
    text: {
      content:
        "Sabbath School is a time for Bible study, fellowship, and spiritual growth. Classes are available for all ages — from children to adults.\n\nJoin us each Sabbath morning as we explore God's Word together.",
    },
    split: {
      content:
        "Our teachers prepare thoughtful lessons each week. Whether you are new to the Bible or have studied for years, you will find a welcoming class.",
      imagePosition: "right",
    },
    cta: {
      buttonText: "Join a class",
      buttonLink: "/contact",
      align: "center",
    },
  },
  about: {
    heading: {
      eyebrow: "OUR STORY",
      title: "About our church",
      subtitle: "Serving our community in Papua New Guinea",
      align: "center",
    },
    text: {
      content:
        "We are a welcoming Seventh-day Adventist congregation committed to worship, discipleship, and service.\n\nOur mission is to share the love of Christ and prepare people for His soon return.",
    },
    split: {
      content:
        "From Sabbath worship to community outreach, we invite you to be part of a family that cares for one another and for our neighbors.",
      imagePosition: "left",
    },
    quote: {
      content: "Go therefore and make disciples of all nations.",
      author: "Matthew 28:19",
      align: "center",
    },
  },
  youth: {
    heading: {
      eyebrow: "YOUTH",
      title: "Pathfinders & young adults",
      subtitle: "Adventure, faith, and friendship",
      align: "center",
    },
    text: {
      content:
        "Our youth programs help young people grow in character, leadership, and faith. Activities include camps, service projects, and weekly fellowship.",
    },
    columns: {
      leftContent: "Ages 10–15\nPathfinder Club — skills, honors, and outdoor adventure.",
      rightContent: "Ages 16+\nYouth meetings — Bible study, music, and mission trips.",
    },
    cta: {
      buttonText: "Register for youth",
      buttonLink: "/contact",
      align: "center",
    },
  },
  events: {
    heading: {
      eyebrow: "UPCOMING",
      title: "Camp meeting 2026",
      subtitle: "Save the date — all are welcome",
      align: "center",
    },
    text: {
      content:
        "Join us for inspiring messages, music, children's programs, and fellowship. Registration opens soon.\n\nCheck back for the full schedule and speaker lineup.",
    },
    split: {
      content: "Location: Main camp grounds\nDates: To be announced\nBring your family and friends!",
      imagePosition: "right",
    },
    cta: {
      buttonText: "Get event updates",
      buttonLink: "/contact",
      align: "center",
    },
  },
  contact: {
    heading: {
      eyebrow: "CONTACT",
      title: "We'd love to hear from you",
      subtitle: "Visit, call, or send a message",
      align: "center",
    },
    text: {
      content: "Whether you have a question, prayer request, or want to plan a visit — our team is happy to help.",
    },
    columns: {
      leftContent: "Church address\n123 Mission Road\nPort Moresby, PNG",
      rightContent: "Service times\nSabbath School: 9:00 AM\nDivine Service: 11:00 AM",
    },
    cta: {
      buttonText: "Send a message",
      buttonLink: "/contact",
      align: "center",
    },
  },
  giving: {
    heading: {
      eyebrow: "GIVING",
      title: "Support the mission",
      subtitle: "Your generosity makes a difference",
      align: "center",
    },
    text: {
      content:
        "Thank you for considering a gift to support worship, outreach, and community programs. Every contribution helps us serve more people with the gospel.",
    },
    quote: {
      content: "God loves a cheerful giver.",
      author: "2 Corinthians 9:7",
      align: "center",
    },
    cta: {
      buttonText: "Give today",
      buttonLink: "#support",
      align: "center",
    },
  },
  welcome: {
    heading: {
      eyebrow: "WELCOME",
      title: "We're glad you're here",
      subtitle: "Learn more about what we offer",
      align: "center",
    },
    text: {
      content:
        "Use this section to greet visitors and explain what they will find on this page.\n\nKeep it warm and simple — you can edit everything later.",
    },
  },
  story: {
    split: {
      content:
        "Tell a short story here. Share what makes your ministry special and invite people to get involved.",
      imagePosition: "right",
    },
  },
  "info-columns": {
    columns: {
      leftContent: "Left column\nAdd times, locations, or bullet points here.",
      rightContent: "Right column\nAdd contact details or extra information.",
    },
  },
  quote: {
    quote: {
      content: "Your word is a lamp to my feet and a light to my path.",
      author: "Psalm 119:105",
      align: "center",
    },
  },
  "banner-cta": {
    cta: {
      buttonText: "Learn more",
      buttonLink: "/contact",
      align: "center",
    },
  },
  video: {
    heading: {
      eyebrow: "WATCH",
      title: "Featured message",
      subtitle: "Stream our latest video",
      align: "center",
    },
    video: {
      columnCount: 1,
      videos: [{ videoUrl: "", caption: "" }],
      videoUrl: "",
      caption: "Paste a YouTube link above to show your video here.",
      align: "center",
    },
  },
};

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
      return {
        ...base,
        columnCount: 1,
        videos: [{ videoUrl: "", caption: "" }],
        videoUrl: "",
        caption: "",
        align: "center",
      };
    case "divider":
      return { ...base, style: "line" };
    case "cta":
      return { ...base, buttonText: "Learn more", buttonLink: "#", style: "primary", align: "center" };
    default:
      return { ...base, type: "text", content: "" };
  }
}

function sectionWithSample(type, sampleKey) {
  const base = defaultSection(type);
  const sample = SAMPLE_CONTENT[sampleKey]?.[type];
  return sample ? { ...base, ...sample, id: createSectionId() } : base;
}

export function sectionsFromTemplate(templateId) {
  const template = PAGE_TEMPLATES.find((t) => t.id === templateId) || PAGE_TEMPLATES[0];
  if (!template.sections.length) return [];
  const key = template.sampleKey || template.id;
  return template.sections.map((type) => sectionWithSample(type, key));
}

export function sectionsFromQuickAdd(quickAddId) {
  const item = PAGE_QUICK_ADDS.find((entry) => entry.id === quickAddId);
  if (!item) return [];
  const key = item.sampleKey || item.id;
  return item.sections.map((type) => sectionWithSample(type, key));
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
    case "video": {
      const videoData = normalizeVideoSlots(section);
      return {
        ...normalized,
        columnCount: videoData.columnCount,
        videos: videoData.videos,
        videoUrl: videoData.videos[0]?.videoUrl || "",
        caption: videoData.videos[0]?.caption || "",
        align: section.align || "center",
      };
    }
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

export function templatePreviewLabel(templateId) {
  const template = PAGE_TEMPLATES.find((t) => t.id === templateId);
  if (!template?.sections?.length) return "No starter blocks";
  return template.sections.map(sectionTypeLabel).join(" · ");
}
