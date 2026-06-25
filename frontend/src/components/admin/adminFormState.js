import { sampleHomePage } from "../../mock/sampleHomePage";
import { slugify, enrichHomePageData, getStoredSitePagesRaw } from "../../utils/pageUtils";
import { buildMenuTree, createPageId, ensurePageIds, menuNodesToHeaderItems } from "../../utils/menuUtils";
import { ensurePageSections, serializePageSections } from "../../utils/pageSections";
import {
  getHomepageBlocksFromData,
  getHomepageBlocksPlacementFromData,
  serializeHomepageBlocks,
} from "../../utils/homepageBlocks";
import { emptyMediaRef, extractMediaRef } from "../../styles/themeUtils";

export { enrichHomePageData } from "../../utils/pageUtils";

function getSection(sections, name) {
  return sections?.find((item) => item.sectionName === name) || null;
}

function splitHeroTitle(title) {
  const combined = title || "";
  if (combined.includes("|")) {
    const [line1, line2] = combined.split("|").map((part) => part.trim());
    return [line1 || sampleHomePage.hero.headingTop, line2 || sampleHomePage.hero.headingBottom];
  }
  return [combined || sampleHomePage.hero.headingTop, sampleHomePage.hero.headingBottom];
}

function joinHeroTitle(line1, line2) {
  return `${line1}|${line2}`;
}

function defaultPageExtras() {
  return {
    showBannerImage: false,
    showSideImage: false,
    showPageButton: false,
    pageButtonText: "",
    pageButtonLink: "",
    bannerImage: emptyMediaRef(),
    sideImage: emptyMediaRef(),
  };
}

function findJsonItem(items, title) {
  return (items || []).find((item) => item?.title === title);
}

function loadMinistryItems(section) {
  const components = section?.ministryItems || [];
  const jsonItems = Array.isArray(section?.items) ? section.items : [];

  if (components.length) {
    return components.map((item) => {
      const imageRef = extractMediaRef(item.image);
      const jsonItem = findJsonItem(jsonItems, item.title);
      const jsonImage = typeof jsonItem?.image === "string" ? jsonItem.image : "";
      return {
        title: item.title || "",
        description: item.description || item.desc || "",
        buttonText: item.buttonText || item.cta || "Learn More",
        link: item.link || "#",
        imageMedia: {
          id: imageRef.id,
          url: imageRef.url || jsonImage,
        },
      };
    });
  }

  if (jsonItems.length && typeof jsonItems[0] === "object") {
    return jsonItems.map((item) => ({
      title: item.title || "",
      description: item.description || item.desc || "",
      buttonText: item.buttonText || item.cta || "Learn More",
      link: item.link || "#",
      imageMedia: extractMediaRef(item.image),
    }));
  }

  return [];
}

function loadVideoItems(section) {
  const components = section?.videoItems || [];
  const jsonItems = Array.isArray(section?.mediaItems) ? section.mediaItems : [];

  if (components.length) {
    return components.map((item) => {
      const thumbRef = extractMediaRef(item.thumbnail);
      const videoRef = extractMediaRef(item.video);
      const jsonItem = findJsonItem(jsonItems, item.title);
      return {
        title: item.title || "",
        description: item.description || item.meta || "",
        videoLink: item.link || jsonItem?.videoUrl || "",
        thumbnailMedia: {
          id: thumbRef.id,
          url: thumbRef.url || jsonItem?.image || "",
        },
        videoMedia: {
          id: videoRef.id,
          url: videoRef.url || jsonItem?.videoUrl || "",
        },
      };
    });
  }

  if (jsonItems.length) {
    return jsonItems.map((item) => ({
      title: item.title || "",
      description: item.description || item.meta || "",
      videoLink: item.link || item.videoUrl || "",
      thumbnailMedia: extractMediaRef(item.image || item.thumbnail),
      videoMedia: extractMediaRef(item.videoUrl || item.video),
    }));
  }

  return [];
}

function loadNewsItems(section) {
  const components = section?.newsItems || [];
  const jsonItems = Array.isArray(section?.items) ? section.items : [];
  if (components.length) {
    return components.map((item) => {
      const jsonItem = findJsonItem(jsonItems, item.title);
      const imageRef = extractMediaRef(item.image || jsonItem?.image);
      return {
        tag: item.tag || "",
        date: item.date || "",
        title: item.title || "",
        imageMedia: {
          id: imageRef.id,
          url: imageRef.url || (typeof jsonItem?.image === "string" ? jsonItem.image : ""),
        },
      };
    });
  }

  if (jsonItems.length) {
    return jsonItems.map((item) => ({
      tag: item.tag || item.category || "",
      date: item.date || item.publishedAt || "",
      title: item.title || "",
      imageMedia: extractMediaRef(item.image),
    }));
  }

  return sampleHomePage.updates.news.map((item) => ({
    tag: item.tag || "",
    date: item.date || "",
    title: item.title || "",
    imageMedia: emptyMediaRef(),
  }));
}

function mediaId(ref) {
  return ref?.id || undefined;
}

