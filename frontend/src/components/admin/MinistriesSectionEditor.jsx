import { Grid3x3, Type } from "lucide-react";
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

export default function MinistriesSectionEditor({ form, updateField, updateListField, apiToken }) {
  const items = form.ministryItems?.length ? form.ministryItems : sampleHomePage.ministries.items;

  return (
    <SectionEditorShell
      kicker="Homepage / Ministries"
      title="Ministries section"
      description="Grid of ministry cards with images, descriptions, and links."
      previewHref="/#ministries"
    >
      <SectionLayout
        formColumn={
          <>
            <EditorBlock icon={Type} title="Section header" description="Eyebrow, title, and view-all link.">
              <TextInput label="Eyebrow" value={form.ministriesEyebrow} onChange={(v) => updateField("ministriesEyebrow", v)} placeholder="WHAT WE DO" />
              <TextInput label="Section title" value={form.ministriesTitle} onChange={(v) => updateField("ministriesTitle", v)} placeholder="Our Ministries" />
              <div className="admin-field-grid-2">
                <TextInput label="View all text" value={form.ministriesCtaText} onChange={(v) => updateField("ministriesCtaText", v)} />
                <TextInput label="View all link" value={form.ministriesCtaLink} onChange={(v) => updateField("ministriesCtaLink", v)} placeholder="#ministries" />
              </div>
            </EditorBlock>
            <EditorBlock icon={Grid3x3} title="Ministry cards" description="Each card supports an image, title, description, and button.">
              <ListCardEditor
                items={form.ministryItems}
                apiToken={apiToken}
                emptyItem={{ title: "", description: "", buttonText: "Learn More", link: "#", imageMedia: { id: null, url: "" } }}
                addLabel="Add ministry card"
                fields={[
                  { key: "title", label: "Title", placeholder: "Bible Study" },
                  { key: "description", label: "Description", type: "textarea" },
                  { key: "buttonText", label: "Button text", placeholder: "Start Studying" },
                  { key: "link", label: "Link", placeholder: "#" },
                ]}
                mediaFields={[{ key: "imageMedia", label: "Card image" }]}
                onChange={(v) => updateListField("ministryItems", v)}
              />
            </EditorBlock>
          </>
        }
        previewColumn={
          <PreviewPanel footnote="Showing first 3 cards in preview.">
            <div className="admin-ministries-preview">
              <div className="admin-ministries-preview-head">
                <div>
                  <p>{form.ministriesEyebrow || sampleHomePage.ministries.eyebrow}</p>
                  <h3>{form.ministriesTitle || sampleHomePage.ministries.title}</h3>
                </div>
                <span>{form.ministriesCtaText || sampleHomePage.ministries.ctaText} →</span>
              </div>
              <div className="admin-ministries-preview-grid">
                {items.slice(0, 3).map((item, i) => {
                  const img = getImageUrl(item.imageMedia?.url);
                  return (
                    <article key={i} className="admin-ministry-card-preview">
                      <div className="admin-ministry-card-cover" style={img ? { backgroundImage: `url(${img})` } : undefined} />
                      <strong>{item.title}</strong>
                      <p>{item.description || item.desc}</p>
                    </article>
                  );
                })}
              </div>
            </div>
          </PreviewPanel>
        }
      />
    </SectionEditorShell>
  );
}
