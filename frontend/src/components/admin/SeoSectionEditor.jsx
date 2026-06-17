import { Search } from "lucide-react";
import { getImageUrl } from "../../styles/themeUtils";
import MediaUploadField from "./MediaUploadField";
import {
  EditorBlock,
  PreviewPanel,
  SectionEditorShell,
  SectionLayout,
  TextArea,
  TextInput,
} from "./editorUi";

export default function SeoSectionEditor({ form, updateField, apiToken }) {
  const ogImageUrl = getImageUrl(form.seoOgImage?.url);

  return (
    <SectionEditorShell
      kicker="Site setup / SEO"
      title="Search & social"
      description="Meta tags for search engines and social sharing. Saved to Strapi seoSettings."
    >
      <SectionLayout
        formColumn={
          <>
            <EditorBlock icon={Search} title="Page metadata" description="Title and description shown in Google and browser tabs.">
              <TextInput
                label="Meta title"
                value={form.seoMetaTitle}
                onChange={(v) => updateField("seoMetaTitle", v)}
                placeholder="Papua New Guinea Union Mission"
              />
              <TextArea
                label="Meta description"
                value={form.seoMetaDescription}
                onChange={(v) => updateField("seoMetaDescription", v)}
                rows={3}
                placeholder="Short summary for search results"
              />
              <TextInput
                label="Keywords"
                value={form.seoKeywords}
                onChange={(v) => updateField("seoKeywords", v)}
                placeholder="church, PNG, adventist"
                hint="Comma-separated keywords."
              />
            </EditorBlock>
            <EditorBlock icon={Search} title="Social preview image" description="Open Graph image when the site is shared on social media.">
              <MediaUploadField
                label="OG image"
                apiToken={apiToken}
                value={form.seoOgImage}
                onChange={(v) => updateField("seoOgImage", v)}
              />
            </EditorBlock>
          </>
        }
        previewColumn={
          <PreviewPanel footnote="Applied to the public site on load.">
            <div className="admin-seo-preview">
              <p className="admin-seo-preview-title">{form.seoMetaTitle || "Page title"}</p>
              <p className="admin-seo-preview-url">pngum.org</p>
              <p className="admin-seo-preview-desc">
                {form.seoMetaDescription || "Meta description appears here in search results."}
              </p>
              {ogImageUrl ? <img src={ogImageUrl} alt="" className="admin-seo-preview-image" /> : null}
            </div>
          </PreviewPanel>
        }
      />
    </SectionEditorShell>
  );
}