function normalizeStoredUrl(url = "") {
  if (!url || typeof url !== "string") return "";
  if (url.startsWith("http://") || url.startsWith("https://")) {
    try {
      const parsed = new URL(url);
      return `${parsed.pathname}${parsed.search}`;
    } catch {
      return url;
    }
  }
  return url;
}

function normalizeMediaRefForStorage(ref) {
  if (!ref) return emptyMediaRef();
  return {
    id: ref.id || null,
    url: normalizeStoredUrl(ref.url || ""),
  };
}

function serializeImageSettings(existingSettings, imageRef) {
  const hasImage = Boolean(mediaId(imageRef) || imageRef?.url);
  return {
    altText: existingSettings?.altText || "",
    image: hasImage ? mediaId(imageRef) ?? null : null,
  };
}

function loadHeroSlides(hero, heroImageRef) {
  let items = hero?.items;
  if (typeof items === "string") {
    try {
      items = JSON.parse(items);
    } catch {
      items = {};
    }
  }
  const raw = Array.isArray(items?.heroSlides) ? items.heroSlides : [];
  if (raw.length) {
    return raw.map((slide) => ({
      imageMedia: {
        id: slide.imageId || null,
        url: slide.imageUrl || slide.image || "",
      },
      durationSeconds: Number(slide.durationSeconds) > 0 ? Number(slide.durationSeconds) : 5,
    }));
  }
  if (heroImageRef?.url || heroImageRef?.id) {
    return [{ imageMedia: heroImageRef, durationSeconds: 5 }];
  }
  return [];
}


function mergeButtonSettings(existing, { text, link }, defaults = {}) {
  return {
    text: text ?? existing?.text ?? defaults.text ?? "",
    link: link ?? existing?.link ?? defaults.link ?? "#",
    backgroundColor: existing?.backgroundColor ?? defaults.backgroundColor,
    textColor: existing?.textColor ?? defaults.textColor,
    borderRadius: existing?.borderRadius,
    padding: existing?.padding,
  };
}

function pickFields(source, keys) {
  const output = {};
  keys.forEach((key) => {
    if (source?.[key] !== undefined && source?.[key] !== null) {
      output[key] = source[key];
    }
  });
  return output;
}

/** Remove Strapi component ids so PUT payloads do not reference unrelated entities. */
function stripNestedComponentIds(value) {
  if (Array.isArray(value)) return value.map(stripNestedComponentIds);
  if (!value || typeof value !== "object") return value;
  const output = {};
  Object.entries(value).forEach(([key, nestedValue]) => {
    if (key === "id" || key === "__component") return;
    output[key] = stripNestedComponentIds(nestedValue);
  });
  return output;
}

function serializeMenuItems(items = []) {
  return items
    .filter((item) => item?.label)
    .map((item) => ({
      label: item.label || "",
      link: item.link || "#",
    }));
}

function serializeGlobalTheme(existing = {}, form) {
  return {
    ...pickFields(existing, [
      "accentOrange",
      "navyColor",
      "tealColor",
      "headingFontSize",
      "bodyFontSize",
      "borderRadius",
      "containerWidth",
      "sectionSpacing",
    ]),
    primaryColor: form.primaryColor,
    secondaryColor: form.secondaryColor,
    backgroundColor: form.backgroundColor,
    textColor: form.textColor,
    fontFamily: form.fontFamily,
    headingFontFamily: form.headingFontFamily,
  };
}

function serializeRailSettings(existing = {}, form) {
  return {
    ...pickFields(existing, ["logoColor"]),
    backgroundColor: form.railBg,
    width: form.railWidth,
    showLogo: form.showRailLogo,
  };
}

function serializeSocialLinks(links = []) {
  return (links || []).map((link) => ({
    platform: link?.platform || "",
    url: link?.url || "",
    icon: mediaId(link?.icon),
  }));
}

function serializeImageSettingsPayload(imageSettings) {
  if (!imageSettings) return undefined;
  return {
    altText: imageSettings.altText || "",
    image: mediaId(imageSettings.image) ?? null,
  };
}

function serializeColorSettings(colorSettings) {
  if (!colorSettings) return undefined;
  return pickFields(colorSettings, ["backgroundColor", "textColor", "primaryColor", "secondaryColor"]);
}

function serializeTypographySettings(typography) {
  if (!typography) return undefined;
  return pickFields(typography, ["fontFamily", "fontSize", "fontWeight", "lineHeight"]);
}

function serializeSpacingSettings(spacing) {
  if (!spacing) return undefined;
  return pickFields(spacing, ["padding", "margin", "gap"]);
}

function serializeStatItems(items = []) {
  return items
    .filter((item) => item?.value && item?.label)
    .map((item) => ({
      value: item.value || "",
      label: item.label || "",
    }));
}

function serializeMinistryItemsForSection(items = []) {
  return items
    .filter((item) => item?.title)
    .map((item) => ({
      title: item.title || "",
      description: item.description || "",
      buttonText: item.buttonText || "",
      link: item.link || "#",
      image: mediaId(item.image) ?? null,
    }));
}

