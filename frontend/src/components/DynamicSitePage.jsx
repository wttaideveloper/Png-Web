import { getImageUrl } from "../styles/themeUtils";

function paragraphBlocks(body = "") {
  return body
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);
}

export default function DynamicSitePage({ page }) {
  if (!page) return null;

  const bannerUrl = getImageUrl(page.bannerImage || (page.showBannerImage ? page.heroImage : null));
  const sideUrl = getImageUrl(page.sideImage || (page.showSideImage ? page.heroImage : null));
  const showBannerImage = page.showBannerImage === true && Boolean(bannerUrl);
  const showSideImage = page.showSideImage === true && Boolean(sideUrl);
  const heroStyle = showBannerImage
    ? {
        backgroundImage: `linear-gradient(105deg, rgba(3,38,76,0.92), rgba(7,45,81,0.82)), url(${bannerUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : undefined;

  const paragraphs = paragraphBlocks(page.body);
  const pageButtonHref = page.pageButtonLink || (page.link?.startsWith("/") ? page.link : "#");
  const hasPageButton = page.showPageButton === true && (page.pageButtonText || "").trim().length > 0;

  return (
    <article className="site-page">
      <section className="site-page-hero" style={heroStyle}>
        <div className="container">
          {page.eyebrow ? <p className="site-page-eyebrow">{page.eyebrow}</p> : null}
          <h1>{page.title}</h1>
        </div>
      </section>

      <section className="site-page-body">
        <div className="container">
          <div className={`site-page-content-layout${showSideImage ? " has-side-image" : ""}`}>
            <div className="site-page-body-inner content-prose">
              {paragraphs.length ? (
                paragraphs.map((text, index) => <p key={index}>{text}</p>)
              ) : (
                <p className="site-page-empty">This page has no content yet. Add body text in the admin portal under Pages & Menus.</p>
              )}
              {hasPageButton ? (
                <a className="btn btn-orange site-page-action-btn" href={pageButtonHref}>
                  {page.pageButtonText}
                </a>
              ) : null}
            </div>
            {showSideImage ? (
              <aside className="site-page-side-image-wrap" aria-label="Page image">
                <img className="site-page-side-image" src={sideUrl} alt={page.title || "Page image"} />
              </aside>
            ) : null}
          </div>
        </div>
      </section>
    </article>
  );
}
