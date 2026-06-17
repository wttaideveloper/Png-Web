import { Newspaper, Type, Video } from "lucide-react";
import { sampleHomePage } from "../../mock/sampleHomePage";
import { getImageUrl } from "../../styles/themeUtils";
import ListCardEditor from "./ListCardEditor";
import {
  EditorBlock,
  PreviewPanel,
  SectionEditorShell,
  SectionLayout,
  TextInput,
} from "./editorUi";

export default function UpdatesSectionEditor({ form, updateField, updateListField, apiToken }) {
  const news = form.newsItems?.length ? form.newsItems : sampleHomePage.updates.news;
  const videos = form.videoItems?.length ? form.videoItems : sampleHomePage.updates.videos;

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
            <EditorBlock icon={Newspaper} title="News articles" description="Headlines with optional category, date, and image.">
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
            <EditorBlock icon={Video} title="Video cards" description="YouTube links or uploaded video files with thumbnails.">
              <ListCardEditor
                items={form.videoItems}
                apiToken={apiToken}
                emptyItem={{
                  title: "",
                  description: "",
                  videoLink: "",
                  thumbnailMedia: { id: null, url: "" },
                  videoMedia: { id: null, url: "" },
                }}
                addLabel="Add video"
                fields={[
                  { key: "title", label: "Title", placeholder: "What Do Adventists Believe?" },
                  { key: "description", label: "Meta / views", placeholder: "Hope Channel PNG · 18.4K views" },
                  { key: "videoLink", label: "YouTube / external URL", placeholder: "https://youtube.com/watch?v=..." },
                ]}
                mediaFields={[
                  { key: "thumbnailMedia", label: "Thumbnail" },
                  { key: "videoMedia", label: "Video file", mode: "video", accept: "video/*" },
                ]}
                onChange={(v) => updateListField("videoItems", v)}
              />
            </EditorBlock>
          </>
        }
        previewColumn={
          <PreviewPanel footnote="Videos embed YouTube when a link is provided.">
            <div className="admin-updates-preview">
              <p className="admin-updates-preview-eyebrow">{form.updatesEyebrow || sampleHomePage.updates.eyebrow}</p>
              <h3>{form.updatesTitle || sampleHomePage.updates.title}</h3>
              <div className="admin-updates-preview-split">
                <div>
                  {news.slice(0, 2).map((item, i) => (
                    <article key={i} className="admin-news-preview-item">
                      <span>{item.tag || "News"} · {item.date}</span>
                      <strong>{item.title}</strong>
                    </article>
                  ))}
                </div>
                <div className="admin-video-preview-card">
                  {getImageUrl(videos[0]?.thumbnailMedia?.url) ? (
                    <div className="admin-video-preview-thumb" style={{ backgroundImage: `url(${getImageUrl(videos[0].thumbnailMedia.url)})` }} />
                  ) : (
                    <div className="admin-video-preview-thumb admin-video-preview-thumb-empty">Video</div>
                  )}
                  <strong>{videos[0]?.title}</strong>
                  <p>{videos[0]?.description || videos[0]?.meta}</p>
                </div>
              </div>
            </div>
          </PreviewPanel>
        }
      />
    </SectionEditorShell>
  );
}