function serializeNewsItemsForSection(items = []) {
  return items
    .filter((item) => item?.title)
    .map((item) => ({
      tag: item.tag || "",
      date: item.date || "",
      title: item.title || "",
      excerpt: item.excerpt || "",
      link: item.link || "",
      image: mediaId(item.image) ?? null,
    }));
}

function serializeVideoItemsForSection(items = []) {
  return items
    .filter((item) => item?.title)
    .map((item) => ({
      title: item.title || "",
      description: item.description || "",
      duration: item.duration || "",
      link: item.link || "",
      thumbnail: mediaId(item.thumbnail) ?? null,
      video: mediaId(item.video) ?? null,
    }));
}

function serializeDonationItems(items = []) {
  return items
    .filter((item) => item?.amount)
    .map((item) => ({
      amount: typeof item.amount === "object" ? String(item.amount?.amount || "") : String(item.amount || ""),
      link: item.link || "",
    }));
}

function serializeJsonField(value) {
  if (value == null) return undefined;
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return undefined;
    }
  }
  return stripNestedComponentIds(value);
}

function serializeHomeSection(section) {
  if (!section) return section;

  const output = {
    sectionName: section.sectionName,
    title: section.title,
    subtitle: section.subtitle,
    description: section.description,
    layoutType: section.layoutType,
    displayOrder: section.displayOrder,
    isActive: section.isActive !== false,
    borderRadius: section.borderRadius,
    containerWidth: section.containerWidth,
  };

  const buttonSettings = section.buttonSettings
    ? mergeButtonSettings(section.buttonSettings, {}, {})
    : undefined;
  const secondaryButtonSettings = section.secondaryButtonSettings
    ? mergeButtonSettings(section.secondaryButtonSettings, {}, {})
    : undefined;
  const imageSettings = serializeImageSettingsPayload(section.imageSettings);
  const colorSettings = serializeColorSettings(section.colorSettings);
  const titleTypography = serializeTypographySettings(section.titleTypography);
  const subtitleTypography = serializeTypographySettings(section.subtitleTypography);
  const bodyTypography = serializeTypographySettings(section.bodyTypography);
  const spacingSettings = serializeSpacingSettings(section.spacingSettings);
  const statItems = Array.isArray(section.statItems) ? serializeStatItems(section.statItems) : undefined;
  const ministryItems = Array.isArray(section.ministryItems)
    ? serializeMinistryItemsForSection(section.ministryItems)
    : undefined;
  const newsItems = Array.isArray(section.newsItems) ? serializeNewsItemsForSection(section.newsItems) : undefined;
  const videoItems = Array.isArray(section.videoItems) ? serializeVideoItemsForSection(section.videoItems) : undefined;
  const donationItems = Array.isArray(section.donationItems) ? serializeDonationItems(section.donationItems) : undefined;
  const items = serializeJsonField(section.items);
  const mediaItems = serializeJsonField(section.mediaItems);
  const featuredItems = serializeJsonField(section.featuredItems);

  if (buttonSettings) output.buttonSettings = buttonSettings;
  if (secondaryButtonSettings) output.secondaryButtonSettings = secondaryButtonSettings;
  if (imageSettings) output.imageSettings = imageSettings;
  if (colorSettings) output.colorSettings = colorSettings;
  if (titleTypography) output.titleTypography = titleTypography;
  if (subtitleTypography) output.subtitleTypography = subtitleTypography;
  if (bodyTypography) output.bodyTypography = bodyTypography;
  if (spacingSettings) output.spacingSettings = spacingSettings;
  if (statItems?.length) output.statItems = statItems;
  if (ministryItems?.length) output.ministryItems = ministryItems;
  if (newsItems?.length) output.newsItems = newsItems;
  if (videoItems?.length) output.videoItems = videoItems;
  if (donationItems?.length) output.donationItems = donationItems;
  if (items) output.items = items;
  if (mediaItems) output.mediaItems = mediaItems;
  if (featuredItems) output.featuredItems = featuredItems;

  return output;
}

function serializeSectionsForStrapi(sections = []) {
  return (sections || []).map(serializeHomeSection);
}

function serializeSitePagesForStrapiComponent(navigationPages = []) {
  return navigationPages
    .filter((page) => page?.title)
    .map((page) => {
      const slug = page.slug || slugify(page.title);
      const pageType = page.pageType || "content";
      return {
        title: page.title,
        slug,
        link: pageType === "link" ? page.link || "#" : `/${slug}`,
        pageType,
        eyebrow: page.eyebrow || "",
        body: page.body || "",
        visible: page.visible !== false,
        showInHeader: page.showInHeader !== false,
        showInFooter: page.showInFooter === true,
        heroImage: mediaId(page.bannerImage) || mediaId(page.sideImage) || mediaId(page.heroImage),
      };
    });
}

