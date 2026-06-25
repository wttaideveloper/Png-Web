import { useMemo, useRef, useState } from "react";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { ensurePageSections, sectionCountLabel } from "../../utils/pageSections";
import { pagePublicLink } from "../../utils/pageUtils";
import { getImageUrl } from "../../styles/themeUtils";
import NewPageWizard from "./NewPageWizard";
import PageEditModal from "./PageEditModal";
import ConfirmDialog from "./ConfirmDialog";

function pageThumb(page) {
  const sections = ensurePageSections(page);
  const banner = sections.find((s) => s.type === "banner" || s.type === "image" || s.type === "split");
  if (banner?.image) return getImageUrl(banner.image);
  return getImageUrl(page.bannerImage?.url || page.sideImage?.url || page.heroImage?.url);
}

export default function PagesTableEditor({ pages, onAdd, onUpdate, onRemove, apiToken }) {
  const [showWizard, setShowWizard] = useState(false);
  const [editingPageId, setEditingPageId] = useState(null);
  const [isNewPage, setIsNewPage] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const editingIndex = useMemo(() => {
    if (!editingPageId) return -1;
    return (pages || []).findIndex((page) => (page.pageId || page.id) === editingPageId);
  }, [pages, editingPageId]);

  const contentPages = useMemo(() => {
    return (pages || [])
      .map((page, index) => ({ page, index }))
      .filter(({ page }) => page.pageType !== "link");
  }, [pages]);

  function handleDelete(index) {
    const page = pages[index];
    setDeleteTarget({ index, title: page?.title || "this page" });
  }

  function confirmDeletePage() {
    if (deleteTarget == null) return;
    const page = pages[deleteTarget.index];
    const pageId = page?.pageId || page?.id;
    onRemove(deleteTarget.index);
    if (pageId && pageId === editingPageId) closeEditor();
    setDeleteTarget(null);
  }

  function openEditor(index, isNew = false) {
    const page = pages[index];
    const pageId = page?.pageId || page?.id;
    if (!pageId) return;
    setEditingPageId(pageId);
    setIsNewPage(isNew);
  }

  function closeEditor() {
    setEditingPageId(null);
    setIsNewPage(false);
  }

  return (
    <div className="admin-table-panel">
      <div className="admin-table-panel-head">
        <div>
          <h2>Pages</h2>
          <p>Create pages with banners, photos, videos, columns, and buttons — no coding needed.</p>
        </div>
        <button type="button" className="admin-primary-btn admin-table-new-btn" onClick={() => setShowWizard(true)}>
          <Plus size={16} />
          Create new page
        </button>
      </div>

      <div className="admin-data-table-wrap">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Blocks</th>
              <th>Link</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contentPages.length ? (
              contentPages.map(({ page, index }) => {
                const thumb = pageThumb(page);
                const link = pagePublicLink(page);
                const active = page.visible !== false;

                return (
                  <tr key={page.pageId || `${page.slug}-${index}`}>
                    <td>
                      <div className="admin-table-thumb" style={thumb ? { backgroundImage: `url(${thumb})` } : undefined} aria-hidden="true" />
                    </td>
                    <td>
                      <button type="button" className="admin-page-title-link" onClick={() => openEditor(index)}>
                        <strong>{page.title || "Untitled"}</strong>
                      </button>
                    </td>
                    <td>
                      <span className="admin-page-section-count">{sectionCountLabel(page)}</span>
                    </td>
                    <td>
                      <code className="admin-table-link">{link}</code>
                    </td>
                    <td>
                      <span className={`admin-status-badge ${active ? "admin-status-active" : "admin-status-inactive"}`}>
                        {active ? "Live" : "Hidden"}
                      </span>
                    </td>
                    <td>
                      <div className="admin-table-actions">
                        <a href={link} target="_blank" rel="noreferrer" className="admin-table-icon-btn" title="Preview">
                          <Eye size={16} />
                        </a>
                        <button type="button" className="admin-table-icon-btn" onClick={() => openEditor(index)} title="Edit page">
                          <Pencil size={16} />
                        </button>
                        <button type="button" className="admin-table-icon-btn admin-table-icon-btn-danger" onClick={() => handleDelete(index)} title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="admin-table-empty">
                  <p>No pages yet.</p>
                  <button type="button" className="admin-primary-btn" onClick={() => setShowWizard(true)}>
                    <Plus size={16} />
                    Create your first page
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showWizard ? (
        <NewPageWizard
          onClose={() => setShowWizard(false)}
          onCreate={({ templateId, title }) => {
            const created = onAdd(templateId, title);
            setShowWizard(false);
            if (created?.pageId) {
              setEditingPageId(created.pageId);
              setIsNewPage(true);
            }
          }}
        />
      ) : null}

      {editingIndex >= 0 ? (
        <PageEditModal
          page={pages[editingIndex]}
          pageIndex={editingIndex}
          onUpdate={onUpdate}
          onClose={closeEditor}
          apiToken={apiToken}
          isNew={isNewPage}
        />
      ) : null}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete page?"
        message={`Delete "${deleteTarget?.title || "this page"}"?`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        danger
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDeletePage}
      />
    </div>
  );
}
