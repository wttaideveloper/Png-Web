import DynamicSitePage from "../DynamicSitePage";

/** Mini live preview for the page editor. */
export default function PageLivePreview({ page, embedded = false }) {
  if (!page) return null;

  return (
    <div className={`admin-page-live-preview${embedded ? " admin-page-live-preview-embedded" : ""}`}>
      {!embedded ? (
        <div className="admin-page-live-preview-chrome">
          <span />
          <span />
          <span />
          <p>Live preview</p>
        </div>
      ) : null}
      <div className="admin-page-live-preview-frame">
        <DynamicSitePage page={page} />
      </div>
    </div>
  );
}
