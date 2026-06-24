import DynamicSitePage from "../DynamicSitePage";

/** Mini live preview for the page editor. */
export default function PageLivePreview({ page }) {
  if (!page) return null;

  return (
    <div className="admin-page-live-preview">
      <div className="admin-page-live-preview-chrome">
        <span />
        <span />
        <span />
        <p>Live preview</p>
      </div>
      <div className="admin-page-live-preview-frame">
        <DynamicSitePage page={page} />
      </div>
    </div>
  );
}
