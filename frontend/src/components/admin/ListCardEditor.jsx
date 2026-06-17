import MediaUploadField from "./MediaUploadField";

export default function ListCardEditor({
  items,
  fields,
  mediaFields = [],
  onChange,
  emptyItem,
  addLabel = "Add item",
  apiToken,
  itemLabel = (index, item) => item.title || item.label || item.amount || `Item ${index + 1}`,
}) {
  function updateItem(index, key, value) {
    onChange(items.map((item, idx) => (idx === index ? { ...item, [key]: value } : item)));
  }

  function removeItem(index) {
    onChange(items.filter((_, idx) => idx !== index));
  }

  function addItem() {
    onChange([...items, { ...emptyItem }]);
  }

  return (
    <div className="admin-list-editor">
      {items.map((item, index) => (
        <div key={index} className="admin-list-card">
          <div className="admin-list-card-head">
            <strong>{itemLabel(index, item)}</strong>
            <button type="button" className="admin-ghost-btn admin-list-remove" onClick={() => removeItem(index)}>
              Remove
            </button>
          </div>
          <div className="admin-list-card-body">
            {fields.map((field) => (
              <div key={field.key} className="admin-form-field">
                <label className="admin-form-label">{field.label}</label>
                {field.type === "textarea" ? (
                  <textarea
                    className="admin-field-textarea"
                    value={item[field.key] || ""}
                    onChange={(e) => updateItem(index, field.key, e.target.value)}
                    placeholder={field.placeholder}
                    rows={3}
                  />
                ) : (
                  <input
                    className="admin-field-input"
                    value={item[field.key] || ""}
                    onChange={(e) => updateItem(index, field.key, e.target.value)}
                    placeholder={field.placeholder}
                  />
                )}
              </div>
            ))}
            {mediaFields.map((field) => (
              <MediaUploadField
                key={field.key}
                label={field.label}
                mode={field.mode || "image"}
                accept={field.accept}
                apiToken={apiToken}
                value={item[field.key] || { id: null, url: "" }}
                onChange={(value) => updateItem(index, field.key, value)}
              />
            ))}
          </div>
        </div>
      ))}
      <button type="button" className="admin-add-btn" onClick={addItem}>
        + {addLabel}
      </button>
    </div>
  );
}
