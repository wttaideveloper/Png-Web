import { useRef, useState } from "react";
import { ImageIcon } from "lucide-react";
import { uploadMedia } from "../../api/strapi";
import { getImageUrl } from "../../styles/themeUtils";

/** Compact image upload for hero slide rows — no horizontal overflow. */
export default function HeroSlideImageField({
  value = { id: null, url: "" },
  onChange,
  apiToken,
  accept = "image/*",
}) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const previewUrl = value?.url ? getImageUrl(value.url) : "";

  async function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError("");
    setUploading(true);
    try {
      const uploaded = await uploadMedia(file, apiToken);
      onChange({
        id: uploaded.id,
        url: uploaded.url,
        mime: uploaded.mime,
        name: uploaded.name,
      });
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function clearMedia() {
    onChange({ id: null, url: "" });
    setError("");
  }

  return (
    <div className="admin-hero-slide-image-field">
      <div
        className={`admin-hero-slide-thumb-box${previewUrl ? " has-image" : ""}`}
        style={previewUrl ? { backgroundImage: `url(${previewUrl})` } : undefined}
      >
        {!previewUrl ? (
          <span className="admin-hero-slide-thumb-placeholder">
            <ImageIcon size={18} />
          </span>
        ) : null}
      </div>

      <div className="admin-hero-slide-image-controls">
        <div className="admin-hero-slide-upload-row">
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="media-file-input"
            onChange={handleFileChange}
          />
          <button
            type="button"
            className="admin-hero-slide-btn"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? "Uploading…" : "Upload"}
          </button>
          {previewUrl ? (
            <button type="button" className="admin-hero-slide-btn admin-hero-slide-btn-ghost" onClick={clearMedia}>
              Remove
            </button>
          ) : null}
        </div>

        <label className="admin-hero-slide-url-label">Or paste image URL</label>
        <input
          className="admin-field-input admin-hero-slide-url-input"
          value={value?.url || ""}
          placeholder="https://…"
          onChange={(e) => onChange({ id: null, url: e.target.value })}
        />

        {error ? <p className="err-msg">{error}</p> : null}
      </div>
    </div>
  );
}
