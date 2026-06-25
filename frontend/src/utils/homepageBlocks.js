import { ensurePageSections, sectionsFromQuickAdd, serializePageSections } from "./pageSections";

export const HOMEPAGE_BLOCK_PLACEMENTS = [
  {
    id: "after-mission",
    label: "After Mission",
    description: "Below the mission statement",
    emoji: "🎯",
  },
  {
    id: "after-ministries",
    label: "After Ministries",
    description: "Below ministry cards",
    emoji: "⛪",
  },
  {
    id: "after-updates",
    label: "After News & Videos",
    description: "Below updates section",
    emoji: "📰",
  },
  {
    id: "before-support",
    label: "Before Giving",
    description: "Above support / giving",
    emoji: "💝",
  },
];

export const HOMEPAGE_QUICK_SECTIONS = [
  {
    id: "welcome",
    label: "Welcome text",
    emoji: "👋",
    description: "Heading + paragraph",
    sampleId: "welcome",
  },
  {
    id: "story",
    label: "Story + photo",
    emoji: "📸",
    description: "Image beside text",
    sampleId: "story",
  },
  {
    id: "highlight",
    label: "Quote highlight",
    emoji: "💬",
    description: "Featured quote",
    sampleId: "quote",
  },
  {
    id: "banner-cta",
    label: "Banner + button",
    emoji: "🎯",
    description: "Photo banner with button",
    sampleId: "banner-cta",
  },
  {
    id: "video-block",
    label: "Video feature",
    emoji: "▶️",
    description: "Title with video",
    sampleId: "video",
  },
];

function parseItems(items) {
  if (!items) return {};
  if (typeof items === "string") {
    try {
      return JSON.parse(items) || {};
    } catch {
      return {};
    }
  }
  return items && typeof items === "object" ? items : {};
}

export function sectionsFromHomepageQuickAdd(quickAddId) {
  const item = HOMEPAGE_QUICK_SECTIONS.find((entry) => entry.id === quickAddId);
  if (!item) return [];
  return sectionsFromQuickAdd(item.sampleId || item.id);
}

export function getHomepageBlocksFromData(data) {
  const contact = (data?.sections || []).find((item) => item.sectionName === "contact");
  const items = parseItems(contact?.items);
  const raw = items.homepageBlocks;
  if (!Array.isArray(raw)) return [];
  return ensurePageSections({ sections: raw });
}

export function getHomepageBlocksPlacementFromData(data) {
  const contact = (data?.sections || []).find((item) => item.sectionName === "contact");
  const items = parseItems(contact?.items);
  const placement = items.homepageBlocksPlacement || "after-ministries";
  return HOMEPAGE_BLOCK_PLACEMENTS.some((item) => item.id === placement) ? placement : "after-ministries";
}

export function serializeHomepageBlocks(blocks = []) {
  return serializePageSections(blocks);
}

export function placementLabel(placementId) {
  return HOMEPAGE_BLOCK_PLACEMENTS.find((item) => item.id === placementId)?.label || "Homepage";
}