function normalizeNavigationPage(page, index = 0) {
  const slug = page.slug || slugify(page.title);
  const pageType = page.pageType || "content";
  return {
    pageId: page.pageId || page.id || createPageId(),
    parentId: page.parentId || null,
    menuOrder: typeof page.menuOrder === "number" ? page.menuOrder : index,
    title: page.title || "",
    slug,
    link: page.link || (pageType === "link" ? "#" : `/${slug}`),
    pageType,
    eyebrow: page.eyebrow || "",
    body: page.body || "",
    visible: page.visible !== false,
    showInHeader: page.showInHeader !== false,
    showInFooter: page.showInFooter === true,
    heroImage: extractMediaRef(page.heroImage),
    showBannerImage: page.showBannerImage === true,
    showSideImage: page.showSideImage === true || page.showHeroImage === true,
    showPageButton: page.showPageButton === true,
    pageButtonText: page.pageButtonText || "",
    pageButtonLink: page.pageButtonLink || "",
    bannerImage: extractMediaRef(page.bannerImage || (page.showBannerImage ? page.heroImage : null)),
    sideImage: extractMediaRef(page.sideImage || (page.showSideImage || page.showHeroImage ? page.heroImage : null)),
    sections: serializePageSections(ensurePageSections(page)),
  };
}

function serializeSitePagesForStorage(navigationPages = []) {
  return navigationPages
    .filter((page) => page?.title)
    .map((page) => {
      const slug = page.slug || slugify(page.title);
      const pageType = page.pageType || "content";
      const heroImage = extractMediaRef(page.heroImage);
      const bannerImage = extractMediaRef(page.bannerImage || (page.showBannerImage ? heroImage : null));
      const sideImage = extractMediaRef(page.sideImage || (page.showSideImage || page.showHeroImage ? heroImage : null));
      const primaryImage = bannerImage.id || bannerImage.url ? bannerImage : sideImage;
      return {
        pageId: page.pageId || page.id || createPageId(),
        parentId: page.parentId || null,
        menuOrder: typeof page.menuOrder === "number" ? page.menuOrder : 0,
        title: page.title,
        slug,
        link: pageType === "link" ? page.link || "#" : `/${slug}`,
        pageType,
        eyebrow: page.eyebrow || "",
        body: page.body || "",
        visible: page.visible !== false,
        showInHeader: page.showInHeader !== false,
        showInFooter: page.showInFooter === true,
        heroImage: normalizeMediaRefForStorage(primaryImage.id || primaryImage.url ? primaryImage : emptyMediaRef()),
        showBannerImage: page.showBannerImage === true,
        showSideImage: page.showSideImage === true || page.showHeroImage === true,
        showPageButton: page.showPageButton === true,
        pageButtonText: page.pageButtonText || "",
        pageButtonLink: page.pageButtonLink || "",
        bannerImage: normalizeMediaRefForStorage(bannerImage.id || bannerImage.url ? bannerImage : emptyMediaRef()),
        sideImage: normalizeMediaRefForStorage(sideImage.id || sideImage.url ? sideImage : emptyMediaRef()),
        sections: serializePageSections(ensurePageSections(page)),
      };
    });
}

function upsertContactSitePages(sections, sitePages) {
  const next = [...(sections || [])];
  const index = next.findIndex((item) => item.sectionName === "contact");
  if (index < 0) return next;

  const existingItems =
    next[index].items && typeof next[index].items === "object" ? next[index].items : {};

  next[index] = {
    ...next[index],
    items: {
      ...existingItems,
      sitePages,
    },
  };

  return next;
}

function findStoredPageMatch(menuPage, storedPages, used) {
  const titleKey = slugify(menuPage.title);
  return storedPages.find((stored) => {
    if (used.has(stored)) return false;
    const storedSlug = stored.slug || slugify(stored.title);
    const menuSlug = menuPage.slug || slugify(menuPage.title);
    if (storedSlug && menuSlug && storedSlug === menuSlug) return true;
    if (titleKey && slugify(stored.title) === titleKey) return true;
    if (stored.link && menuPage.link && stored.link === menuPage.link) return true;
    return false;
  });
}

