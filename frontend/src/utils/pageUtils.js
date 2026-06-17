export function slugify(value = "") {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function getContactSection(sections) {
  return (sections || []).find((item) => item.sectionName === "contact") || null;
}

export function getStoredSitePagesRaw(data) {
  const fromItems = getContactSection(data?.sections)?.items?.sitePages;
  if (Array.isArray(fromItems) && fromItems.length) {
    return fromItems;
  }

  if (Array.isArray(data?.sitePages) && data.sitePages.length) {
    return data.sitePages;
  }

  return [];
}

/** Attach sitePages from CMS JSON storage for public site + admin reload. */
export function enrichHomePageData(data) {
  if (!data) return data;
  const stored = getStoredSitePagesRaw(data);
  if (!stored.length) return data;
  if (Array.isArray(data.sitePages) && data.sitePages.length) return data;
  return { ...data, sitePages: stored };
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
