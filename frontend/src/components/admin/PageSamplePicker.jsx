import { useState } from "react";
import { ChevronDown, ChevronUp, LayoutTemplate, Plus, Sparkles } from "lucide-react";
import {
  PAGE_QUICK_ADDS,
  PAGE_TEMPLATES,
  sectionTypeLabel,
} from "../../utils/pageSections";

function blockChips(sectionTypes = []) {
  return sectionTypes.map((type) => sectionTypeLabel(type)).join(" · ");
}

export default function PageSamplePicker({
  variant = "compact",
  collapsible = false,
  selectedTemplateId,
  onSelectTemplate,
  onApplyQuickAdd,
  hasSections = false,
}) {
  const [open, setOpen] = useState(!collapsible);
  const templates = PAGE_TEMPLATES.filter((item) => item.id !== "blank");

  if (variant === "hero") {
    return (
      <div className="admin-page-sample-hero">
        <div className="admin-page-sample-hero-head">
          <Sparkles size={22} />
          <div>
            <h3>Start with a sample layout</h3>
            <p>Pick a ready-made page structure — then replace the sample text and photos with your own.</p>
          </div>
        </div>
        <div className="admin-template-grid admin-page-sample-template-grid">
          {templates.map((template) => (
            <button
              key={template.id}
              type="button"
              className="admin-template-card admin-page-sample-template-card"
              onClick={() => onSelectTemplate?.(template.id, "replace")}
            >
              <span className="admin-template-emoji" aria-hidden="true">
                {template.emoji}
              </span>
              <strong>{template.label}</strong>
              <p>{template.description}</p>
              <span className="admin-template-meta">{blockChips(template.sections)}</span>
            </button>
          ))}
        </div>
        <p className="admin-page-sample-or">or add one section at a time below</p>
        <div className="admin-page-quick-add-row">
          {PAGE_QUICK_ADDS.map((item) => (
            <button
              key={item.id}
              type="button"
              className="admin-page-quick-add-chip"
              onClick={() => onApplyQuickAdd?.(item.id)}
            >
              <span aria-hidden="true">{item.emoji}</span>
              {item.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`admin-page-sample-compact${open ? " is-open" : ""}`}>
      <button
        type="button"
        className="admin-page-sample-compact-toggle"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        <LayoutTemplate size={16} />
        <span>
          <strong>{hasSections ? "Add sections from samples" : "Sample layouts"}</strong>
          <small>{hasSections ? "One click to append pre-built blocks" : "Jump-start your page"}</small>
        </span>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {open ? (
        <div className="admin-page-sample-compact-body">
          <div className="admin-template-grid admin-page-sample-compact-grid">
            {templates.map((template) => (
              <button
                key={template.id}
                type="button"
                className={`admin-template-card admin-page-sample-compact-card${selectedTemplateId === template.id ? " active" : ""}`}
                onClick={() => onSelectTemplate?.(template.id, hasSections ? "append" : "replace")}
                title={hasSections ? `Add ${template.label} blocks` : `Use ${template.label} layout`}
              >
                <span className="admin-template-emoji" aria-hidden="true">
                  {template.emoji}
                </span>
                <strong>{template.label}</strong>
                <p>{template.description}</p>
              </button>
            ))}
          </div>

          <div className="admin-page-quick-add-row">
            {PAGE_QUICK_ADDS.map((item) => (
              <button
                key={item.id}
                type="button"
                className="admin-page-quick-add-chip"
                onClick={() => onApplyQuickAdd?.(item.id)}
                title={item.description}
              >
                <span aria-hidden="true">{item.emoji}</span>
                {item.label}
                <Plus size={12} className="admin-page-quick-add-plus" />
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
