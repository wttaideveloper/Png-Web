const FOOTER_GROUP_RULES = [
  {
    title: "ABOUT",
    match: (label) => /who we are|leadership|history|about us|about/i.test(label),
  },
  {
    title: "MINISTRIES",
    match: (label) => /education|health|adra|youth|ministr|evangel/i.test(label),
  },
  {
    title: "CONNECT",
    match: (label) => /find a church|contact|events|calendar|giving|support|donate/i.test(label),
  },
];

export function formatCopyright(text) {
  const fallback = "© Papua New Guinea Union Mission";
  if (!text?.trim()) return fallback;

  let value = text.trim();
  if (/^c\s+Papua New Guinea/i.test(value)) {
    value = value.replace(/^c\b/, "©");
  } else if (!/[©(c)]/i.test(value) && /^Papua New Guinea/i.test(value)) {
    value = `© ${value}`;
  }
  return value;
}

export function resolveFooterLinks(settings, sitePages = []) {
  const fromSettings = (settings?.footerLinks || []).filter((item) => item?.label);
  const fromSitePages = (sitePages || [])
    .filter((page) => page?.title && page.visible !== false && page.showInFooter === true)
    .map((page) => ({
      label: page.title,
      link: page.link || (page.pageType === "link" ? "#" : `/${page.slug || ""}`),
    }));

  if (fromSitePages.length) return fromSitePages;
  return fromSettings;
}

export function groupFooterLinks(links = []) {
  if (!links.length) return [];

  const groups = FOOTER_GROUP_RULES.map((rule) => ({ title: rule.title, links: [] }));
  const unmatched = [];

  links.forEach((link) => {
    const label = link.label || "";
    const rule = FOOTER_GROUP_RULES.find((entry) => entry.match(label));
    if (rule) {
      groups.find((group) => group.title === rule.title).links.push(link);
    } else {
      unmatched.push(link);
    }
  });

  const filled = groups.filter((group) => group.links.length);
  if (unmatched.length) {
    filled.push({ title: "MORE", links: unmatched });
  }

  if (filled.length) return filled;

  return [{ title: "QUICK LINKS", links }];
}
