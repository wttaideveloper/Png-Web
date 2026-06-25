import { useEffect, useRef, useState } from "react";
import {
  Check,
  ExternalLink,
  Eye,
  EyeOff,
  HelpCircle,
  Layout,
  PanelRightClose,
  PanelRightOpen,
  Settings2,
  X,
} from "lucide-react";
import { ensurePageSections, sectionCountLabel, sectionsFromQuickAdd, sectionsFromTemplate } from "../../utils/pageSections";
import { pagePublicLink } from "../../utils/pageUtils";
import PageLivePreview from "./PageLivePreview";
import PageSamplePicker from "./PageSamplePicker";
import PageSectionBuilder from "./PageSectionBuilder";
import { TextInput } from "./editorUi";

const STEPS = [
  { id: "basics", label: "Settings", icon: Settings2 },
  { id: "content", label: "Content", icon: Layout },
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
  const [tab, setTab] = useState("content");
  const [activeSection, setActiveSection] = useState(0);
  const [showPreview, setShowPreview] = useState(true);
  const [showHelp, setShowHelp] = useState(isNew);
  const backdropPressedRef = useRef(false);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") event.stopPropagation();
    }
    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, []);

  if (!page) return null;

  const isContent = page.pageType !== "link";
  const publicLink = pagePublicLink(page);
  const sections = ensurePageSections(page);
  const isLive = page.visible !== false;

  function updateSections(nextSections) {
    onUpdate(pageIndex, "sections", nextSections);
  }

  function applyTemplate(templateId, mode = "append") {
    const sample = sectionsFromTemplate(templateId);
    if (!sample.length) return;
    if (mode === "replace" || !sections.length) {
      updateSections(sample);
      setActiveSection(0);
      return;
    }
    const next = [...sections, ...sample];
    updateSections(next);
    setActiveSection(next.length - 1);
  }

  function applyQuickAdd(quickAddId) {
    const sample = sectionsFromQuickAdd(quickAddId);
    if (!sample.length) return;
    const next = [...sections, ...sample];
    updateSections(next);
    setActiveSection(next.length - 1);
  }

  const previewPage = { ...page, sections };

  function handleBackdropPointerDown(event) {
    backdropPressedRef.current = event.target === event.currentTarget;
  }

  function handleBackdropClick(event) {
    if (backdropPressedRef.current && event.target === event.currentTarget) onClose();
    backdropPressedRef.current = false;
  }

  return (
    <div
      className="admin-modal-backdrop admin-page-editor-backdrop"
      onPointerDown={handleBackdropPointerDown}
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        className="admin-modal admin-page-editor-studio"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="page-edit-title"
      >
        <header className="admin-page-editor-topbar">
          <div className="admin-page-editor-topbar-left">
            <button type="button" className="admin-page-editor-close" onClick={onClose} aria-label="Close">
              <X size={18} />
            </button>
            <div className="admin-page-editor-title-wrap">
              <h2 id="page-edit-title">{page.title || "Untitled page"}</h2>
              <p className="admin-page-editor-subline">
                <span className={`admin-page-editor-status ${isLive ? "is-live" : "is-hidden"}`}>
                  {isLive ? "Live" : "Hidden"}
                </span>
                {isContent ? <span>{sectionCountLabel(page)}</span> : null}
              </p>
            </div>
          </div>

          <nav className="admin-page-editor-segments" aria-label="Editor steps">
            {STEPS.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`admin-page-editor-segment${tab === item.id ? " active" : ""}`}
                  onClick={() => setTab(item.id)}
                >
                  <Icon size={15} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="admin-page-editor-topbar-right">
            {isContent && tab === "content" ? (
              <button
                type="button"
                className="admin-page-editor-tool-btn admin-page-editor-tool-btn-icon"
                onClick={() => setShowPreview((open) => !open)}
                title={showPreview ? "Hide preview" : "Show preview"}
                aria-label={showPreview ? "Hide preview" : "Show preview"}
              >
                {showPreview ? <PanelRightClose size={18} /> : <PanelRightOpen size={18} />}
              </button>
            ) : null}
            <a href={publicLink} target="_blank" rel="noreferrer" className="admin-page-editor-tool-btn" title="Open live page">
              <ExternalLink size={16} />
              <span className="admin-page-editor-tool-label">View</span>
            </a>
            <button type="button" className="admin-primary-btn admin-page-editor-done" onClick={onClose}>
              <Check size={16} />
              Done
            </button>
          </div>
        </header>

        {showHelp && tab === "content" && isContent ? (
          <div className="admin-page-editor-helpbar">
            <HelpCircle size={16} />
            <p>
              <strong>How it works:</strong> Pick a section on the left → edit in the center → check the preview on the right → click <strong>Save to Website</strong> when done.
            </p>
            <button type="button" className="admin-page-editor-helpbar-dismiss" onClick={() => setShowHelp(false)} aria-label="Dismiss">
              <X size={14} />
            </button>
          </div>
        ) : null}

        <div className={`admin-page-editor-body${tab === "content" && isContent && showPreview ? " has-preview" : ""}`}>
          {tab === "basics" ? (
            <div className="admin-page-editor-basics-grid">
              <section className="admin-page-settings-card admin-page-settings-card-modern">
                <h3>Page settings</h3>
                <p className="admin-page-settings-lead">Set the page name, web address, and where it appears on your site.</p>
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
                  <ToggleChip label="Published on website" checked={page.visible !== false} onChange={(v) => onUpdate(pageIndex, "visible", v)} />
                  <ToggleChip label="Show in top menu" checked={page.showInHeader !== false} onChange={(v) => onUpdate(pageIndex, "showInHeader", v)} />
                  <ToggleChip label="Show in footer" checked={page.showInFooter === true} onChange={(v) => onUpdate(pageIndex, "showInFooter", v)} />
                </div>

                <button type="button" className="admin-primary-btn admin-page-editor-next-btn" onClick={() => setTab("content")}>
                  Go to content editor
                </button>
              </section>

              <aside className="admin-page-editor-tips-card">
                <h4>Tips</h4>
                <ul>
                  <li>Short titles work best in the menu.</li>
                  <li>Use simple URLs like <code>sabbath-school</code>.</li>
                  <li>Hide the page while editing, then publish when ready.</li>
                </ul>
              </aside>
            </div>
          ) : null}

          {tab === "content" && isContent ? (
            <div className="admin-page-editor-workspace">
              <div className="admin-page-editor-canvas">
                {sections.length ? (
                  <PageSamplePicker
                    variant="compact"
                    collapsible
                    hasSections
                    onSelectTemplate={applyTemplate}
                    onApplyQuickAdd={applyQuickAdd}
                  />
                ) : null}
                <PageSectionBuilder
                  sections={sections}
                  onChange={updateSections}
                  apiToken={apiToken}
                  activeIndex={activeSection}
                  onActiveIndexChange={setActiveSection}
                />
              </div>

              {showPreview ? (
                <aside className="admin-page-editor-preview-pane">
                  <div className="admin-page-editor-preview-head">
                    <Eye size={15} />
                    <strong>Preview</strong>
                  </div>
                  <PageLivePreview page={previewPage} embedded />
                </aside>
              ) : null}
            </div>
          ) : null}

          {!isContent && tab !== "basics" ? (
            <div className="admin-page-link-only-note">
              <p>This is a menu link only. Go to Settings to change the URL, or convert to a full page.</p>
              <button type="button" className="admin-primary-btn" onClick={() => onUpdate(pageIndex, "pageType", "content")}>
                Convert to full page
              </button>
            </div>
          ) : null}
        </div>

        <footer className="admin-page-editor-footer">
          {isLive ? <Eye size={14} /> : <EyeOff size={14} />}
          <span>
            {isLive ? "Visible on website." : "Hidden from visitors."}
            {" "}Remember to <strong>Save to Website</strong> in the admin bar.
          </span>
        </footer>
      </div>
    </div>
  );
}
