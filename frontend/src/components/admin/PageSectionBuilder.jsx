import { useState } from "react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowDown,
  ArrowUp,
  Columns2,
  Copy,
  Film,
  GripVertical,
  Heading,
  ImageIcon,
  LayoutTemplate,
  Minus,
  MousePointerClick,
  Plus,
  Quote,
  Trash2,
  Type,
} from "lucide-react";
import {
  PAGE_SECTION_TYPES,
  defaultSection,
  sectionTypeLabel,
  createSectionId,
  sectionsFromQuickAdd,
  sectionsFromTemplate,
} from "../../utils/pageSections";
import { getImageUrl } from "../../styles/themeUtils";
import { normalizeVideoSlots, videoSectionPreview } from "../../utils/videoEmbed";
import MediaUploadField from "./MediaUploadField";
import PageSamplePicker from "./PageSamplePicker";
import ConfirmDialog from "./ConfirmDialog";
import { TextArea, TextInput } from "./editorUi";

const TYPE_ICONS = {
  banner: LayoutTemplate,
  heading: Heading,
  text: Type,
  image: ImageIcon,
  split: Columns2,
  columns: Columns2,
  quote: Quote,
  video: Film,
  divider: Minus,
  cta: MousePointerClick,
};

const BLOCK_TIPS = {
  banner: "Upload a wide photo — it appears at the top of your page.",
  heading: "Use a clear title. The small label above is optional.",
  text: "Write like an email. Press Enter twice between paragraphs.",
  image: "Add a photo and optional caption below it.",
  split: "Great for telling a story next to a photo.",
  columns: "Put two lists or info blocks side by side.",
  quote: "Highlight a Bible verse or inspiring quote.",
  video: "Add one or more YouTube links — display 1, 2, or 3 videos side by side.",
  divider: "Add breathing room between sections.",
  cta: "Add a button that links to another page or form.",
};

function AlignPicker({ value, onChange }) {
  const options = [
    { id: "left", icon: AlignLeft, label: "Left" },
    { id: "center", icon: AlignCenter, label: "Center" },
    { id: "right", icon: AlignRight, label: "Right" },
  ];
  return (
    <div className="admin-align-picker" role="group" aria-label="Alignment">
      {options.map((opt) => {
        const Icon = opt.icon;
        return (
          <button
            key={opt.id}
            type="button"
            className={`admin-align-btn${value === opt.id ? " active" : ""}`}
            onClick={() => onChange(opt.id)}
            title={opt.label}
            aria-label={opt.label}
            aria-pressed={value === opt.id}
          >
            <Icon size={16} />
          </button>
        );
      })}
    </div>
  );
}

function VideoSectionEditor({ section, onChange }) {
  const { columnCount, videos } = normalizeVideoSlots(section);

  function patchVideo(index, updates) {
    const nextVideos = videos.map((item, i) => (i === index ? { ...item, ...updates } : item));
    onChange({
      ...section,
      columnCount,
      videos: nextVideos,
      videoUrl: nextVideos[0]?.videoUrl || "",
      caption: nextVideos[0]?.caption || "",
    });
  }

  function setColumnCount(count) {
    const next = normalizeVideoSlots({ ...section, columnCount: count });
    onChange({
      ...section,
      columnCount: next.columnCount,
      videos: next.videos,
      videoUrl: next.videos[0]?.videoUrl || "",
      caption: next.videos[0]?.caption || "",
    });
  }

  return (
    <>
      <div className="admin-field">
        <label className="admin-field-label">How many videos?</label>
        <div className="admin-chip-row">
          {[1, 2, 3].map((count) => (
            <button
              key={count}
              type="button"
              className={`admin-chip${columnCount === count ? " active" : ""}`}
              onClick={() => setColumnCount(count)}
            >
              {count === 1 ? "1 video" : `${count} columns`}
            </button>
          ))}
        </div>
      </div>

      {videos.map((item, index) => (
        <div key={`video-slot-${index}`} className="admin-video-slot-card">
          <p className="admin-video-slot-label">Video {index + 1}</p>
          <TextInput
            label="YouTube URL"
            value={item.videoUrl || ""}
            onChange={(v) => patchVideo(index, { videoUrl: v })}
            placeholder="https://youtube.com/watch?v=..."
          />
          <TextInput
            label="Caption (optional)"
            value={item.caption || ""}
            onChange={(v) => patchVideo(index, { caption: v })}
            placeholder="Short label below this video"
          />
        </div>
      ))}

      <div className="admin-field">
        <label className="admin-field-label">Alignment</label>
        <AlignPicker value={section.align || "center"} onChange={(v) => onChange({ ...section, align: v })} />
      </div>
    </>
  );
}