function buildNavigationPages(headerMenu, footerLinks) {
  const map = new Map();

  (headerMenu || []).forEach((item, index) => {
    const key = `${item.label || "item"}|${item.link || "#"}`;
    if (!map.has(key)) {
      map.set(key, {
        title: item.label || "",
        link: item.link || "#",
        slug: slugify(item.label || ""),
        pageType: item.link?.startsWith("/") && !item.link.startsWith("/#") ? "content" : "link",
        eyebrow: "",
        body: "",
        visible: true,
        showInHeader: true,
        showInFooter: false,
        heroImage: emptyMediaRef(),
        ...defaultPageExtras(),
      });
      return;
    }
    map.get(key).showInHeader = true;
  });

  (footerLinks || []).forEach((item) => {
    const key = `${item.label || "item"}|${item.link || "#"}`;
    if (!map.has(key)) {
      map.set(key, {
        title: item.label || "",
        link: item.link || "#",
        slug: slugify(item.label || ""),
        pageType: item.link?.startsWith("/") && !item.link.startsWith("/#") ? "content" : "link",
        eyebrow: "",
        body: "",
        visible: true,
        showInHeader: false,
        showInFooter: true,
        heroImage: emptyMediaRef(),
        ...defaultPageExtras(),
      });
      return;
    }
    map.get(key).showInFooter = true;
  });

  const list = Array.from(map.values()).filter((item) => item.title);
  if (list.length) return list;

  return [
    { title: "Home", link: "/", slug: "home", pageType: "link", eyebrow: "", body: "", visible: true, showInHeader: true, showInFooter: true, heroImage: emptyMediaRef(), ...defaultPageExtras() },
    { title: "Ministries", link: "#ministries", slug: "ministries", pageType: "link", eyebrow: "", body: "", visible: true, showInHeader: true, showInFooter: false, heroImage: emptyMediaRef(), ...defaultPageExtras() },
    { title: "Updates", link: "#updates", slug: "updates", pageType: "link", eyebrow: "", body: "", visible: true, showInHeader: true, showInFooter: false, heroImage: emptyMediaRef(), ...defaultPageExtras() },
    { title: "Giving", link: "#support", slug: "support", pageType: "link", eyebrow: "", body: "", visible: true, showInHeader: false, showInFooter: true, heroImage: emptyMediaRef(), ...defaultPageExtras() },
    { title: "Contact Us", link: "#contact", slug: "contact", pageType: "link", eyebrow: "", body: "", visible: true, showInHeader: false, showInFooter: true, heroImage: emptyMediaRef(), ...defaultPageExtras() },
  ];
}

function loadSitePages(data, headerMenu, footerLinks) {
  const fromMenus = buildNavigationPages(headerMenu, footerLinks);
  const stored = getStoredSitePagesRaw(data).map((page, index) => normalizeNavigationPage(page, index));

  if (!stored.length) return fromMenus;

  const merged = [];
  const usedStored = new Set();

  fromMenus.forEach((menuPage) => {
    const match = findStoredPageMatch(menuPage, stored, usedStored);
    if (match) {
      usedStored.add(match);
      merged.push({
        ...menuPage,
        ...match,
        pageId: match.pageId || menuPage.pageId,
        parentId: match.parentId ?? menuPage.parentId ?? null,
        menuOrder: match.menuOrder ?? menuPage.menuOrder,
        title: match.title || menuPage.title,
        showInHeader: menuPage.showInHeader || match.showInHeader,
        showInFooter: menuPage.showInFooter || match.showInFooter,
      });
      return;
    }
    merged.push(menuPage);
  });

  stored.forEach((page) => {
    if (!usedStored.has(page)) merged.push(page);
  });

  return ensurePageIds(merged.length ? merged : fromMenus).map((page, index) => normalizeNavigationPage(page, index));
}

/** Keep edited page content on the in-memory CMS record when the API omits sitePages. */
export function applyNavigationPagesToData(data, navigationPages = []) {
  if (!data || !navigationPages.length) return enrichHomePageData(data);

  const sitePages = serializeSitePagesForStorage(navigationPages);

  return enrichHomePageData({
    ...data,
    sitePages,
    sections: upsertContactSitePages(data.sections, sitePages),
  });
}

