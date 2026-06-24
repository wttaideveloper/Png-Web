import { getImageUrl } from "../styles/themeUtils";
import { ensurePageSections } from "../utils/pageSections";
import PageSectionRenderer from "./PageSectionRenderer";

export default function DynamicSitePage({ page }) {
  if (!page) return null;

  const sections = ensurePageSections(page);
  const firstSection = sections[0];
  const bannerUrl = firstSection?.type === "banner" ? getImageUrl(firstSection.image) : "";
  const bannerAsHero = Boolean(bannerUrl);
  const bodySections = bannerAsHero ? sections.slice(1) : sections;

  const heroStyle = bannerAsHero
    ? {
        backgroundImage: `linear-gradient(105deg, rgba(3,38,76,0.88), rgba(7,45,81,0.78)), url(${bannerUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : undefined;

  const heroHeightClass = bannerAsHero ? ` site-page-hero--banner-${firstSection.height || "medium"}` : "";

  return (
    <article className="site-page">
      <section className={`site-page-hero${heroHeightClass}`} style={heroStyle}>
        <div className="container">
          {page.eyebrow ? <p className="site-page-eyebrow">{page.eyebrow}</p> : null}
          <h1>{page.title}</h1>
        </div>
      </section>

      <section className="site-page-body">
        <div className="container">
          {bodySections.length ? (
            <div className="page-blocks">
              {bodySections.map((section, index) => (
                <PageSectionRenderer key={section.id || `${section.type}-${index}`} section={section} />
              ))}
            </div>
          ) : (
            <p className="site-page-empty">This page has no content sections yet.</p>
          )}
        </div>
      </section>
    </article>
  );
}