function SectionEditor({ section, onChange, apiToken }) {
  function patch(updates) {
    onChange({ ...section, ...updates });
  }

  return (
    <div className="admin-section-editor-fields">
      {BLOCK_TIPS[section.type] ? (
        <p className="admin-page-block-tip">{BLOCK_TIPS[section.type]}</p>
      ) : null}

      {section.type === "banner" ? (
        <>
          <MediaUploadField label="Upload banner photo" apiToken={apiToken} value={section.image} onChange={(v) => patch({ image: v })} helpText="Recommended: wide landscape photo (1200×400px or larger)." />
          <div className="admin-field">
            <label className="admin-field-label">Banner height</label>
            <div className="admin-chip-row">
              {["small", "medium", "large"].map((h) => (
                <button key={h} type="button" className={`admin-chip${section.height === h ? " active" : ""}`} onClick={() => patch({ height: h })}>
                  {h === "small" ? "Short" : h === "medium" ? "Medium" : "Tall"}
                </button>
              ))}
            </div>
          </div>
        </>
      ) : null}

      {section.type === "heading" ? (
        <>
          <TextInput label="Small label (optional)" value={section.eyebrow || ""} onChange={(v) => patch({ eyebrow: v })} placeholder="MINISTRIES" />
          <TextInput label="Main heading" value={section.title || ""} onChange={(v) => patch({ title: v })} />
          <TextInput label="Subtitle (optional)" value={section.subtitle || ""} onChange={(v) => patch({ subtitle: v })} />
          <div className="admin-field">
            <label className="admin-field-label">Alignment</label>
            <AlignPicker value={section.align || "center"} onChange={(v) => patch({ align: v })} />
          </div>
        </>
      ) : null}

      {section.type === "text" ? (
        <>
          <TextArea label="Your text" hint="Press Enter twice between paragraphs." value={section.content || ""} onChange={(v) => patch({ content: v })} rows={8} />
          <div className="admin-field-grid-2">
            <div className="admin-field">
              <label className="admin-field-label">Text width</label>
              <select className="admin-field-select" value={section.size || "normal"} onChange={(e) => patch({ size: e.target.value })}>
                <option value="narrow">Narrow</option>
                <option value="normal">Normal</option>
                <option value="wide">Wide</option>
              </select>
            </div>
            <div className="admin-field">
              <label className="admin-field-label">Alignment</label>
              <AlignPicker value={section.align || "left"} onChange={(v) => patch({ align: v })} />
            </div>
          </div>
        </>
      ) : null}

      {section.type === "image" ? (
        <>
          <MediaUploadField label="Upload image" apiToken={apiToken} value={section.image} onChange={(v) => patch({ image: v })} />
          <TextInput label="Caption below image (optional)" value={section.caption || ""} onChange={(v) => patch({ caption: v })} />
          <div className="admin-field-grid-2">
            <div className="admin-field">
              <label className="admin-field-label">Size</label>
              <select className="admin-field-select" value={section.size || "large"} onChange={(e) => patch({ size: e.target.value })}>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
                <option value="full">Full width</option>
              </select>
            </div>
            <div className="admin-field">
              <label className="admin-field-label">Alignment</label>
              <AlignPicker value={section.align || "center"} onChange={(v) => patch({ align: v })} />
            </div>
          </div>
        </>
      ) : null}

      {section.type === "split" ? (
        <>
          <div className="admin-field">
            <label className="admin-field-label">Photo position</label>
            <div className="admin-chip-row">
              <button type="button" className={`admin-chip${section.imagePosition === "left" ? " active" : ""}`} onClick={() => patch({ imagePosition: "left" })}>
                Image left
              </button>
              <button type="button" className={`admin-chip${section.imagePosition !== "left" ? " active" : ""}`} onClick={() => patch({ imagePosition: "right" })}>
                Image right
              </button>
            </div>
          </div>
          <TextArea label="Text content" value={section.content || ""} onChange={(v) => patch({ content: v })} rows={7} />
          <MediaUploadField label="Side photo" apiToken={apiToken} value={section.image} onChange={(v) => patch({ image: v })} />
        </>
      ) : null}

      {section.type === "columns" ? (
        <>
          <TextArea label="Left column" value={section.leftContent || ""} onChange={(v) => patch({ leftContent: v })} rows={5} />
          <TextArea label="Right column" value={section.rightContent || ""} onChange={(v) => patch({ rightContent: v })} rows={5} />
        </>
      ) : null}

      {section.type === "quote" ? (
        <>
          <TextArea label="Quote text" value={section.content || ""} onChange={(v) => patch({ content: v })} rows={4} />
          <TextInput label="Author / source (optional)" value={section.author || ""} onChange={(v) => patch({ author: v })} />
          <div className="admin-field">
            <label className="admin-field-label">Alignment</label>
            <AlignPicker value={section.align || "center"} onChange={(v) => patch({ align: v })} />
          </div>
        </>
      ) : null}

      {section.type === "video" ? (
        <VideoSectionEditor section={section} onChange={onChange} />
      ) : null}

      {section.type === "divider" ? (
        <div className="admin-field">
          <label className="admin-field-label">Spacer style</label>
          <div className="admin-chip-row">
            <button type="button" className={`admin-chip${section.style === "line" ? " active" : ""}`} onClick={() => patch({ style: "line" })}>
              Line
            </button>
            <button type="button" className={`admin-chip${section.style === "space" ? " active" : ""}`} onClick={() => patch({ style: "space" })}>
              Empty space
            </button>
          </div>
        </div>
      ) : null}

      {section.type === "cta" ? (
        <>
          <div className="admin-field-grid-2">
            <TextInput label="Button label" value={section.buttonText || ""} onChange={(v) => patch({ buttonText: v })} placeholder="Contact us" />
            <TextInput label="Button link" value={section.buttonLink || ""} onChange={(v) => patch({ buttonLink: v })} placeholder="/contact" />
          </div>
          <div className="admin-field-grid-2">
            <div className="admin-field">
              <label className="admin-field-label">Button style</label>
              <select className="admin-field-select" value={section.style || "primary"} onChange={(e) => patch({ style: e.target.value })}>
                <option value="primary">Orange (primary)</option>
                <option value="outline">Outline</option>
              </select>
            </div>
            <div className="admin-field">
              <label className="admin-field-label">Alignment</label>
              <AlignPicker value={section.align || "center"} onChange={(v) => patch({ align: v })} />
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default function PageSectionBuilder({
  sections,
  onChange,
  apiToken,
  activeIndex,
  onActiveIndexChange,
  variant = "page",
}) {
  const list = sections?.length ? sections : [];
  const selected = typeof activeIndex === "number" ? activeIndex : 0;
  const current = list[selected];
  const [addOpen, setAddOpen] = useState(false);
  const [pendingRemoveIndex, setPendingRemoveIndex] = useState(null);
  const [dragIndex, setDragIndex] = useState(null);
  const [dropIndex, setDropIndex] = useState(null);

  function updateSection(index, nextSection) {
    onChange(list.map((item, i) => (i === index ? nextSection : item)));
  }

  function applySections(next, focusIndex = next.length - 1) {
    onChange(next);
    onActiveIndexChange?.(Math.max(0, focusIndex));
  }

  function addSection(type) {
    const next = [...list, defaultSection(type)];
    applySections(next);
    setAddOpen(false);
  }

  function applyTemplate(templateId, mode = "append") {
    const sample = sectionsFromTemplate(templateId);
    if (!sample.length) return;
    if (mode === "replace" || !list.length) {
      applySections(sample, 0);
      return;
    }
    applySections([...list, ...sample]);
  }

  function applyQuickAdd(quickAddId) {
    const sample = sectionsFromQuickAdd(quickAddId);
    if (!sample.length) return;
    applySections([...list, ...sample]);
  }

  function duplicateSection(index) {
    const copy = { ...list[index], id: createSectionId() };
    const next = [...list];
    next.splice(index + 1, 0, copy);
    applySections(next, index + 1);
  }

  function removeSection(index) {
    setPendingRemoveIndex(index);
  }

  function confirmRemoveSection() {
    if (pendingRemoveIndex == null) return;
    const index = pendingRemoveIndex;
    const next = list.filter((_, i) => i !== index);
    applySections(next, Math.max(0, Math.min(index, next.length - 1)));
    setPendingRemoveIndex(null);
  }

  function moveSection(index, direction) {
    const swap = direction === "up" ? index - 1 : index + 1;
    if (swap < 0 || swap >= list.length) return;
    const next = [...list];
    [next[index], next[swap]] = [next[swap], next[index]];
    applySections(next, swap);
  }

  function reorderSections(fromIndex, toIndex) {
    if (fromIndex === null || toIndex === null || fromIndex === toIndex) return;
    if (fromIndex < 0 || toIndex < 0 || fromIndex >= list.length || toIndex >= list.length) return;
    const next = [...list];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    applySections(next, toIndex);
  }

  function sectionPreviewText(section) {
    if (section.type === "video") return videoSectionPreview(section);
    return (
      section.title ||
      section.buttonText ||
      (section.content || "").split("\n")[0]?.slice(0, 28) ||
      "Empty"
    );
  }

  return (
    <div className={`admin-page-builder-modern${variant === "homepage" ? " admin-page-builder-homepage" : ""}`}>
      <div className="admin-page-builder-layout admin-page-builder-layout-studio">
        <aside className="admin-page-builder-sidebar admin-page-builder-sidebar-studio">
          <div className="admin-page-builder-sidebar-head">
            <p>Sections</p>
            <span>{list.length}</span>
          </div>

          <div className="admin-page-builder-sidebar-hint">Drag to reorder</div>
          <div className="admin-page-builder-block-list">
            {list.length ? (
              list.map((section, index) => {
                const Icon = TYPE_ICONS[section.type] || Type;
                const thumb = section.type === "banner" || section.type === "image" || section.type === "split" ? getImageUrl(section.image) : "";
                const preview = sectionPreviewText(section);
                const isDragging = dragIndex === index;
                const isDropTarget = dropIndex === index && dragIndex !== null && dragIndex !== index;
                return (
                  <div
                    key={section.id || `${section.type}-${index}`}
                    className={`admin-page-builder-block-row${selected === index ? " active" : ""}${isDragging ? " is-dragging" : ""}${isDropTarget ? " is-drop-target" : ""}`}
                    onDragOver={(event) => {
                      event.preventDefault();
                      if (dragIndex !== null && dragIndex !== index) setDropIndex(index);
                    }}
                    onDragLeave={() => {
                      if (dropIndex === index) setDropIndex(null);
                    }}
                    onDrop={(event) => {
                      event.preventDefault();
                      reorderSections(dragIndex, index);
                      setDragIndex(null);
                      setDropIndex(null);
                    }}
                  >
                    <span
                      className="admin-page-builder-drag-handle"
                      draggable
                      title="Drag to reorder"
                      aria-label={`Drag section ${index + 1}`}
                      onDragStart={(event) => {
                        setDragIndex(index);
                        event.dataTransfer.effectAllowed = "move";
                        event.dataTransfer.setData("text/plain", String(index));
                      }}
                      onDragEnd={() => {
                        setDragIndex(null);
                        setDropIndex(null);
                      }}
                    >
                      <GripVertical size={14} />
                    </span>
                    <button
                      type="button"
                      className="admin-page-builder-block-item admin-page-builder-block-item-studio"
                      onClick={() => onActiveIndexChange?.(index)}
                    >
                      <span className="admin-page-builder-block-index">{index + 1}</span>
                      <span className="admin-page-builder-block-icon">
                        {thumb ? <img src={thumb} alt="" /> : <Icon size={14} />}
                      </span>
                      <span className="admin-page-builder-block-text">
                        <strong>{sectionTypeLabel(section.type)}</strong>
                        <small>{preview}</small>
                      </span>
                    </button>
                  </div>
                );
              })
            ) : (
              <p className="admin-page-builder-empty">No sections yet</p>
            )}
          </div>

          <div className="admin-page-builder-sidebar-footer">
            <button
              type="button"
              className={`admin-page-builder-add-btn${addOpen ? " open" : ""}`}
              onClick={() => setAddOpen((open) => !open)}
              aria-expanded={addOpen}
            >
              <Plus size={16} />
              Add section
            </button>

            {addOpen ? (
              <div className="admin-page-add-grid" role="menu">
                {PAGE_SECTION_TYPES.map((item) => {
                  const Icon = TYPE_ICONS[item.type] || Plus;
                  return (
                    <button
                      key={item.type}
                      type="button"
                      role="menuitem"
                      className="admin-page-add-grid-item"
                      onClick={() => addSection(item.type)}
                      title={item.description}
                    >
                      <span className="admin-page-add-grid-icon">
                        <Icon size={18} />
                      </span>
                      <span className="admin-page-add-grid-label">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
        </aside>

        <div className="admin-page-builder-main admin-page-builder-main-studio">
          {!list.length ? (
            variant === "homepage" ? (
              <div className="admin-page-builder-empty-homepage">
                <LayoutTemplate size={36} strokeWidth={1.25} />
                <h3>No sections yet</h3>
                <p>Use the quick-add cards above, or pick a block from the left sidebar once you add one.</p>
              </div>
            ) : (
              <PageSamplePicker
                variant="hero"
                onSelectTemplate={applyTemplate}
                onApplyQuickAdd={applyQuickAdd}
                hasSections={false}
              />
            )
          ) : current ? (
            <div className="admin-page-builder-editor-card">
              <div className="admin-page-section-card-head admin-page-section-card-head-studio">
                <div className="admin-page-section-card-title">
                  <span className="admin-page-section-icon">
                    {(() => {
                      const Icon = TYPE_ICONS[current.type] || Type;
                      return <Icon size={16} />;
                    })()}
                  </span>
                  <div>
                    <span className="admin-page-edit-kicker">Editing section {selected + 1}</span>
                    <strong>{sectionTypeLabel(current.type)}</strong>
                  </div>
                </div>
                <div className="admin-page-section-card-actions admin-page-section-card-actions-studio">
                  <button type="button" className="admin-page-editor-action-icon" onClick={() => duplicateSection(selected)} title="Duplicate">
                    <Copy size={16} />
                  </button>
                  <button type="button" className="admin-page-editor-action-icon" disabled={selected === 0} onClick={() => moveSection(selected, "up")} title="Move up">
                    <ArrowUp size={16} />
                  </button>
                  <button type="button" className="admin-page-editor-action-icon" disabled={selected === list.length - 1} onClick={() => moveSection(selected, "down")} title="Move down">
                    <ArrowDown size={16} />
                  </button>
                  <button type="button" className="admin-page-editor-action-icon admin-page-editor-action-danger" onClick={() => removeSection(selected)} title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="admin-page-builder-editor-body">
                <SectionEditor section={current} onChange={(next) => updateSection(selected, next)} apiToken={apiToken} />
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <ConfirmDialog
        open={pendingRemoveIndex != null}
        title="Remove this block?"
        message="This section block will be removed from the page."
        confirmLabel="Remove"
        cancelLabel="Cancel"
        danger
        onCancel={() => setPendingRemoveIndex(null)}
        onConfirm={confirmRemoveSection}
      />
    </div>
  );
}