export function buildFormFromData(data) {
  const enriched = enrichHomePageData(data);
  const hero = getSection(enriched?.sections, "hero");
  const about = getSection(enriched?.sections, "about");
  const services = getSection(enriched?.sections, "services");
  const updates = getSection(enriched?.sections, "products");
  const support = getSection(enriched?.sections, "contact");
  const [heroLine1, heroLine2] = splitHeroTitle(hero?.title);
  const heroImageRef = extractMediaRef(hero?.imageSettings?.image);
  const missionImageRef = extractMediaRef(about?.imageSettings?.image);
  const supportImageRef = extractMediaRef(support?.imageSettings?.image);
  const headerMenu = enriched?.headerSettings?.menuItems?.length
    ? enriched.headerSettings.menuItems
    : [
        { label: "Home", link: "#" },
        { label: "Ministries", link: "#ministries" },
        { label: "Resources", link: "#" },
        { label: "Updates", link: "#updates" },
      ];
  const footerLinks = data?.footerSettings?.footerLinks?.length
    ? data.footerSettings.footerLinks
    : [
        { label: "Who We Are", link: "#" },
        { label: "Leadership", link: "#" },
        { label: "Find a Church", link: "#" },
        { label: "Contact Us", link: "#" },
      ];

  return {
    primaryColor: data?.globalTheme?.primaryColor || "#f08a16",
    secondaryColor: data?.globalTheme?.secondaryColor || "#072b52",
    backgroundColor: data?.globalTheme?.backgroundColor || "#efefea",
    textColor: data?.globalTheme?.textColor || "#1f2530",
    fontFamily: data?.globalTheme?.fontFamily || "Inter, system-ui, sans-serif",
    headingFontFamily: data?.globalTheme?.headingFontFamily || "Georgia, Times New Roman, serif",
    railBg: data?.railSettings?.backgroundColor || "#f08a16",
    railWidth: data?.railSettings?.width || "132px",
    showRailLogo: data?.railSettings?.showLogo !== false,
    headerBg: data?.headerSettings?.backgroundColor || "#14365a",
    headerText: data?.headerSettings?.textColor || "#ffffff",
    headerLogo: extractMediaRef(data?.headerSettings?.logo),
    headerCtaText: data?.headerSettings?.ctaButton?.text || "Give Now",
    headerCtaLink: data?.headerSettings?.ctaButton?.link || "#support",
    headerMenu: headerMenu.map((item) => ({ label: item.label || "", link: item.link || "#" })),
    navigationPages: loadSitePages(enriched, headerMenu, footerLinks),
    heroLine1,
    heroLine2,
    heroSubtitle: hero?.subtitle || sampleHomePage.hero.eyebrow,
    heroDescription: hero?.description || sampleHomePage.hero.description,
    heroImage: {
      id: heroImageRef.id,
      url: heroImageRef.url || hero?.items?.heroImageUrl || "",
    },
    heroSlides: loadHeroSlides(hero, {
      id: heroImageRef.id,
      url: heroImageRef.url || hero?.items?.heroImageUrl || "",
    }),
    heroPrimaryBtnText: hero?.buttonSettings?.text || sampleHomePage.hero.primaryCta.text,
    heroPrimaryBtnLink: hero?.buttonSettings?.link || sampleHomePage.hero.primaryCta.link,
    heroSecondaryBtnText: hero?.secondaryButtonSettings?.text || sampleHomePage.hero.secondaryCta.text,
    heroSecondaryBtnLink: hero?.secondaryButtonSettings?.link || sampleHomePage.hero.secondaryCta.link,
    missionEyebrow: about?.subtitle || sampleHomePage.mission.eyebrow,
    missionTitle: about?.title || sampleHomePage.mission.title,
    missionDescription: about?.description || sampleHomePage.mission.description,
    missionImage: {
      id: missionImageRef.id,
      url: missionImageRef.url || about?.items?.missionImageUrl || "",
    },
    missionBgColor: about?.colorSettings?.backgroundColor || "#072b52",
    missionTextColor: about?.colorSettings?.textColor || "#ffffff",
    missionStats: (about?.statItems?.length ? about.statItems : sampleHomePage.mission.stats).map((item) => ({
      value: item.value || "",
      label: item.label || "",
    })),
    ministriesEyebrow: services?.subtitle || sampleHomePage.ministries.eyebrow,
    ministriesTitle: services?.title || sampleHomePage.ministries.title,
    ministriesCtaText: services?.buttonSettings?.text || sampleHomePage.ministries.ctaText,
    ministriesCtaLink: services?.buttonSettings?.link || "#ministries",
    ministryItems: loadMinistryItems(services).length
      ? loadMinistryItems(services)
      : sampleHomePage.ministries.items.map((item) => ({
          title: item.title,
          description: item.desc || item.description || "",
          buttonText: item.cta || item.buttonText || "Learn More",
          link: "#",
          imageMedia: emptyMediaRef(),
        })),
    updatesEyebrow: updates?.subtitle || sampleHomePage.updates.eyebrow,
    updatesTitle: updates?.title || sampleHomePage.updates.title,
    newsItems: loadNewsItems(updates),
    videoItems: loadVideoItems(updates).length
      ? loadVideoItems(updates)
      : sampleHomePage.updates.videos.map((item) => ({
          title: item.title,
          description: item.meta || item.description || "",
          videoLink: item.link || "",
          thumbnailMedia: emptyMediaRef(),
          videoMedia: emptyMediaRef(),
        })),
    supportEyebrow: support?.subtitle || sampleHomePage.support.eyebrow,
    supportTitle: support?.title || sampleHomePage.support.title,
    supportDescription: support?.description || sampleHomePage.support.description,
    supportImage: {
      id: supportImageRef.id,
      url: supportImageRef.url || support?.items?.backgroundImageUrl || "",
    },
    supportAmounts: (support?.donationItems?.length
      ? support.donationItems
      : sampleHomePage.support.amounts.map((amount) => ({ amount }))
    ).map((item) => ({ amount: item.amount || item })),
    supportButtonText: support?.buttonSettings?.text || sampleHomePage.support.cta,
    supportButtonLink: support?.buttonSettings?.link || "#support",
    homepageBlocks: getHomepageBlocksFromData(enriched),
    homepageBlocksPlacement: getHomepageBlocksPlacementFromData(enriched),
    footerDescription:
      data?.footerSettings?.description ||
      "Seventh-day Adventist Church in Papua New Guinea, proclaiming everlasting hope through worship, education, health, media, and service.",
    footerCopyright: data?.footerSettings?.copyrightText || "© Papua New Guinea Union Mission",
    footerLogo: extractMediaRef(data?.footerSettings?.logo),
    footerBg: data?.footerSettings?.backgroundColor || "#031c39",
    footerText: data?.footerSettings?.textColor || "#d2dbea",
    footerLinks: footerLinks.map((item) => ({ label: item.label || "", link: item.link || "#" })),
    seoMetaTitle: data?.seoSettings?.metaTitle || "",
    seoMetaDescription: data?.seoSettings?.metaDescription || "",
    seoKeywords: data?.seoSettings?.keywords || "",
    seoOgImage: extractMediaRef(data?.seoSettings?.ogImage),
  };
}

