import { useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Eye,
  LayoutGrid,
  MapPin,
  Sparkles,
} from "lucide-react";
import {
  HOMEPAGE_BLOCK_PLACEMENTS,
  HOMEPAGE_QUICK_SECTIONS,
  placementLabel,
  sectionsFromHomepageQuickAdd,
} from "../../utils/homepageBlocks";
import { sectionsFromTemplate } from "../../utils/pageSections";
import PageSectionBuilder from "./PageSectionBuilder";
import HomepageCustomBlocks from "../homepage/HomepageCustomBlocks";

export default function HomepageBuilderEditor({ form, updateField, apiToken }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [quickOpen, setQuickOpen] = useState(true);
  const blocks = form.homepageBlocks?.length ? form.homepageBlocks : [];
  const placement = form.homepageBlocksPlacement || "after-ministries";

  const previewBlocks = useMemo(() => blocks, [blocks]);

  function setBlocks(next) {
    updateField("homepageBlocks", next);
  }

  function addQuickSection(quickAddId) {
    const sample = sectionsFromHomepageQuickAdd(quickAddId);
    if (!sample.length) return;
    const next = [...blocks, ...sample];
    setBlocks(next);
    setActiveIndex(next.length - 1);
  }

  function addStarterSet() {
    const next = [...blocks, ...sectionsFromTemplate("starter")];
    setBlocks(next);
    setActiveIndex(next.length - 1);
  }

  return (
    <section className="admin-homepage-builder">
      <header className="admin-homepage-builder-header">
        <div>
          <p className="admin-section-kicker">Homepage builder</p>
          <h2>Add custom sections</h2>
          <p className="admin-homepage-builder-subtitle">
            Insert banners, text, photos, and buttons on your homepage — then save to publish.
          </p>
        </div>
        <div className="admin-homepage-builder-header-meta">
          <span className="admin-homepage-builder-count">{blocks.length} block{blocks.length === 1 ? "" : "s"}</span>
        </div>
      </header>

      <div className="admin-homepage-builder-toolbar">
        <div className="admin-homepage-placement-panel">
          <div className="admin-homepage-placement-head">
            <MapPin size={16} />
            <div>
              <strong>Where on the homepage?</strong>
              <p>Choose the spot where your custom sections will appear.</p>
            </div>
          </div>
          <div className="admin-homepage-placement-grid" role="radiogroup" aria-label="Homepage placement">
            {HOMEPAGE_BLOCK_PLACEMENTS.map((item) => {
              const active = placement === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  className={`admin-homepage-placement-card${active ? " active" : ""}`}
                  onClick={() => updateField("homepageBlocksPlacement", item.id)}
                >
                  <span className="admin-homepage-placement-emoji" aria-hidden="true">
                    {item.emoji}
                  </span>
                  <span className="admin-homepage-placement-text">
                    <strong>{item.label}</strong>
                    <small>{item.description}</small>
                  </span>
                  {active ? (
                    <span className="admin-homepage-placement-check" aria-hidden="true">
                      <Check size={14} />
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        <div className={`admin-homepage-quick-panel${quickOpen ? " is-open" : ""}`}>
          <button
            type="button"
            className="admin-homepage-quick-toggle"
            onClick={() => setQuickOpen((open) => !open)}
            aria-expanded={quickOpen}
          >
            <Sparkles size={16} />
            <span>
              <strong>Quick-add section sets</strong>
              <small>One click to add ready-made blocks with sample text</small>
            </span>
            {quickOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {quickOpen ? (
            <div className="admin-homepage-quick-body">
              <div className="admin-homepage-quick-grid">
                {HOMEPAGE_QUICK_SECTIONS.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    className="admin-homepage-quick-card"
                    onClick={() => addQuickSection(template.id)}
                  >
                    <span className="admin-homepage-quick-emoji" aria-hidden="true">
                      {template.emoji}
                    </span>
                    <strong>{template.label}</strong>
                    <p>{template.description}</p>
                  </button>
                ))}
              </div>
              <button type="button" className="admin-homepage-starter-link" onClick={addStarterSet}>
                + Add basic heading &amp; text
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <div className="admin-homepage-builder-workspace">
        <div className="admin-homepage-builder-canvas">
          <div className="admin-homepage-builder-canvas-head">
            <LayoutGrid size={16} />
            <strong>Your sections</strong>
            <span>Edit blocks below — use the list on the left to switch between them.</span>
          </div>
          <PageSectionBuilder
            sections={blocks}
            onChange={setBlocks}
            apiToken={apiToken}
            activeIndex={activeIndex}
            onActiveIndexChange={setActiveIndex}
            variant="homepage"
          />
        </div>

        <aside className="admin-homepage-builder-preview" aria-label="Section preview">
          <div className="admin-homepage-builder-preview-head">
            <Eye size={15} />
            <strong>Live preview</strong>
            <span>{placementLabel(placement)}</span>
          </div>
          <div className="admin-homepage-builder-preview-frame">
            {previewBlocks.length ? (
              <HomepageCustomBlocks blocks={previewBlocks} preview />
            ) : (
              <div className="admin-homepage-blocks-preview-empty">
                <LayoutGrid size={36} strokeWidth={1.25} />
                <p>Add a section to preview it here</p>
                <small>Sections appear {placementLabel(placement).toLowerCase()} on the live homepage.</small>
              </div>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}
