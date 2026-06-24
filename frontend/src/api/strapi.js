import { enrichHomePageData, getStoredSitePagesRaw } from "../utils/pageUtils.js";

export const STRAPI_API_URL = import.meta.env.VITE_STRAPI_API_URL || "http://localhost:1337/api";
export const STRAPI_BASE_URL = STRAPI_API_URL.replace(/\/api\/?$/, "");

const REQUEST_TIMEOUT_MS = 15000;

const ROOT_META_KEYS = new Set([
  "documentId",
  "createdAt",
  "updatedAt",
  "publishedAt",
  "locale",
  "localizations",
]);

function hasStoredSitePages(data) {
  if (!data) return false;
  return getStoredSitePagesRaw(data).length > 0;
}

function buildPopulateQuery({ includeSitePages = false } = {}) {
  const params = new URLSearchParams();
  params.set("populate[globalTheme][populate]", "*");
  params.set("populate[railSettings]", "true");
  params.set("populate[headerSettings][populate]", "*");
  params.set("populate[footerSettings][populate]", "*");
  params.set("populate[sections][populate][imageSettings][populate]", "image");
  params.set("populate[sections][populate][ministryItems][populate]", "image");
  params.set("populate[sections][populate][newsItems][populate]", "image");
  params.set("populate[sections][populate][videoItems][populate][thumbnail]", "true");
  params.set("populate[sections][populate][videoItems][populate][video]", "true");
  params.set("populate[sections][populate][colorSettings]", "true");
  params.set("populate[sections][populate][buttonSettings]", "true");
  params.set("populate[sections][populate][secondaryButtonSettings]", "true");
  params.set("populate[sections][populate][statItems]", "true");
  params.set("populate[sections][populate][donationItems]", "true");
  params.set("populate[seoSettings][populate]", "*");
  if (includeSitePages) {
    params.set("populate[sitePages][populate]", "*");
  }
  return params.toString();
}

const fallbackQueries = [
  buildPopulateQuery({ includeSitePages: false }),
  "populate[footerSettings][populate]=*&populate[headerSettings][populate]=*&populate[sections][populate]=*&populate[globalTheme][populate]=*&populate[railSettings]=true&populate[seoSettings][populate]=*",
  "populate[footerSettings][populate]=*",
  "populate=*",
  "",
];

function isNetworkError(error) {
  return (
    error instanceof TypeError &&
    /failed to fetch|networkerror|load failed/i.test(error.message || "")
  );
}

function buildConnectionError() {
  return new Error(
    `Cannot connect to the CMS at ${STRAPI_BASE_URL}. Start the backend with "npm run develop" in the backend folder, then retry.`,
  );
}

