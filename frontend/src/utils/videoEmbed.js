export function getYouTubeEmbedUrl(rawUrl = "") {
  if (!rawUrl) return "";
  try {
    const url = new URL(rawUrl);
    const host = url.hostname.toLowerCase();
    if (host.includes("youtu.be")) {
      const id = url.pathname.replace("/", "");
      return id ? `https://www.youtube.com/embed/${id}` : "";
    }
    if (host.includes("youtube.com")) {
      if (url.pathname.startsWith("/embed/")) return rawUrl;
      if (url.pathname.startsWith("/shorts/")) {
        const id = url.pathname.replace("/shorts/", "").split("/")[0];
        return id ? `https://www.youtube.com/embed/${id}` : "";
      }
      const id = url.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : "";
    }
  } catch {
    return "";
  }
  return "";
}

export function normalizeVideoColumnCount(value) {
  const count = Number(value);
  return count === 2 || count === 3 ? count : 1;
}

export function normalizeVideoSlots(section = {}) {
  const columnCount = normalizeVideoColumnCount(section.columnCount);
  let videos = Array.isArray(section.videos) ? section.videos : [];

  if (!videos.length && section.videoUrl) {
    videos = [{ videoUrl: section.videoUrl, caption: section.caption || "" }];
  }

  const normalized = [];
  for (let i = 0; i < columnCount; i += 1) {
    const slot = videos[i] || {};
    normalized.push({
      videoUrl: slot.videoUrl || "",
      caption: slot.caption || "",
    });
  }

  return { columnCount, videos: normalized };
}

export function videoSectionPreview(section = {}) {
  const { columnCount, videos } = normalizeVideoSlots(section);
  const filled = videos.filter((item) => item.videoUrl?.trim()).length;
  if (filled > 1) return `${filled} videos`;
  if (filled === 1) return videos.find((item) => item.videoUrl?.trim())?.caption || "1 video";
  if (columnCount > 1) return `${columnCount} video slots`;
  return "Empty";
}
