import { buildMenuTree, ensurePageIds, menuNodesToHeaderItems } from "./menuUtils";

export function slugify(value = "") {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseJsonValue(value, fallback = null) {
  if (value == null) return fallback;
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }
  return value;
}

function getContactSection(sections) {
  return (sections || []).find((item) => item.sectionName === "contact") || null;
}

function getSectionItems(section) {
  if (!section) return {};
  const items = parseJsonValue(section.items, section.items);
  return items && typeof items === "object" && !Array.isArray(items) ? items : {};
}

function normalizeSectionsForRead(sections = []) {
  return (sections || []).map((section) => {
    if (!section || typeof section !== "object") return section;
    const items = getSectionItems(section);
    const mediaItems = parseJsonValue(section.mediaItems, section.mediaItems);
    const featuredItems = parseJsonValue(section.featuredItems, section.featuredItems);
    return {
      ...section,
      ...(items ? { items } : {}),
      ...(mediaItems && typeof mediaItems === "object" ? { mediaItems } : {}),
      ...(featuredItems && typeof featuredItems === "object" ? { featuredItems } : {}),
    };
  });
}

export function getStoredSitePagesRaw(data) {
  const contactItems = getSectionItems(getContactSection(data?.sections));
  const fromItems = contactItems?.sitePages;
  if (Array.isArray(fromItems) && fromItems.length) {
    return fromItems;
  }

  if (Array.isArray(data?.sitePages) && data.sitePages.length) {
    return data.sitePages;
  }

  return [];
}

/** Attach sitePages + rebuild nested header menu for public site and admin reload. */
export function enrichHomePageData(data) {
  if (!data) return data;

  const sections = normalizeSectionsForRead(data.sections);
  const stored = getStoredSitePagesRaw({ ...data, sections });
  const enriched = { ...data, sections };

  if (stored.length) {
    enriched.sitePages = stored;

    const menuItems = menuNodesToHeaderItems(buildMenuTree(ensurePageIds(stored)));
    if (menuItems.length) {
      enriched.headerSettings = {
        ...(enriched.headerSettings || {}),
        menuItems,
      };
    }
  }

  return enriched;
}

export function pagePublicLink(page) {
  if (!page) return "#";
  if (page.pageType === "link") return page.link || "#";
  const slug = page.slug || slugify(page.title);
  if (!slug) return "#";
  return page.link?.startsWith("/") ? page.link : `/${slug}`;
}

export function findSitePageByPath(sitePages = [], pathname = "/") {
  const path = pathname.replace(/\/+$/, "") || "/";
  if (path === "/") return null;

  return (sitePages || []).find((page) => {
    if (page.visible === false) return false;
    if (page.pageType === "link") {
      const link = page.link || "";
      return link === path || link === `${path}/`;
    }
    const slug = page.slug || slugify(page.title);
    return slug && (`/${slug}` === path || `/${slug}/` === path);
  });
}