async function requestWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (error) {
    if (error?.name === "AbortError") {
      throw new Error(
        `Timed out connecting to the CMS at ${STRAPI_BASE_URL}. Check that Strapi is running, then retry.`,
      );
    }
    if (isNetworkError(error)) {
      throw buildConnectionError();
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

function withStatus(query, status) {
  const params = new URLSearchParams(query || "");
  if (status) params.set("status", status);
  const built = params.toString();
  return built ? `?${built}` : "";
}

async function requestHomePage(query, { apiToken, status } = {}) {
  const suffix = withStatus(query, status);
  const headers = {};
  if (apiToken) {
    headers.Authorization = `Bearer ${apiToken}`;
  }
  return requestWithTimeout(`${STRAPI_API_URL}/home-page${suffix}`, { headers });
}

async function parseErrorMessage(response) {
  try {
    const errorPayload = await response.json();
    return errorPayload?.error?.message || errorPayload?.message || "";
  } catch {
    return "";
  }
}

function isInvalidKeyError(message, key) {
  return /invalid key/i.test(message || "") && new RegExp(key, "i").test(message || "");
}

function omitPayloadKey(data, key) {
  if (!data || typeof data !== "object") return data;
  const next = { ...data };
  delete next[key];
  return next;
}

function pickBestHomePageResult(candidates = []) {
  let bestResult = null;

  for (const enriched of candidates) {
    if (!enriched) continue;
    const hasSitePages = hasStoredSitePages(enriched);
    const hasFooterLinks =
      Array.isArray(enriched?.footerSettings?.footerLinks) && enriched.footerSettings.footerLinks.length > 0;
    const hasSections = Array.isArray(enriched?.sections) && enriched.sections.length > 0;

    if (hasSitePages) return enriched;
    if (hasFooterLinks || hasSections || !bestResult) {
      bestResult = enriched;
    }
    if (hasFooterLinks || hasSections) {
      return enriched;
    }
  }

  return bestResult;
}

async function loadHomePageAttempts({ apiToken, status } = {}) {
  const attempts = [
    buildPopulateQuery({ includeSitePages: true }),
    ...fallbackQueries,
  ];
  let lastStatus = 0;
  const candidates = [];

  for (const query of attempts) {
    const response = await requestHomePage(query, { apiToken, status });
    lastStatus = response.status;

    if (response.status === 404) {
      return { data: null, lastStatus };
    }

    if (response.ok) {
      const payload = await response.json();
      const data = payload?.data || null;
      if (!data) continue;
      candidates.push(enrichHomePageData(data));
    }
  }

  return { data: pickBestHomePageResult(candidates), lastStatus };
}

/** Public website — always prefer the published Strapi record. */
export async function fetchHomePage() {
  const published = await loadHomePageAttempts({ status: "published" });
  if (published.data) return published.data;

  const fallback = await loadHomePageAttempts();
  if (fallback.data) return fallback.data;

  throw new Error(`Failed to fetch homepage data (${published.lastStatus || fallback.lastStatus})`);
}

/** Admin reload — read draft first (latest edits), then published. */
export async function fetchAdminHomePage(apiToken) {
  if (!apiToken) return fetchHomePage();

  const draft = await loadHomePageAttempts({ apiToken, status: "draft" });
  if (draft.data) return draft.data;

  const published = await loadHomePageAttempts({ apiToken, status: "published" });
  if (published.data) return published.data;

  return fetchHomePage();
}

async function putHomePage(homePageData, apiToken, url) {
  return requestWithTimeout(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiToken}`,
    },
    body: JSON.stringify({ data: homePageData }),
  });
}

async function saveHomePageWithMode(homePageData, apiToken, mode = "publish") {
  if (!apiToken) {
    throw new Error("Login required");
  }

  const draftUrl = `${STRAPI_API_URL}/home-page`;
  const publishUrl = `${STRAPI_API_URL}/home-page?status=published`;
  const urls = mode === "publish" ? [publishUrl, draftUrl] : [draftUrl, publishUrl];

  let payloadData = homePageData;
  let lastError = "";
  let lastStatus = 0;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    for (const url of urls) {
      const response = await putHomePage(payloadData, apiToken, url);
      lastStatus = response.status;

      if (response.ok) {
        const payload = await response.json();
        return enrichHomePageData(payload?.data || null);
      }

      lastError = await parseErrorMessage(response);

      if (isInvalidKeyError(lastError, "sitePages") && payloadData.sitePages) {
        payloadData = omitPayloadKey(payloadData, "sitePages");
        break;
      }
    }

    if (!isInvalidKeyError(lastError, "sitePages")) {
      break;
    }
  }

  throw new Error(`Failed to save homepage (${lastStatus})${lastError ? `: ${lastError}` : ""}`);
}

export async function saveHomePageDraft(homePageData, apiToken) {
  return saveHomePageWithMode(homePageData, apiToken, "draft");
}

export async function publishHomePage(homePageData, apiToken) {
  return saveHomePageWithMode(homePageData, apiToken, "publish");
}

/** Save draft then publish so the live website always receives the update. */
export async function saveAndPublishHomePage(homePageData, apiToken) {
  await saveHomePageDraft(homePageData, apiToken);
  return publishHomePage(homePageData, apiToken);
}

export async function updateHomePage(homePageData, apiToken) {
  return saveAndPublishHomePage(homePageData, apiToken);
}

export async function loginAdmin(identifier, password) {
  const response = await requestWithTimeout(`${STRAPI_API_URL}/auth/local`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, password }),
  });

  if (!response.ok) {
    throw new Error("Invalid email/username or password");
  }

  const payload = await response.json();
  return {
    token: payload?.jwt,
    user: payload?.user,
  };
}

export async function uploadMedia(file, token) {
  if (!token) throw new Error("Login required");
  if (!file) throw new Error("No file selected");

  const formData = new FormData();
  formData.append("files", file);

  const response = await requestWithTimeout(`${STRAPI_BASE_URL}/api/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const details = await parseErrorMessage(response);
    throw new Error(`Upload failed (${response.status})${details ? `: ${details}` : ""}`);
  }

  const payload = await response.json();
  const uploaded = Array.isArray(payload) ? payload[0] : payload;
  if (!uploaded?.url) throw new Error("Upload failed: no file returned");
  return uploaded;
}

export async function fetchCurrentUser(token) {
  const response = await requestWithTimeout(`${STRAPI_API_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Session expired");
  }

  return response.json();
}

export { ROOT_META_KEYS };