function stripMeta(value) {
  if (Array.isArray(value)) return value.map(stripMeta);
  if (!value || typeof value !== "object") return value;
  const output = {};
  Object.entries(value).forEach(([key, nestedValue]) => {
    if (["id", "__component", "documentId", "createdAt", "updatedAt", "publishedAt", "locale", "localizations"].includes(key)) {
      return;
    }
    output[key] = stripMeta(nestedValue);
  });
  return output;
}

function upsertSection(sections, sectionName, patch) {
  const next = [...(sections || [])];
  const index = next.findIndex((item) => item.sectionName === sectionName);
  const existing = index >= 0 ? next[index] : null;
  const merged = {
    displayOrder: patch.displayOrder ?? existing?.displayOrder ?? next.length + 1,
    layoutType: existing?.layoutType ?? patch.layoutType,
    borderRadius: existing?.borderRadius ?? patch.borderRadius,
    containerWidth: existing?.containerWidth ?? patch.containerWidth,
    titleTypography: existing?.titleTypography,
    subtitleTypography: existing?.subtitleTypography,
    bodyTypography: existing?.bodyTypography,
    spacingSettings: existing?.spacingSettings,
    ...patch,
    sectionName,
    isActive: true,
  };

  if (index >= 0) next[index] = merged;
  else next.push(merged);
  return next;
}

