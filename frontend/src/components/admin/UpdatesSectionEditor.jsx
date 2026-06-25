import { useState } from "react";
import { Newspaper, Type, Video } from "lucide-react";
import { fetchYouTubeMeta } from "../../utils/youtubeMeta";
import { getImageUrl } from "../../styles/themeUtils";
import ListCardEditor from "./ListCardEditor";
import MediaUploadField from "./MediaUploadField";
import {
  EditorBlock,
  PreviewPanel,
  SectionEditorShell,
  SectionLayout,
  TextInput,
} from "./editorUi";

export default function UpdatesSectionEditor({ form, updateField, updateListField, apiToken }) {
  const [fetchingVideoIndex, setFetchingVideoIndex] = useState(null);
  const [videoFetchError, setVideoFetchError] = useState("");
  const news = form.newsItems || [];
  const videos = form.videoItems || [];

  async function fetchVideoDetails(index) {
    const item = videos[index];
    if (!item?.videoLink?.trim()) return;

    setFetchingVideoIndex(index);
    setVideoFetchError("");
    try {
      const meta = await fetchYouTubeMeta(item.videoLink);
      const next = videos.map((entry, idx) =>
        idx === index
          ? {
              ...entry,
              title: meta.title || entry.title,
              description: meta.description || entry.description,
              thumbnailMedia: meta.thumbnailUrl
                ? { id: null, url: meta.thumbnailUrl }
                : entry.thumbnailMedia,
            }
          : entry
      );
      updateListField("videoItems", next);
    } catch (error) {
      setVideoFetchError(error.message || "Could not fetch YouTube details");
    } finally {
      setFetchingVideoIndex(null);
    }
  }

  return (
    <SectionEditorShell
      kicker="Homepage / Updates"
      title="Updates & media"
      description="News articles on the left and video cards on the right."
      previewHref="/#updates"
    >
      <SectionLayout
        formColumn={
          <>
            <EditorBlock icon={Type} title="Section header" description="Eyebrow and title for the updates block.">
              <TextInput label="Eyebrow" value={form.updatesEyebrow} onChange={(v) => updateField("updatesEyebrow", v)} placeholder="MEDIA & UPDATES" />
              <TextInput label="Section title" value={form.updatesTitle} onChange={(v) => updateField("updatesTitle", v)} placeholder="Latest from PNGUM" />
            </EditorBlock>
            <EditorBlock icon={Newspaper} title="News & announcements" description="Headlines with optional category, date, and image.">
              <TextInput
                label="News column heading"
                value={form.updatesNewsHeading}
                onChange={(v) => updateField("updatesNewsHeading", v)}
                placeholder="News & Announcements"
              />
              <TextInput
                label="All news link"
                value={form.updatesAllNewsLink}
                onChange={(v) => updateField("updatesAllNewsLink", v)}
                placeholder="/news"
              />
              <ListCardEditor
                items={form.newsItems}
                apiToken={apiToken}
                emptyItem={{ tag: "", date: "", title: "", imageMedia: { id: null, url: "" } }}
                addLabel="Add news item"
                fields={[
                  { key: "tag", label: "Category", placeholder: "Evangelism" },
                  { key: "date", label: "Date", placeholder: "May 25, 2026" },
                  { key: "title", label: "Headline", placeholder: "Campaign reaches 15,000 decisions" },
                ]}
                mediaFields={[{ key: "imageMedia", label: "News image (optional)" }]}
                onChange={(v) => updateListField("newsItems", v)}
              />
            </EditorBlock>
            <EditorBlock icon={Video} title="Featured videos" description="Paste a YouTube link, then fetch title and thumbnail automatically.">
              <TextInput
                label="Videos column heading"
                value={form.updatesVideosHeading}
                onChange={(v) => updateField("updatesVideosHeading", v)}
                placeholder="Featured Videos"
              />
              <TextInput
                label="View all videos link"
                value={form.updatesAllVideosLink}
                onChange={(v) => updateField("updatesAllVideosLink", v)}
                placeholder="/videos"
              />
              <div className="admin-list-editor">
                {videos.map((item, index) => (
                  <div key={index} className="admin-list-card">
                    <div className="admin-list-card-head">
                      <strong>{item.title || `Video ${index + 1}`}</strong>
                      <button
                        type="button"
                        className="admin-ghost-btn admin-list-remove"
                        onClick={() => updateListField("videoItems", videos.filter((_, idx) => idx !== index))}
                      >
                        Remove
                      </button>
                    </div>
                    <div className="admin-list-card-body">
                      <div className="admin-form-field">
                        <label className="admin-form-label">YouTube URL</label>
                        <div className="admin-inline-action-row">
                          <input
                            className="admin-field-input"
                            value={item.videoLink || ""}
                            onChange={(e) =>
                              updateListField(
                                "videoItems",
                                videos.map((entry, idx) =>
                                  idx === index ? { ...entry, videoLink: e.target.value } : entry
                                )
                              )
                            }
                            placeholder="https://youtube.com/watch?v=..."
                          />
                          <button
                            type="button"
                            className="admin-ghost-btn"
                            disabled={fetchingVideoIndex === index}
                            onClick={() => fetchVideoDetails(index)}
                          >
                            {fetchingVideoIndex === index ? "Fetching..." : "Fetch from YouTube"}
                          </button>
                        </div>
                      </div>
                      <div className="admin-form-field">
                        <label className="admin-form-label">Title</label>
                        <input
                          className="admin-field-input"
                          value={item.title || ""}
                          onChange={(e) =>
                            updateListField(
                              "videoItems",
                              videos.map((entry, idx) =>
                                idx === index ? { ...entry, title: e.target.value } : entry
                              )
                            )
                          }
                        />
                      </div>
                      <div className="admin-form-field">
                        <label className="admin-form-label">Channel / views</label>
                        <input
                          className="admin-field-input"
                          value={item.description || ""}
                          onChange={(e) =>
                            updateListField(
                              "videoItems",
                              videos.map((entry, idx) =>
                                idx === index ? { ...entry, description: e.target.value } : entry
                              )
                            )
                          }
                          placeholder="Auto-filled from YouTube"
                        />
                      </div>
                      <MediaUploadField
                        label="Thumbnail (optional override)"
                        apiToken={apiToken}
                        value={item.thumbnailMedia || { id: null, url: "" }}
                        onChange={(value) =>
                          updateListField(
                            "videoItems",
                            videos.map((entry, idx) =>
                              idx === index ? { ...entry, thumbnailMedia: value } : entry
                            )
                          )
                        }
                      />
                    </div>
                  </div>
                ))}
                {videoFetchError ? <p className="err-msg">{videoFetchError}</p> : null}
                <button
                  type="button"
                  className="admin-add-btn"
                  onClick={() =>
                    updateListField("videoItems", [
                      ...videos,
                      {
                        title: "",
                        description: "",
                        videoLink: "",
                        thumbnailMedia: { id: null, url: "" },
                      },
                    ])
                  }
                >
                  + Add video
                </button>
              </div>
            </EditorBlock>
          </>
        }
        previewColumn={
          <PreviewPanel footnote="Videos embed YouTube when a link is provided.">
            <div className="admin-updates-preview">
              <p className="admin-updates-preview-eyebrow">{form.updatesEyebrow || "MEDIA & UPDATES"}</p>
              <h3>{form.updatesTitle || "Latest from PNGUM"}</h3>
              <div className="admin-updates-preview-split">
                <div>
                  <strong>{form.updatesNewsHeading || "News & Announcements"}</strong>
                  {news.slice(0, 2).map((item, i) => (
                    <article key={i} className="admin-news-preview-item">
                      <span>{item.tag || "News"} · {item.date}</span>
                      <strong>{item.title}</strong>
                    </article>
                  ))}
                </div>
                <div className="admin-video-preview-card">
                  {getImageUrl(videos[0]?.thumbnailMedia) ? (
                    <div className="admin-video-preview-thumb" style={{ backgroundImage: `url(${getImageUrl(videos[0].thumbnailMedia)})` }} />
                  ) : (
                    <div className="admin-video-preview-thumb admin-video-preview-thumb-empty">Video</div>
                  )}
                  <strong>{videos[0]?.title || "Featured video"}</strong>
                  <p>{videos[0]?.description || ""}</p>
                </div>
              </div>
            </div>
          </PreviewPanel>
        }
      />
    </SectionEditorShell>
  );
}
