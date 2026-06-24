import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowDown,
  ArrowUp,
  Columns2,
  Copy,
  Film,
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
import { PAGE_SECTION_TYPES, defaultSection, sectionTypeLabel, createSectionId } from "../../utils/pageSections";
import { getImageUrl } from "../../styles/themeUtils";
import MediaUploadField from "./MediaUploadField";
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

function SectionEditor({ section, onChange, apiToken }) {
  function patch(updates) {
    onChange({ ...section, ...updates });
  }

  return (
    <div className="admin-section-editor-fields">
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
        <>
          <TextInput label="YouTube or video URL" value={section.videoUrl || ""} onChange={(v) => patch({ videoUrl: v })} placeholder="https://youtube.com/watch?v=..." />
          <TextInput label="Caption (optional)" value={section.caption || ""} onChange={(v) => patch({ caption: v })} />
          <div className="admin-field">
            <label className="admin-field-label">Alignment</label>
            <AlignPicker value={section.align || "center"} onChange={(v) => patch({ align: v })} />
          </div>
        </>
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

export default function PageSectionBuilder({ sections, onChange, apiToken, activeIndex, onActiveIndexChange }) {
  const list = sections?.length ? sections : [];
  const selected = typeof activeIndex === "number" ? activeIndex : 0;
  const current = list[selected];

  function updateSection(index, nextSection) {
    onChange(list.map((item, i) => (i === index ? nextSection : item)));
  }

  function addSection(type) {
    const next = [...list, defaultSection(type)];
    onChange(next);
    onActiveIndexChange?.(next.length - 1);
  }

  function duplicateSection(index) {
    const copy = { ...list[index], id: createSectionId() };
    const next = [...list];
    next.splice(index + 1, 0, copy);
    onChange(next);
    onActiveIndexChange?.(index + 1);
  }

  function removeSection(index) {
    const next = list.filter((_, i) => i !== index);
    onChange(next);
    onActiveIndexChange?.(Math.max(0, Math.min(index, next.length - 1)));
  }

  function moveSection(index, direction) {
    const swap = direction === "up" ? index - 1 : index + 1;
    if (swap < 0 || swap >= list.length) return;
    const next = [...list];
    [next[index], next[swap]] = [next[swap], next[index]];
    onChange(next);
    onActiveIndexChange?.(swap);
  }

  return (
    <div className="admin-page-builder-layout">
      <aside className="admin-page-builder-sidebar">
        <p className="admin-page-builder-sidebar-label">Page blocks ({list.length})</p>
        <div className="admin-page-builder-block-list">
          {list.length ? (
            list.map((section, index) => {
              const Icon = TYPE_ICONS[section.type] || Type;
              const thumb = section.type === "banner" || section.type === "image" || section.type === "split" ? getImageUrl(section.image) : "";
              return (
                <button
                  key={section.id || `${section.type}-${index}`}
                  type="button"
                  className={`admin-page-builder-block-item${selected === index ? " active" : ""}`}
                  onClick={() => onActiveIndexChange?.(index)}
                >
                  <span className="admin-page-builder-block-icon">
                    {thumb ? <img src={thumb} alt="" /> : <Icon size={14} />}
                  </span>
                  <span>
                    <strong>{sectionTypeLabel(section.type)}</strong>
                    <small>Block {index + 1}</small>
                  </span>
                </button>
              );
            })
          ) : (
            <p className="admin-page-builder-empty">No blocks yet — add one below.</p>
          )}
        </div>

        <p className="admin-page-builder-sidebar-label">Add a block</p>
        <div className="admin-page-builder-add-list">
          {PAGE_SECTION_TYPES.map((item) => {
            const Icon = TYPE_ICONS[item.type] || Plus;
            return (
              <button key={item.type} type="button" className="admin-page-builder-add-item" onClick={() => addSection(item.type)} title={item.description}>
                <Icon size={15} />
                {item.label}
              </button>
            );
          })}
        </div>
      </aside>

      <div className="admin-page-builder-main">
        {current ? (
          <>
            <div className="admin-page-section-card-head admin-page-section-card-head-main">
              <div className="admin-page-section-card-title">
                <span className="admin-page-section-icon">
                  {(() => {
                    const Icon = TYPE_ICONS[current.type] || Type;
                    return <Icon size={16} />;
                  })()}
                </span>
                <div>
                  <strong>Edit: {sectionTypeLabel(current.type)}</strong>
                  <span>Block {selected + 1} of {list.length}</span>
                </div>
              </div>
              <div className="admin-page-section-card-actions">
                <button type="button" className="admin-table-icon-btn" onClick={() => duplicateSection(selected)} title="Duplicate">
                  <Copy size={16} />
                </button>
                <button type="button" className="admin-table-icon-btn" disabled={selected === 0} onClick={() => moveSection(selected, "up")} aria-label="Move up">
                  <ArrowUp size={16} />
                </button>
                <button type="button" className="admin-table-icon-btn" disabled={selected === list.length - 1} onClick={() => moveSection(selected, "down")} aria-label="Move down">
                  <ArrowDown size={16} />
                </button>
                <button type="button" className="admin-table-icon-btn admin-table-icon-btn-danger" onClick={() => removeSection(selected)} aria-label="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <SectionEditor section={current} onChange={(next) => updateSection(selected, next)} apiToken={apiToken} />
          </>
        ) : (
          <div className="admin-page-builder-empty-main">
            <p>Pick a layout template or add your first block from the left panel.</p>
          </div>
        )}
      </div>
    </div>
  );
}