export function buildPayloadFromForm(form, existingData) {
  const navigationPages = (form.navigationPages || []).filter((item) => item.title);
  const storedSitePages = serializeSitePagesForStorage(navigationPages);
  const strapiSitePages = serializeSitePagesForStrapiComponent(navigationPages);
  const existingHero = getSection(existingData?.sections, "hero");
  const existingHeroItems =
    existingHero?.items && typeof existingHero.items === "object" ? existingHero.items : {};
  const existingAbout = getSection(existingData?.sections, "about");
  const existingAboutItems =
    existingAbout?.items && typeof existingAbout.items === "object" ? existingAbout.items : {};
  const existingServices = getSection(existingData?.sections, "services");

  const headerMenuFromPages = menuNodesToHeaderItems(buildMenuTree(ensurePageIds(navigationPages)));
  const footerLinksFromPages = navigationPages
    .filter((item) => item.visible !== false && item.showInFooter === true)
    .map((item) => ({
      label: item.title,
      link: item.pageType === "link" ? item.link || "#" : `/${item.slug || slugify(item.title)}`,
    }));

  const ministryItems = form.ministryItems
    .filter((item) => item.title)
    .map((item) => ({
      title: item.title,
      description: item.description,
      buttonText: item.buttonText,
      link: item.link || "#",
      imageMedia: item.imageMedia || emptyMediaRef(),
    }));

  const videoItems = form.videoItems
    .filter((item) => item.title)
    .map((item) => ({
      title: item.title,
      description: item.description,
      videoLink: item.videoLink || "",
      thumbnailMedia: item.thumbnailMedia || emptyMediaRef(),
      videoMedia: item.videoMedia || emptyMediaRef(),
    }));

  const newsItems = form.newsItems
    .filter((item) => item.title)
    .map((item) => ({
      tag: item.tag,
      date: item.date,
      title: item.title,
      imageMedia: item.imageMedia || emptyMediaRef(),
    }));

  const heroSlides = (form.heroSlides || []).filter((slide) => slide.imageMedia?.url || mediaId(slide.imageMedia));
  const primaryHeroImage = heroSlides[0]?.imageMedia || form.heroImage;

  const sections = upsertSection(existingData?.sections || [], "hero", {
    displayOrder: 1,
    title: joinHeroTitle(form.heroLine1, form.heroLine2),
    subtitle: form.heroSubtitle,
    description: form.heroDescription,
    imageSettings: serializeImageSettings(existingHero?.imageSettings, primaryHeroImage),
    items: {
      ...existingHeroItems,
      heroImageUrl: normalizeStoredUrl(primaryHeroImage?.url || form.heroImage?.url || ""),
      heroSlides: heroSlides.map((slide) => ({
        imageUrl: normalizeStoredUrl(slide.imageMedia?.url || ""),
        imageId: mediaId(slide.imageMedia),
        durationSeconds: Number(slide.durationSeconds) > 0 ? Number(slide.durationSeconds) : 5,
      })),
    },
    buttonSettings: mergeButtonSettings(existingHero?.buttonSettings, {
      text: form.heroPrimaryBtnText,
      link: form.heroPrimaryBtnLink,
    }, { backgroundColor: "#f08a16", textColor: "#ffffff" }),
    secondaryButtonSettings: mergeButtonSettings(existingHero?.secondaryButtonSettings, {
      text: form.heroSecondaryBtnText,
      link: form.heroSecondaryBtnLink,
    }, { backgroundColor: "transparent", textColor: "#ffffff" }),
  });

  const sections2 = upsertSection(sections, "about", {
    displayOrder: 2,
    subtitle: form.missionEyebrow,
    title: form.missionTitle,
    description: form.missionDescription,
    imageSettings: serializeImageSettings(existingAbout?.imageSettings, form.missionImage),
    colorSettings: {
      backgroundColor: form.missionBgColor,
      textColor: form.missionTextColor,
    },
    items: {
      ...existingAboutItems,
      missionImageUrl: normalizeStoredUrl(form.missionImage?.url || ""),
    },
    statItems: form.missionStats.filter((item) => item.value && item.label),
  });

  const sections3 = upsertSection(sections2, "services", {
    displayOrder: 3,
    subtitle: form.ministriesEyebrow,
    title: form.ministriesTitle,
    ministryItems: ministryItems.map((item) => ({
      title: item.title,
      description: item.description,
      buttonText: item.buttonText,
      link: item.link,
      image: mediaId(item.imageMedia),
    })),
    items: ministryItems.map((item) => ({
      title: item.title,
      description: item.description,
      buttonText: item.buttonText,
      link: item.link,
      image: normalizeStoredUrl(item.imageMedia?.url || ""),
    })),
    buttonSettings: mergeButtonSettings(existingServices?.buttonSettings, {
      text: form.ministriesCtaText,
      link: form.ministriesCtaLink,
    }, { backgroundColor: "transparent", textColor: "#a85e1f" }),
  });

  const sections4 = upsertSection(sections3, "products", {
    displayOrder: 4,
    subtitle: form.updatesEyebrow,
    title: form.updatesTitle,
    newsItems: newsItems.map((item) => ({
      tag: item.tag,
      date: item.date,
      title: item.title,
      image: mediaId(item.imageMedia),
    })),
    items: newsItems.map((item) => ({
      tag: item.tag,
      date: item.date,
      title: item.title,
      image: normalizeStoredUrl(item.imageMedia?.url || ""),
    })),
    videoItems: videoItems.map((item) => ({
      title: item.title,
      description: item.description,
      link: item.videoLink,
      thumbnail: mediaId(item.thumbnailMedia),
      video: mediaId(item.videoMedia),
    })),
    mediaItems: videoItems.map((item) => ({
      title: item.title,
      description: item.description,
      image: normalizeStoredUrl(item.thumbnailMedia?.url || ""),
      videoUrl: normalizeStoredUrl(item.videoMedia?.url || item.videoLink || ""),
    })),
  });

  const existingContact = getSection(existingData?.sections, "contact");

  const sections5 = upsertSection(sections4, "contact", {
    displayOrder: 5,
    subtitle: form.supportEyebrow,
    title: form.supportTitle,
    description: form.supportDescription,
    imageSettings: serializeImageSettings(existingContact?.imageSettings, form.supportImage),
    items: {
      backgroundImageUrl: normalizeStoredUrl(form.supportImage?.url || ""),
      sitePages: storedSitePages,
      homepageBlocks: serializeHomepageBlocks(form.homepageBlocks || []),
      homepageBlocksPlacement: form.homepageBlocksPlacement || "after-ministries",
    },
    donationItems: form.supportAmounts.filter((item) => item.amount),
    buttonSettings: mergeButtonSettings(existingContact?.buttonSettings, {
      text: form.supportButtonText,
      link: form.supportButtonLink,
    }, { backgroundColor: "#f08a16", textColor: "#ffffff" }),
  });

  return stripMeta({
    globalTheme: serializeGlobalTheme(existingData?.globalTheme, form),
    railSettings: serializeRailSettings(existingData?.railSettings, form),
    headerSettings: {
      ...pickFields(existingData?.headerSettings, ["fontFamily", "stickyHeader"]),
      backgroundColor: form.headerBg,
      textColor: form.headerText,
      logo: mediaId(form.headerLogo),
      menuItems: serializeMenuItems(
        headerMenuFromPages.length ? headerMenuFromPages : form.headerMenu,
      ),
      ctaButton: mergeButtonSettings(existingData?.headerSettings?.ctaButton, {
        text: form.headerCtaText,
        link: form.headerCtaLink,
      }, { backgroundColor: "#0b6f7d", textColor: "#ffffff" }),
    },
    footerSettings: {
      description: form.footerDescription,
      copyrightText: form.footerCopyright,
      logo: mediaId(form.footerLogo),
      footerLinks: serializeMenuItems(
        footerLinksFromPages.length ? footerLinksFromPages : form.footerLinks,
      ),
      socialLinks: serializeSocialLinks(existingData?.footerSettings?.socialLinks),
      backgroundColor: form.footerBg,
      textColor: form.footerText,
    },
    seoSettings: {
      metaTitle: form.seoMetaTitle,
      metaDescription: form.seoMetaDescription,
      keywords: form.seoKeywords,
      ogImage: mediaId(form.seoOgImage),
    },
    sitePages: strapiSitePages,
    sections: serializeSectionsForStrapi(sections5),
  });
}
