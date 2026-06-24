import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  ExternalLink,
  GripVertical,
  RotateCcw,
  Save,
  Undo2,
} from "lucide-react";
import {
  countDescendants,
  ensurePageIds,
  getPageId,
  pageMenuLink,
  reorderMenuPages,
  setMenuParent,
} from "../../utils/menuUtils";

function MenuRow({
  page,
  pages,
  depth,
  onToggleVisible,
  onParentChange,
  onDragStart,
  onDragOver,
  onDrop,
  dragOverId,
}) {
  const pageId = getPageId(page);
  const [expanded, setExpanded] = useState(true);
  const children = pages.filter((p) => p.parentId === pageId).sort((a, b) => (a.menuOrder ?? 0) - (b.menuOrder ?? 0));
  const subCount = countDescendants(pages, pageId);
  const parentOptions = pages.filter((p) => {
    const candidateId = getPageId(p);
    return candidateId !== pageId && p.parentId !== pageId;
  });
  const visible = page.visible !== false && page.showInHeader !== false;

  return (
    <>
      <div
        className={`admin-menu-row${dragOverId === pageId ? " admin-menu-row-drag-over" : ""}`}
        style={{ paddingLeft: `${0.75 + depth * 1.25}rem` }}
        draggable
        onDragStart={(e) => onDragStart(e, pageId)}
        onDragOver={(e) => onDragOver(e, pageId)}
        onDrop={(e) => onDrop(e, pageId)}
      >
        <button type="button" className="admin-menu-drag" aria-label="Drag to reorder">
          <GripVertical size={16} />
        </button>

        {children.length ? (
          <button type="button" className="admin-menu-expand" onClick={() => setExpanded((v) => !v)} aria-label="Toggle subcategories">
            {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        ) : (
          <span className="admin-menu-expand-spacer" />
        )}

        <div className="admin-menu-row-main">
          <span className="admin-menu-row-title">{page.title || "Untitled"}</span>
          <span className={`admin-menu-visibility-pill ${visible ? "visible" : "hidden"}`}>{visible ? "Visible" : "Hidden"}</span>
          {subCount > 0 ? <span className="admin-menu-subcount">{subCount} subcategories</span> : null}
        </div>

        <div className="admin-menu-row-controls">
          <select
            className="admin-menu-parent-select"
            value={page.parentId || ""}
            onChange={(e) => onParentChange(pageId, e.target.value || null)}
            aria-label="Menu hierarchy"
          >
            <option value="">Top Level</option>
            {parentOptions.map((p) => (
              <option key={getPageId(p)} value={getPageId(p)}>
                Under: {p.title}
              </option>
            ))}
          </select>

          <label className="admin-menu-show-toggle">
            <span>Show</span>
            <input
              type="checkbox"
              checked={visible}
              onChange={(e) => onToggleVisible(pageId, e.target.checked)}
            />
            <span className="admin-menu-show-slider" />
          </label>
        </div>
      </div>

      {expanded
        ? children.map((child) => (
            <MenuRow
              key={getPageId(child)}
              page={child}
              pages={pages}
              depth={depth + 1}
              onToggleVisible={onToggleVisible}
              onParentChange={onParentChange}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDrop={onDrop}
              dragOverId={dragOverId}
            />
          ))
        : null}
    </>
  );
}

export default function MenuManagementEditor({ pages, onChange, onSaveDraft, hasChanges, saving }) {
  const [localPages, setLocalPages] = useState(() => ensurePageIds(pages));
  const [undoStack, setUndoStack] = useState([]);
  const dragIdRef = useRef(null);
  const [dragOverId, setDragOverId] = useState(null);

  const syncedPages = useMemo(() => ensurePageIds(pages), [pages]);

  useEffect(() => {
    setLocalPages(syncedPages);
  }, [syncedPages]);

  function pushUndo(next) {
    setUndoStack((stack) => [...stack.slice(-20), localPages]);
    setLocalPages(next);
    onChange(next);
  }

  function handleReset() {
    setLocalPages(syncedPages);
    setUndoStack([]);
    onChange(syncedPages);
  }

  function handleUndo() {
    setUndoStack((stack) => {
      if (!stack.length) return stack;
      const prev = stack[stack.length - 1];
      setLocalPages(prev);
      onChange(prev);
      return stack.slice(0, -1);
    });
  }

  function handleToggleVisible(pageId, show) {
    const next = localPages.map((p) =>
      getPageId(p) === pageId ? { ...p, visible: show, showInHeader: show } : p
    );
    pushUndo(next);
  }

  function handleParentChange(pageId, parentId) {
    pushUndo(setMenuParent(localPages, pageId, parentId));
  }

  function handleDragStart(_e, pageId) {
    dragIdRef.current = pageId;
  }

  function handleDragOver(e, pageId) {
    e.preventDefault();
    setDragOverId(pageId);
  }

  function handleDrop(e, targetId) {
    e.preventDefault();
    const draggedId = dragIdRef.current;
    dragIdRef.current = null;
    setDragOverId(null);
    if (!draggedId || draggedId === targetId) return;
    pushUndo(reorderMenuPages(localPages, draggedId, targetId));
  }

  const roots = localPages
    .filter((p) => !p.parentId)
    .sort((a, b) => (a.menuOrder ?? 0) - (b.menuOrder ?? 0));

  return (
    <div className="admin-table-panel">
      <div className="admin-table-panel-head">
        <div>
          <h2>Menu Management</h2>
          <p>Drag to reorder · choose parent to nest · toggle visibility</p>
        </div>
        <div className="admin-menu-toolbar-actions">
          <a href="/" target="_blank" rel="noreferrer" className="admin-ghost-btn">
            <ExternalLink size={16} />
            Preview Menu
          </a>
          <button type="button" className="admin-ghost-btn" onClick={handleUndo} disabled={!undoStack.length}>
            <Undo2 size={16} />
            Undo
          </button>
          <button type="button" className="admin-ghost-btn" onClick={handleReset}>
            <RotateCcw size={16} />
            Reset
          </button>
          <button type="button" className="admin-primary-btn" onClick={onSaveDraft} disabled={saving || !hasChanges}>
            <Save size={16} />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="admin-menu-board">
        {roots.length ? (
          roots.map((page) => (
            <MenuRow
              key={getPageId(page)}
              page={page}
              pages={localPages}
              depth={0}
              onToggleVisible={handleToggleVisible}
              onParentChange={handleParentChange}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              dragOverId={dragOverId}
            />
          ))
        ) : (
          <p className="admin-table-empty">No menu items yet. Add pages and enable &quot;Header menu&quot;.</p>
        )}
      </div>

      <div className="admin-menu-preview-strip">
        {roots.map((page) => (
          <div key={`preview-${getPageId(page)}`} className="admin-menu-preview-item">
            <span>{page.title}</span>
            <code>{pageMenuLink(page)}</code>
          </div>
        ))}
      </div>
    </div>
  );
}
