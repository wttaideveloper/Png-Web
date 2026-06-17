import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, ExternalLink, FileText, Link2, Plus, Route } from "lucide-react";
import { pagePublicLink } from "../../utils/pageUtils";
import MediaUploadField from "./MediaUploadField";
import { EditorBlock, PreviewPanel, SectionEditorShell, SectionLayout, TextArea, TextInput } from "./editorUi";

function ToggleChip({ label, checked, onChange }) {
  return (
    <label className={`admin-toggle-chip ${checked ? "admin-toggle-chip-on" : ""}`}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  );
}

export default function PagesSectionEditor({ pages, onAdd, onUpdate, onRemove, onMove, apiToken }) {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const prevCount = useRef(pages.length);

  useEffect(() => {
    if (pages.length > prevCount.current) {
      setFocusedIndex(pages.length - 1);
    } else if (focusedIndex >= pages.length) {
      setFocusedIndex(Math.max(0, pages.length - 1));
    }
    prevCount.current = pages.length;
  }, [pages.length, focusedIndex]);

  const headerCount = pages.filter((p) => p.visible !== false && p.showInHeader !== false).length;
  const footerCount = pages.filter((p) => p.visible !== false && p.showInFooter).length;
  const contentPages = pages.filter((p) => p.pageType !== "link");

  function handleAdd() {
    onAdd();
  }

  return (
    <SectionEditorShell
      kicker="Navigation / Pages"
      title="Pages & menus"
      description="Manage menu links and build content pages with optional side image and button."
    >
      <SectionLayout
        formColumn={
          <>
            <EditorBlock
              icon={Route}
              title="All pages"
              description="Choose a page below. Start with content only, then turn on optional image or button if needed."
            >
              <div className="admin-pages-toolbar">
                <button type="button" className="admin-add-btn" onClick={handleAdd}>
                  <Plus size={16} />
                  Add content page
                </button>
                <span className="admin-pages-toolbar-hint">{pages.length} page{pages.length === 1 ? "" : "s"}</span>
              </div>

              <div className="admin-pages-list">
                {pages.map((item, index) => {
                  const isContent = item.pageType !== "link";
                  const isFocused = focusedIndex === index;
                  const publicLink = pagePublicLink(item);

                  return (
                    <article
                      key={`${item.slug || item.title}-${index}`}
                      className={`admin-page-row${isFocused ? " admin-page-row-active" : ""}`}
                    >
                      <button
                        type="button"
                        className="admin-page-row-summary"
                        onClick={() => setFocusedIndex(index)}
                        aria-expanded={isFocused}
                      >
                        <span className="admin-page-index">{index + 1}</span>
                        <span className="admin-page-summary-text">
                          <strong>{item.title || "Untitled page"}</strong>
                          <span className="admin-page-summary-meta">
                            {isContent ? "Content page" : "Menu link"} · <code>{publicLink}</code>
                          </span>
                        </span>
                      </button>

                      {isFocused ? (
                        <div className="admin-page-row-body">
                          <div className="admin-page-row-top">
                            <TextInput
                              label="Page name"
                              value={item.title || ""}
                              onChange={(v) => onUpdate(index, "title", v)}
                              placeholder="e.g. Who We Are"
                              hint="This is the page title shown in menu and on the page."
                            />
                            <div className="admin-field">
                              <label className="admin-field-label">Page type</label>
                              <select
                                className="admin-field-select"
                                value={item.pageType || "content"}
                                onChange={(e) => onUpdate(index, "pageType", e.target.value)}
                              >
                                <option value="content">Content page (editable body + URL)</option>
                                <option value="link">Menu link only (no page content)</option>
                              </select>
                              <p className="admin-field-hint">
                                {isContent
                                  ? "Creates a real page at the URL below with content and optional extras."
                                  : "Adds a navigation link only — use #ministries for homepage sections."}
                              </p>
                            </div>
                          </div>

                          <div className="admin-page-row-bottom">
                            <ToggleChip
                              label="Visible"
                              checked={item.visible !== false}
                              onChange={(v) => onUpdate(index, "visible", v)}
                            />
                            <ToggleChip
                              label="Header menu"
                              checked={item.showInHeader !== false}
                              onChange={(v) => onUpdate(index, "showInHeader", v)}
                            />
                            <ToggleChip
                              label="Footer menu"
                              checked={item.showInFooter === true}
                              onChange={(v) => onUpdate(index, "showInFooter", v)}
                            />
                            <div className="admin-page-actions">
                              <button
                                type="button"
                                className="admin-icon-btn"
                                onClick={() => onMove(index, "up")}
                                disabled={index === 0}
                                aria-label="Move up"
                              >
                                <ArrowUp size={14} />
                              </button>
                              <button
                                type="button"
                                className="admin-icon-btn"
                                onClick={() => onMove(index, "down")}
                                disabled={index === pages.length - 1}
                                aria-label="Move down"
                              >
                                <ArrowDown size={14} />
                              </button>
                              <button type="button" className="admin-ghost-btn" onClick={() => onRemove(index)}>
                                Remove
                              </button>
                            </div>
                          </div>

                          {isContent ? (
                            <div className="admin-page-content-editor">
                              <div className="admin-page-content-head">
                                <FileText size={16} />
                                <div>
                                  <h4>Page content</h4>
                                  <p>These fields appear on the public page after you save.</p>
                                </div>
                              </div>

                              <div className="admin-page-url-preview admin-page-url-preview-box">
                                <span>Public URL</span>
                                <code>{publicLink}</code>
                                <a href={publicLink} target="_blank" rel="noreferrer" className="admin-inline-link">
                                  <ExternalLink size={14} />
                                  Preview
                                </a>
                              </div>

                              <TextInput
                                label="URL slug"
                                hint="Lowercase path segment, e.g. about-us"
                                value={item.slug || ""}
                                onChange={(v) => onUpdate(index, "slug", v)}
                                placeholder="about-us"
                              />
                              <TextInput
                                label="Eyebrow"
                                hint="Optional small label above page title"
                                value={item.eyebrow || ""}
                                onChange={(v) => onUpdate(index, "eyebrow", v)}
                                placeholder="ABOUT PNGUM"
                              />
                              <div className="admin-page-options-grid">
                                <ToggleChip
                                  label="Show banner image"
                                  checked={item.showBannerImage === true}
                                  onChange={(v) => onUpdate(index, "showBannerImage", v)}
                                />
                                <ToggleChip
                                  label="Show side image"
                                  checked={item.showSideImage === true}
                                  onChange={(v) => onUpdate(index, "showSideImage", v)}
                                />
                                <ToggleChip
                                  label="Show page button"
                                  checked={item.showPageButton === true}
                                  onChange={(v) => onUpdate(index, "showPageButton", v)}
                                />
                              </div>
                              <p className="admin-field-hint">
                                If no image is selected, page content automatically uses full width.
                              </p>
                              {item.showBannerImage === true ? (
                                <MediaUploadField
                                  label="Banner image"
                                  apiToken={apiToken}
                                  value={item.bannerImage || item.heroImage || { id: null, url: "" }}
                                  onChange={(v) => onUpdate(index, "bannerImage", v)}
                                  helpText="Image appears behind the title area at top of page."
                                />
                              ) : null}
                              {item.showSideImage === true ? (
                                <MediaUploadField
                                  label="Side image"
                                  apiToken={apiToken}
                                  value={item.sideImage || item.heroImage || { id: null, url: "" }}
                                  onChange={(v) => onUpdate(index, "sideImage", v)}
                                  helpText="Image appears on the right side beside page content."
                                />
                              ) : null}
                              <TextArea
                                label="Page body"
                                hint="Main content. Separate paragraphs with a blank line."
                                value={item.body || ""}
                                onChange={(v) => onUpdate(index, "body", v)}
                                rows={10}
                                placeholder={"Write your page content here...\n\nAdd another paragraph after a blank line."}
                              />
                              {item.showPageButton === true ? (
                                <div className="admin-page-row-top">
                                  <TextInput
                                    label="Button text"
                                    value={item.pageButtonText || ""}
                                    onChange={(v) => onUpdate(index, "pageButtonText", v)}
                                    placeholder="Learn More"
                                  />
                                  <TextInput
                                    label="Button link"
                                    value={item.pageButtonLink || ""}
                                    onChange={(v) => onUpdate(index, "pageButtonLink", v)}
                                    placeholder="/contact or https://..."
                                    hint="Optional. If empty, button links to this page URL."
                                  />
                                </div>
                              ) : null}
                            </div>
                          ) : (
                            <div className="admin-page-content-editor admin-page-link-editor">
                              <div className="admin-page-content-head">
                                <Link2 size={16} />
                                <div>
                                  <h4>Link target</h4>
                                  <p>Where this menu item goes when clicked.</p>
                                </div>
                              </div>
                              <TextInput
                                label="Link URL"
                                hint="Use / for home, #ministries for homepage sections, or a full https:// URL."
                                value={item.link || ""}
                                onChange={(v) => onUpdate(index, "link", v)}
                                placeholder="#ministries or https://..."
                              />
                            </div>
                          )}
                        </div>
                      ) : null}
                    </article>
                  );
                })}
              </div>
            </EditorBlock>
          </>
        }
        previewColumn={
          <PreviewPanel footnote="Save changes to publish pages and update menus on the live site.">
            <div className="admin-nav-preview">
              <div>
                <p className="admin-preview-mini-label">Header ({headerCount})</p>
                <div className="admin-nav-preview-row">
                  {pages
                    .filter((p) => p.visible !== false && p.showInHeader !== false)
                    .map((p, i) => (
                      <span key={`h-${i}`}>{p.title || "Untitled"}</span>
                    ))}
                </div>
              </div>
              <div>
                <p className="admin-preview-mini-label">Footer ({footerCount})</p>
                <div className="admin-nav-preview-row admin-nav-preview-row-footer">
                  {pages
                    .filter((p) => p.visible !== false && p.showInFooter)
                    .map((p, i) => (
                      <span key={`f-${i}`}>{p.title || "Untitled"}</span>
                    ))}
                </div>
              </div>
              <div className="admin-page-list-preview">
                <p className="admin-preview-mini-label">
                  <FileText size={12} style={{ display: "inline", verticalAlign: "middle" }} /> Content pages ({contentPages.length})
                </p>
                {contentPages.length ? (
                  contentPages.map((p, i) => (
                    <div key={`c-${i}`} className="admin-page-list-preview-item">
                      <strong>{p.title || "Untitled"}</strong>
                      <span>{pagePublicLink(p)}</span>
                    </div>
                  ))
                ) : (
                  <p className="admin-preview-empty">No content pages yet. Click &quot;Add content page&quot; to create one.</p>
                )}
              </div>
            </div>
          </PreviewPanel>
        }
      />
    </SectionEditorShell>
  );
}
