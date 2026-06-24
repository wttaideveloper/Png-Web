import { useEffect, useRef, useState } from "react";
import { ExternalLink, Eye, FileText, Layout, Settings2, X } from "lucide-react";
import { ensurePageSections } from "../../utils/pageSections";
import { pagePublicLink } from "../../utils/pageUtils";
import PageLivePreview from "./PageLivePreview";
import PageSectionBuilder from "./PageSectionBuilder";
import { TextInput } from "./editorUi";

const TABS = [
  { id: "basics", label: "Basics", icon: Settings2 },
  { id: "content", label: "Build page", icon: Layout },
  { id: "preview", label: "Preview", icon: Eye },
];

function ToggleChip({ label, checked, onChange }) {
  return (
    <label className={`admin-toggle-chip ${checked ? "admin-toggle-chip-on" : ""}`}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  );
}

export default function PageEditModal({ page, pageIndex, onUpdate, onClose, apiToken, isNew }) {
  const [tab, setTab] = useState(isNew ? "content" : "basics");
  const [activeSection, setActiveSection] = useState(0);
  const backdropPressedRef = useRef(false);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        event.stopPropagation();
      }
    }
    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, []);

  if (!page) return null;

  const isContent = page.pageType !== "link";
  const publicLink = pagePublicLink(page);
  const sections = ensurePageSections(page);

  function updateSections(nextSections) {
    onUpdate(pageIndex, "sections", nextSections);
  }

  const previewPage = { ...page, sections };

  function handleBackdropPointerDown(event) {
    backdropPressedRef.current = event.target === event.currentTarget;
  }

  function handleBackdropClick(event) {
    if (backdropPressedRef.current && event.target === event.currentTarget) {
      onClose();
    }
    backdropPressedRef.current = false;
  }

  return (
    <div
      className="admin-modal-backdrop"
      onPointerDown={handleBackdropPointerDown}
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        className="admin-modal admin-modal-xl"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="page-edit-title"
      >
        <div className="admin-modal-header">
          <div>
            <p className="admin-modal-kicker">Page editor</p>
            <h2 id="page-edit-title">{page.title || "Untitled page"}</h2>
          </div>
          <div className="admin-modal-header-actions">
            <a href={publicLink} target="_blank" rel="noreferrer" className="admin-ghost-btn admin-modal-preview-btn">
              <ExternalLink size={16} />
              Open live page
            </a>
            <button type="button" className="admin-icon-btn" onClick={onClose} aria-label="Close">
              <X size={18} />
            </button>
          </div>
        </div>

        {isNew ? (
          <div className="admin-page-welcome-banner">
            <strong>Welcome!</strong> Add your content below, then click <em>Done</em> and press <em>Publish Live</em> to show it on the website.
          </div>
        ) : null}

        <div className="admin-page-editor-tabs">
          {TABS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                className={`admin-page-editor-tab${tab === item.id ? " active" : ""}`}
                onClick={() => setTab(item.id)}
              >
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="admin-modal-body admin-page-editor-body">
          {tab === "basics" ? (
            <section className="admin-page-settings-card admin-page-settings-card-simple">
              <TextInput
                label="Page title"
                value={page.title || ""}
                onChange={(v) => onUpdate(pageIndex, "title", v)}
                placeholder="e.g. Sabbath School"
                hint="Shown at the top of the page and in the menu."
              />
              {isContent ? (
                <>
                  <TextInput
                    label="Web address (URL)"
                    value={page.slug || ""}
                    onChange={(v) => onUpdate(pageIndex, "slug", v)}
                    placeholder="sabbath-school"
                    hint={`Visitors will find this page at ${publicLink}`}
                  />
                  <TextInput
                    label="Small label above title (optional)"
                    value={page.eyebrow || ""}
                    onChange={(v) => onUpdate(pageIndex, "eyebrow", v)}
                    placeholder="MINISTRIES"
                  />
                </>
              ) : (
                <TextInput label="Link URL" value={page.link || ""} onChange={(v) => onUpdate(pageIndex, "link", v)} placeholder="https://..." />
              )}

              <div className="admin-page-settings-toggles">
                <ToggleChip label="✓ Published (visible on site)" checked={page.visible !== false} onChange={(v) => onUpdate(pageIndex, "visible", v)} />
                <ToggleChip label="Show in top menu" checked={page.showInHeader !== false} onChange={(v) => onUpdate(pageIndex, "showInHeader", v)} />
                <ToggleChip label="Show in footer" checked={page.showInFooter === true} onChange={(v) => onUpdate(pageIndex, "showInFooter", v)} />
              </div>

              <button type="button" className="admin-ghost-btn" onClick={() => setTab("content")}>
                Next: Build page content →
              </button>
            </section>
          ) : null}

          {tab === "content" && isContent ? (
            <PageSectionBuilder
              sections={sections}
              onChange={updateSections}
              apiToken={apiToken}
              activeIndex={activeSection}
              onActiveIndexChange={setActiveSection}
            />
          ) : null}

          {tab === "preview" && isContent ? <PageLivePreview page={previewPage} /> : null}

          {!isContent && tab !== "basics" ? (
            <div className="admin-page-link-only-note">
              <p>This is a menu link only. Go to Basics to change the URL, or convert to a full page.</p>
              <button type="button" className="admin-primary-btn" onClick={() => onUpdate(pageIndex, "pageType", "content")}>
                Convert to full page
              </button>
            </div>
          ) : null}
        </div>

        <div className="admin-modal-footer">
          <p className="admin-modal-footer-hint">
            <FileText size={14} style={{ display: "inline", verticalAlign: "middle" }} /> When finished, click Done then <strong>Save Draft</strong> → <strong>Publish Live</strong> in the top bar.
          </p>
          <button type="button" className="admin-primary-btn" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
