import { useRef, useState } from "react";
import { ArrowRight, Sparkles, X } from "lucide-react";
import { PAGE_TEMPLATES, templatePreviewLabel } from "../../utils/pageSections";
import { TextInput } from "./editorUi";

export default function NewPageWizard({ onClose, onCreate }) {
  const [templateId, setTemplateId] = useState("starter");
  const [title, setTitle] = useState("");
  const backdropPressedRef = useRef(false);
  const selected = PAGE_TEMPLATES.find((item) => item.id === templateId) || PAGE_TEMPLATES[0];

  function handleCreate() {
    const pageTitle = title.trim() || "New Page";
    onCreate({ templateId, title: pageTitle });
  }

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
        className="admin-modal admin-modal-wide"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="admin-modal-header">
          <div>
            <p className="admin-modal-kicker">
              <Sparkles size={14} style={{ display: "inline", verticalAlign: "middle" }} /> Create a new page
            </p>
            <h2>Pick a sample to start from</h2>
            <p className="admin-modal-subtitle">Every layout comes with helpful sample text you can edit — no blank page stress.</p>
          </div>
          <button type="button" className="admin-icon-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="admin-modal-body">
          <TextInput
            label="What is this page called?"
            value={title}
            onChange={setTitle}
            placeholder="e.g. Sabbath School, Youth Ministry, About Us"
            hint="You can change the title anytime. We'll create a web address automatically."
          />

          <p className="admin-homepage-quick-label">Choose a layout</p>
          <div className="admin-template-grid admin-page-wizard-grid">
            {PAGE_TEMPLATES.map((template) => (
              <button
                key={template.id}
                type="button"
                className={`admin-template-card admin-page-wizard-card${templateId === template.id ? " active" : ""}`}
                onClick={() => setTemplateId(template.id)}
              >
                <span className="admin-template-emoji" aria-hidden="true">
                  {template.emoji}
                </span>
                <strong>{template.label}</strong>
                <p>{template.description}</p>
                <span className="admin-template-meta">
                  {template.sections.length ? templatePreviewLabel(template.id) : "Add blocks yourself"}
                </span>
              </button>
            ))}
          </div>

          {selected.sections.length ? (
            <div className="admin-page-wizard-preview-note">
              <strong>Includes:</strong> {templatePreviewLabel(selected.id)} — all sample text is editable in the next step.
            </div>
          ) : (
            <div className="admin-page-wizard-preview-note">
              <strong>Blank start:</strong> You will choose blocks one by one in the visual editor.
            </div>
          )}
        </div>

        <div className="admin-modal-footer">
          <p className="admin-modal-footer-hint">Next you&apos;ll swap sample text and photos for your own content.</p>
          <button type="button" className="admin-primary-btn" onClick={handleCreate}>
            Open page editor
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
