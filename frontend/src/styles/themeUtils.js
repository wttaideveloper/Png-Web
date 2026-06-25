export const fallbackTheme = {
  primaryColor: "#f08a16",
  secondaryColor: "#072b52",
  accentOrange: "#f08a16",
  navyColor: "#072b52",
  tealColor: "#0b6f7d",
  backgroundColor: "#efefea",
  textColor: "#1f2530",
  fontFamily: "Inter, system-ui, sans-serif",
  headingFontFamily: "Georgia, Times New Roman, serif",
  headingFontSize: "2.8rem",
  bodyFontSize: "1rem",
  borderRadius: "0px",
  containerWidth: "1180px",
  sectionSpacing: "80px",
  seventhRailColor: "#f08a16",
  seventhRailWidth: "132px",
};

const toUnit = (value, unit = "px") => {
  if (value === null || value === undefined || value === "") return undefined;
  if (typeof value === "number") return `${value}${unit}`;
  return value;
};

export const parseButtonStyle = (button) => {
  const styles = button || {};
  return {
    backgroundColor: styles.backgroundColor,
    color: styles.textColor,
    borderRadius: toUnit(styles.borderRadius),
    padding: styles.padding,
    fontFamily: styles.fontFamily,
    fontSize: toUnit(styles.fontSize),
    fontWeight: styles.fontWeight,
    border: styles.backgroundColor === "transparent" ? "1px solid currentColor" : undefined,
  };
};

export const parseTypography = (typography) => {
  const styles = typography || {};
  return {
    fontFamily: styles.fontFamily,
    fontSize: toUnit(styles.fontSize),
    fontWeight: styles.fontWeight,
    lineHeight: styles.lineHeight,
  };
};

export const parseSpacing = (spacing) => {
  const styles = spacing || {};
  return {
    padding: styles.padding,
    margin: styles.margin,
  };
};

export const parseSectionStyle = (section) => {
  if (!section) return {};
  const colorSettings = section.colorSettings || {};
  return {
    backgroundColor: colorSettings.backgroundColor,
    color: colorSettings.textColor,
    borderRadius: toUnit(section.borderRadius),
    ...parseSpacing(section.spacingSettings),
  };
};

export const hexToRgba = (hex, alpha = 1) => {
  if (!hex || typeof hex !== "string" || !hex.startsWith("#")) return hex;
  const normalized = hex.replace("#", "");
  const expanded =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => char + char)
          .join("")
      : normalized;
  if (expanded.length !== 6) return hex;
  const red = Number.parseInt(expanded.slice(0, 2), 16);
  const green = Number.parseInt(expanded.slice(2, 4), 16);
  const blue = Number.parseInt(expanded.slice(4, 6), 16);
  if ([red, green, blue].some((value) => Number.isNaN(value))) return hex;
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
};

export const applyThemeToDocument = (theme, railSettings) => {
  const merged = { ...fallbackTheme, ...(theme || {}) };
  const rail = railSettings || {};
  const root = document.documentElement;

  root.style.setProperty("--primary-color", merged.primaryColor);
  root.style.setProperty("--secondary-color", merged.secondaryColor);
  root.style.setProperty("--orange", merged.accentOrange || merged.primaryColor);
  root.style.setProperty("--navy", merged.navyColor || merged.secondaryColor);
  root.style.setProperty("--teal", merged.tealColor || "#0b6f7d");
  root.style.setProperty("--background-color", merged.backgroundColor);
  root.style.setProperty("--text-color", merged.textColor);
  root.style.setProperty("--font-family", merged.fontFamily);
  root.style.setProperty("--heading-font-family", merged.headingFontFamily || "Georgia, serif");
  root.style.setProperty("--heading-font-size", merged.headingFontSize);
  root.style.setProperty("--body-font-size", merged.bodyFontSize);
  root.style.setProperty("--border-radius", merged.borderRadius);
  root.style.setProperty("--container-width", merged.containerWidth);
  root.style.setProperty("--section-spacing", merged.sectionSpacing);
  root.style.setProperty("--seventh-rail-color", rail.backgroundColor || merged.seventhRailColor);
  root.style.setProperty("--seventh-rail-width", rail.width || merged.seventhRailWidth);
};

const MEDIA_HOST = (import.meta.env.VITE_STRAPI_API_URL || "http://localhost:1337/api").replace(/\/api\/?$/, "");

function resolveMediaSource(image) {
  if (image == null) return "";
  if (typeof image === "string") return image;
  if (typeof image === "number") return "";

  return (
    image?.url ||
    image?.data?.attributes?.url ||
    image?.formats?.medium?.url ||
    image?.formats?.large?.url ||
    ""
  );
}

export const getImageUrl = (image, fallbackUrl = "") => {
  const source = resolveMediaSource(image) || (typeof fallbackUrl === "string" ? fallbackUrl : resolveMediaSource(fallbackUrl));

  if (!source) return "";

  if (source.startsWith("http")) return source;

  return `${MEDIA_HOST}${source}`;
};

export const extractMediaRef = (media) => {
  if (!media) return { id: null, url: "" };
  if (typeof media === "number") return { id: media, url: "" };
  if (typeof media === "string") return { id: null, url: getImageUrl(media) };

  const id = media.id || media.data?.id || media.data?.attributes?.id || null;
  const url = getImageUrl(media);
  return { id, url };
};

export const emptyMediaRef = () => ({ id: null, url: "" });

export const mergeItems = (componentItems, jsonItems, fallback = []) => {
  if (Array.isArray(componentItems) && componentItems.length) return componentItems;

  if (Array.isArray(jsonItems) && jsonItems.length) return jsonItems;

  if (typeof jsonItems === "string") {
    try {
      const parsed = JSON.parse(jsonItems);
      if (Array.isArray(parsed) && parsed.length) return parsed;
    } catch {
      return fallback;
    }
  }

  return fallback;
};
