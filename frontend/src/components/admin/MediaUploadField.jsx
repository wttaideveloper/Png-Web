import { useRef, useState } from "react";
import { uploadMedia } from "../../api/strapi";
import { getImageUrl } from "../../styles/themeUtils";

function isVideoUrl(url = "") {
  return /\.(mp4|webm|ogg|mov)(\?|$)/i.test(url);
}

export default function MediaUploadField({
  label,
  value = { id: null, url: "" },
  onChange,
  apiToken,
  accept = "image/*,video/*",
  helpText,
  mode = "image",
}) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const previewUrl = value?.url ? getImageUrl(value) : "";
  const showVideo = mode === "video" || isVideoUrl(previewUrl);

  async function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError("");
    setUploading(true);
    try {
      const uploaded = await uploadMedia(file, apiToken);
      onChange({
        id: uploaded.id,
        url: uploaded.url || "",
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
    <div className="media-upload-field rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950/20">
      <label className="text-sm font-medium text-slate-800 dark:text-slate-100">{label}</label>
      {helpText && <p className="help-text text-xs">{helpText}</p>}

      <div className="media-upload-box border-0 bg-transparent p-0">
        {previewUrl ? (
          <div className="media-preview rounded-lg">
            {showVideo ? (
              <video src={previewUrl} controls muted playsInline />
            ) : (
              <img src={previewUrl} alt={label || "Preview"} />
            )}
          </div>
        ) : (
          <div className="media-preview media-preview-empty">
            <span>No {mode === "video" ? "video" : "image"} added yet</span>
          </div>
        )}

        <div className="media-upload-actions">
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="media-file-input"
            onChange={handleFileChange}
          />
          <button type="button" className="secondary-btn rounded-md" disabled={uploading} onClick={() => inputRef.current?.click()}>
            {uploading ? "Uploading..." : `Upload ${mode === "video" ? "Video" : "Image"}`}
          </button>
          {previewUrl && (
            <button type="button" className="ghost-btn" onClick={clearMedia}>
              Remove
            </button>
          )}
        </div>

        <label className="media-url-label text-xs font-medium text-slate-600 dark:text-slate-300">Or paste URL</label>
        <input
          className="rounded-md border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
          value={value?.url || ""}
          placeholder="https://..."
          onChange={(e) => onChange({ id: null, url: e.target.value })}
        />
      </div>

      {error && <p className="err-msg">{error}</p>}
    </div>
  );
}
