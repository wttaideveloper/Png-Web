import { useRef, useState } from "react";
import { ArrowRight, Sparkles, X } from "lucide-react";
import { PAGE_TEMPLATES } from "../../utils/pageSections";
import { TextInput } from "./editorUi";

export default function NewPageWizard({ onClose, onCreate }) {
  const [templateId, setTemplateId] = useState("starter");
  const [title, setTitle] = useState("");
  const backdropPressedRef = useRef(false);

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
            <h2>Choose a starting layout</h2>
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
            hint="You can change this anytime. We'll create a web address automatically."
          />

          <div className="admin-template-grid">
            {PAGE_TEMPLATES.map((template) => (
              <button
                key={template.id}
                type="button"
                className={`admin-template-card${templateId === template.id ? " active" : ""}`}
                onClick={() => setTemplateId(template.id)}
              >
                <span className="admin-template-emoji" aria-hidden="true">
                  {template.emoji}
                </span>
                <strong>{template.label}</strong>
                <p>{template.description}</p>
                <span className="admin-template-meta">{template.sections.length || "0"} starter blocks</span>
              </button>
            ))}
          </div>
        </div>

        <div className="admin-modal-footer">
          <p className="admin-modal-footer-hint">You&apos;ll add photos, text, and more in the visual editor next.</p>
          <button type="button" className="admin-primary-btn" onClick={handleCreate}>
            Start editing
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
