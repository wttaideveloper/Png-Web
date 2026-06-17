import { ExternalLink } from "lucide-react";
import FormField from "./FormField";

export function SectionEditorShell({ kicker, title, description, previewHref = "/", children }) {
  return (
    <section className="admin-section-editor">
      <header className="admin-section-editor-head">
        <div>
          <p className="admin-section-kicker">{kicker}</p>
          <h2>{title}</h2>
          {description ? <p className="help-text">{description}</p> : null}
        </div>
        <a className="admin-ghost-btn" href={previewHref} target="_blank" rel="noreferrer">
          <ExternalLink size={15} />
          Preview on site
        </a>
      </header>
      {children}
    </section>
  );
}

export function SectionLayout({ formColumn, previewColumn }) {
  return (
    <div className="admin-section-layout">
      <div className="admin-section-form">{formColumn}</div>
      {previewColumn ? <aside className="admin-section-preview-wrap">{previewColumn}</aside> : null}
    </div>
  );
}

export function PreviewPanel({ label = "Live preview", footnote, children }) {
  return (
    <>
      <p className="admin-preview-label">{label}</p>
      {children}
      {footnote ? <p className="admin-preview-footnote">{footnote}</p> : null}
    </>
  );
}

export function EditorBlock({ icon: Icon, title, description, children }) {
  return (
    <article className="admin-editor-block">
      <div className="admin-editor-block-title">
        {Icon ? <Icon size={18} /> : null}
        <div>
          <h3>{title}</h3>
          {description ? <p>{description}</p> : null}
        </div>
      </div>
      {children}
    </article>
  );
}

export function ColorField({ label, hint, value, onChange }) {
  return (
    <FormField label={label} hint={hint}>
      <div className="admin-color-row">
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} aria-label={`${label} picker`} />
        <input className="admin-field-input" value={value} onChange={(e) => onChange(e.target.value)} />
      </div>
    </FormField>
  );
}

export function TextInput({ label, hint, value, onChange, placeholder, id }) {
  return (
    <FormField label={label} hint={hint} htmlFor={id}>
      <input
        id={id}
        className="admin-field-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </FormField>
  );
}

export function TextArea({ label, hint, value, onChange, placeholder, rows = 4, id }) {
  return (
    <FormField label={label} hint={hint} htmlFor={id}>
      <textarea
        id={id}
        className="admin-field-textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
      />
    </FormField>
  );
}

export function SelectInput({ label, hint, value, onChange, options, id }) {
  return (
    <FormField label={label} hint={hint} htmlFor={id}>
      <select id={id} className="admin-field-select" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FormField>
  );
}

export function CheckboxField({ label, checked, onChange, id }) {
  return (
    <label className="admin-checkbox-v2" htmlFor={id}>
      <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>{label}</span>
    </label>
  );
}
