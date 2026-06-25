import { getYouTubeEmbedUrl } from "./videoEmbed";

export function extractYouTubeVideoId(rawUrl = "") {
  if (!rawUrl) return "";
  try {
    const url = new URL(rawUrl);
    const host = url.hostname.toLowerCase();
    if (host.includes("youtu.be")) {
      return url.pathname.replace("/", "").split("/")[0] || "";
    }
    if (host.includes("youtube.com")) {
      if (url.pathname.startsWith("/embed/")) {
        return url.pathname.replace("/embed/", "").split("/")[0] || "";
      }
      if (url.pathname.startsWith("/shorts/")) {
        return url.pathname.replace("/shorts/", "").split("/")[0] || "";
      }
      return url.searchParams.get("v") || "";
    }
  } catch {
    return "";
  }
  return "";
}

function formatViewCount(value) {
  const count = Number(value);
  if (!Number.isFinite(count) || count < 0) return "";
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1).replace(/\.0$/, "")}M views`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1).replace(/\.0$/, "")}K views`;
  return `${count} views`;
}

async function fetchOEmbedMeta(videoUrl) {
  const endpoint = `https://www.youtube.com/oembed?url=${encodeURIComponent(videoUrl)}&format=json`;
  const response = await fetch(endpoint);
  if (!response.ok) throw new Error("Could not read YouTube video details");
  const payload = await response.json();
  return {
    title: payload?.title || "",
    authorName: payload?.author_name || "",
    thumbnailUrl: payload?.thumbnail_url || "",
  };
}

async function fetchStatisticsMeta(videoId) {
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
  if (!apiKey || !videoId) return null;

  const endpoint = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${encodeURIComponent(videoId)}&key=${encodeURIComponent(apiKey)}`;
  const response = await fetch(endpoint);
  if (!response.ok) return null;

  const payload = await response.json();
  const item = payload?.items?.[0];
  if (!item) return null;

  const views = formatViewCount(item?.statistics?.viewCount);
  const channel = item?.snippet?.channelTitle || "";
  const description = views && channel ? `${channel} · ${views}` : views || channel;

  return {
    title: item?.snippet?.title || "",
    description,
    thumbnailUrl:
      item?.snippet?.thumbnails?.high?.url ||
      item?.snippet?.thumbnails?.medium?.url ||
      item?.snippet?.thumbnails?.default?.url ||
      "",
  };
}

/** Fetch title, channel/views meta, and thumbnail from a YouTube URL. */
export async function fetchYouTubeMeta(rawUrl = "") {
  const videoUrl = (rawUrl || "").trim();
  if (!videoUrl || !getYouTubeEmbedUrl(videoUrl)) {
    throw new Error("Enter a valid YouTube link");
  }

  const videoId = extractYouTubeVideoId(videoUrl);
  const stats = await fetchStatisticsMeta(videoId);
  if (stats?.title) return stats;

  const oembed = await fetchOEmbedMeta(videoUrl);
  const description = oembed.authorName ? `${oembed.authorName}` : "";

  return {
    title: oembed.title,
    description,
    thumbnailUrl: oembed.thumbnailUrl,
  };
}
