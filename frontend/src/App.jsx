import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { fetchHomePage } from "./api/strapi";
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PngumHomePage from "./components/homepage/PngumHomePage";
import DynamicSitePage from "./components/DynamicSitePage";
import { applyThemeToDocument, fallbackTheme, getImageUrl } from "./styles/themeUtils";
import { findSitePageByPath } from "./utils/pageUtils";

const AdminPortal = lazy(() => import("./components/AdminPortal"));

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [pathname, setPathname] = useState(() => window.location.pathname);

  useEffect(() => {
    function onPopState() {
      setPathname(window.location.pathname);
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadPage() {
      setLoading(true);
      setError("");

      try {
        const result = await fetchHomePage();
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to load homepage");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadPage();

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const theme = useMemo(() => ({ ...fallbackTheme, ...(data?.globalTheme || {}) }), [data]);
  const railSettings = data?.railSettings || { backgroundColor: "#f08a16", width: "132px", showLogo: true };

  useEffect(() => {
    applyThemeToDocument(theme, railSettings);
  }, [theme, railSettings]);

  useEffect(() => {
    const seo = data?.seoSettings;
    if (!seo) return;

    if (seo.metaTitle) {
      document.title = seo.metaTitle;
    }

    const setMeta = (name, content) => {
      if (!content) return;
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    setMeta("description", seo.metaDescription);
    setMeta("keywords", seo.keywords);

    const ogImage = getImageUrl(seo.ogImage?.url || seo.ogImage);
    if (ogImage) {
      let ogTag = document.querySelector('meta[property="og:image"]');
      if (!ogTag) {
        ogTag = document.createElement("meta");
        ogTag.setAttribute("property", "og:image");
        document.head.appendChild(ogTag);
      }
      ogTag.setAttribute("content", ogImage);
    }
  }, [data?.seoSettings]);

  if (loading) return <LoadingState />;
  if (error) {
    return <ErrorState message={error} onRetry={() => setReloadKey((key) => key + 1)} />;
  }

  if (pathname === "/admin-portal") {
    return (
      <Suspense fallback={<LoadingState />}>
        <AdminPortal data={data} onSaved={setData} />
      </Suspense>
    );
  }

  const sitePages = data?.sitePages || [];
  const activePage = findSitePageByPath(sitePages, pathname);

  return (
    <div className={`page-shell${railSettings.showLogo !== false ? " page-shell--with-rail" : ""}`}>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <main id="main-content">
        <Header settings={data?.headerSettings} />
        <div className="page-sections">
          {activePage ? <DynamicSitePage page={activePage} /> : <PngumHomePage sections={data?.sections || []} />}
        </div>
        <Footer settings={data?.footerSettings} sitePages={sitePages} />
      </main>
      {railSettings.showLogo !== false && (
        <aside
          className="seventh-rail"
          aria-label="Seventh rail"
          style={{ backgroundColor: railSettings.backgroundColor || "var(--orange)" }}
        >
          <div className="seventh-logo" aria-label="Seventh-day Adventist logo" style={{ color: railSettings.logoColor || "#fff" }}>
            <svg viewBox="0 0 120 120" role="img" aria-hidden="true">
              <path d="M58 18c-8 10-12 18-12 28 0 7 2 13 7 18-14-8-20-19-20-31 0-10 6-19 18-30l7 15z" />
              <path d="M74 22c9 8 14 16 14 25 0 8-4 15-11 21 4-6 5-12 3-18-2-8-7-15-14-22l8-6z" />
              <path d="M60 55c4 7 6 13 6 19 0 8-3 15-9 21 2-6 2-12 0-18-2-6-6-12-11-18l14-4z" />
              <path d="M23 85l29-4h16l29 4-8 11H31l-8-11z" />
              <path d="M58 72h4v32h-4z" />
            </svg>
          </div>
        </aside>
      )}
    </div>
  );
}
