import { sampleHomePage } from "../../mock/sampleHomePage";
import { slugify, enrichHomePageData, getStoredSitePagesRaw } from "../../utils/pageUtils";
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

function serializeImageSettings(existingSettings, imageRef) {
  const hasImage = Boolean(mediaId(imageRef) || imageRef?.url);
  return {
    altText: existingSettings?.altText || "",
    image: hasImage ? mediaId(imageRef) ?? null : null,
  };
}

function mergeButtonSettings(existing, { text, link }, defaults = {}) {
  return {
    ...(existing || {}),
    text: text ?? existing?.text ?? defaults.text ?? "",
    link: link ?? existing?.link ?? defaults.link ?? "#",
    backgroundColor: existing?.backgroundColor ?? defaults.backgroundColor,
    textColor: existing?.textColor ?? defaults.textColor,
    borderRadius: existing?.borderRadius,
    padding: existing?.padding,
  };
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

function normalizeNavigationPage(page) {
  const slug = page.slug || slugify(page.title);
  const pageType = page.pageType || "content";
  return {
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
        title: page.title,
        slug,
        link: pageType === "link" ? page.link || "#" : `/${slug}`,
        pageType,
        eyebrow: page.eyebrow || "",
        body: page.body || "",
        visible: page.visible !== false,
        showInHeader: page.showInHeader !== false,
        showInFooter: page.showInFooter === true,
        heroImage: primaryImage.id || primaryImage.url ? primaryImage : emptyMediaRef(),
        showBannerImage: page.showBannerImage === true,
        showSideImage: page.showSideImage === true || page.showHeroImage === true,
        showPageButton: page.showPageButton === true,
        pageButtonText: page.pageButtonText || "",
        pageButtonLink: page.pageButtonLink || "",
        bannerImage: bannerImage.id || bannerImage.url ? bannerImage : emptyMediaRef(),
        sideImage: sideImage.id || sideImage.url ? sideImage : emptyMediaRef(),
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
  const stored = getStoredSitePagesRaw(data).map((page) => normalizeNavigationPage(page));

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

  return merged.length ? merged : fromMenus;
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
    if (["id", "documentId", "createdAt", "updatedAt", "publishedAt"].includes(key)) return;
    output[key] = stripMeta(nestedValue);
  });
  return output;
}

function upsertSection(sections, sectionName, patch) {
  const next = [...(sections || [])];
  const index = next.findIndex((item) => item.sectionName === sectionName);
  if (index >= 0) next[index] = { ...next[index], ...patch, sectionName, isActive: true };
  else next.push({ sectionName, isActive: true, displayOrder: next.length + 1, ...patch });
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

  const headerMenuFromPages = navigationPages
    .filter((item) => item.visible !== false && item.showInHeader !== false)
    .map((item) => ({
      label: item.title,
      link: item.pageType === "link" ? item.link || "#" : `/${item.slug || slugify(item.title)}`,
    }));
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

  const sections = upsertSection(existingData?.sections || [], "hero", {
    displayOrder: 1,
    title: joinHeroTitle(form.heroLine1, form.heroLine2),
    subtitle: form.heroSubtitle,
    description: form.heroDescription,
    imageSettings: serializeImageSettings(existingHero?.imageSettings, form.heroImage),
    items: {
      ...existingHeroItems,
      heroImageUrl: form.heroImage?.url || "",
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
      ...(existingAbout?.colorSettings || {}),
      backgroundColor: form.missionBgColor,
      textColor: form.missionTextColor,
    },
    items: {
      ...existingAboutItems,
      missionImageUrl: form.missionImage?.url || "",
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
      image: item.imageMedia?.url || "",
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
      image: item.imageMedia?.url || "",
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
      image: item.thumbnailMedia?.url || "",
      videoUrl: item.videoMedia?.url || item.videoLink || "",
    })),
  });

  const existingContact = getSection(existingData?.sections, "contact");
  const existingContactItems =
    existingContact?.items && typeof existingContact.items === "object" ? existingContact.items : {};

  const sections5 = upsertSection(sections4, "contact", {
    displayOrder: 5,
    subtitle: form.supportEyebrow,
    title: form.supportTitle,
    description: form.supportDescription,
    imageSettings: serializeImageSettings(existingContact?.imageSettings, form.supportImage),
    items: {
      ...existingContactItems,
      backgroundImageUrl: form.supportImage?.url || "",
      sitePages: storedSitePages,
    },
    donationItems: form.supportAmounts.filter((item) => item.amount),
    buttonSettings: mergeButtonSettings(existingContact?.buttonSettings, {
      text: form.supportButtonText,
      link: form.supportButtonLink,
    }, { backgroundColor: "#f08a16", textColor: "#ffffff" }),
  });

  return stripMeta({
    globalTheme: {
      ...(existingData?.globalTheme || {}),
      primaryColor: form.primaryColor,
      secondaryColor: form.secondaryColor,
      backgroundColor: form.backgroundColor,
      textColor: form.textColor,
      fontFamily: form.fontFamily,
      headingFontFamily: form.headingFontFamily,
    },
    railSettings: {
      ...(existingData?.railSettings || {}),
      backgroundColor: form.railBg,
      width: form.railWidth,
      showLogo: form.showRailLogo,
    },
    headerSettings: {
      ...(existingData?.headerSettings || {}),
      backgroundColor: form.headerBg,
      textColor: form.headerText,
      logo: mediaId(form.headerLogo),
      menuItems: headerMenuFromPages.length
        ? headerMenuFromPages
        : form.headerMenu.filter((item) => item.label),
      ctaButton: mergeButtonSettings(existingData?.headerSettings?.ctaButton, {
        text: form.headerCtaText,
        link: form.headerCtaLink,
      }, { backgroundColor: "#0b6f7d", textColor: "#ffffff" }),
    },
    footerSettings: {
      ...(existingData?.footerSettings || {}),
      description: form.footerDescription,
      copyrightText: form.footerCopyright,
      logo: mediaId(form.footerLogo),
      footerLinks: footerLinksFromPages.length
        ? footerLinksFromPages
        : form.footerLinks.filter((item) => item.label),
      backgroundColor: form.footerBg,
      textColor: form.footerText,
    },
    seoSettings: {
      ...(existingData?.seoSettings || {}),
      metaTitle: form.seoMetaTitle,
      metaDescription: form.seoMetaDescription,
      keywords: form.seoKeywords,
      ogImage: mediaId(form.seoOgImage),
    },
    sitePages: strapiSitePages,
    sections: sections5,
  });
}
