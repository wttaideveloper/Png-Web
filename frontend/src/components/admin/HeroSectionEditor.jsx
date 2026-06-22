import { ImageIcon, MousePointerClick, Type } from "lucide-react";
import { sampleHomePage } from "../../mock/sampleHomePage";
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

function heroPreviewStyle(imageRef) {
  const imageUrl = getImageUrl(imageRef?.url || imageRef);
  if (!imageUrl) return undefined;
  return {
    backgroundImage: `linear-gradient(105deg, rgba(3,38,76,0.94) 0%, rgba(7,45,81,0.88) 36%, rgba(37,77,112,0.46) 100%), url(${imageUrl})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };
}

export default function HeroSectionEditor({ form, updateField, apiToken }) {
  const eyebrow = form.heroSubtitle || sampleHomePage.hero.eyebrow;
  const line1 = form.heroLine1 || sampleHomePage.hero.headingTop;
  const line2 = form.heroLine2 || sampleHomePage.hero.headingBottom;
  const description = form.heroDescription || sampleHomePage.hero.description;
  const primaryText = form.heroPrimaryBtnText || sampleHomePage.hero.primaryCta.text;
  const secondaryText = form.heroSecondaryBtnText || sampleHomePage.hero.secondaryCta.text;

  return (
    <SectionEditorShell
      kicker="Homepage / Hero"
      title="Hero banner"
      description="The first thing visitors see — headline, intro text, background image, and action buttons."
    >
      <SectionLayout
        formColumn={
          <>
            <EditorBlock icon={Type} title="Headline" description="Eyebrow and two-line main heading.">
              <TextInput label="Eyebrow text" hint="Short label above the title." value={form.heroSubtitle} onChange={(v) => updateField("heroSubtitle", v)} placeholder="SEVENTH-DAY ADVENTIST CHURCH..." />
              <div className="admin-field-grid-2">
                <TextInput label="Title line 1" value={form.heroLine1} onChange={(v) => updateField("heroLine1", v)} placeholder="Serving God's People" />
                <TextInput label="Title line 2" hint="Shown in accent color on the site." value={form.heroLine2} onChange={(v) => updateField("heroLine2", v)} placeholder="Across the Islands" />
              </div>
            </EditorBlock>
            <EditorBlock icon={Type} title="Intro paragraph" description="Supporting text under the headline.">
              <TextArea label="Description" value={form.heroDescription} onChange={(v) => updateField("heroDescription", v)} placeholder="Proclaiming the everlasting gospel..." />
            </EditorBlock>
            <EditorBlock icon={ImageIcon} title="Background image" description="Upload or paste a URL for the hero banner background.">
              <MediaUploadField
                label="Hero background image"
                apiToken={apiToken}
                value={form.heroImage}
                onChange={(v) => updateField("heroImage", v)}
                helpText="Recommended: 1920×900px landscape."
                accept="image/*"
              />
            </EditorBlock>
            <EditorBlock icon={MousePointerClick} title="Call-to-action buttons" description="Primary (filled) and secondary (outline) buttons.">
              <div className="admin-cta-grid">
                <div className="admin-cta-card admin-cta-card-primary">
                  <p className="admin-cta-card-label">Primary button</p>
                  <TextInput label="Button text" value={form.heroPrimaryBtnText} onChange={(v) => updateField("heroPrimaryBtnText", v)} placeholder="OUR MINISTRIES" />
                  <TextInput label="Link" value={form.heroPrimaryBtnLink} onChange={(v) => updateField("heroPrimaryBtnLink", v)} placeholder="#ministries" />
                </div>
                <div className="admin-cta-card admin-cta-card-secondary">
                  <p className="admin-cta-card-label">Secondary button</p>
                  <TextInput label="Button text" value={form.heroSecondaryBtnText} onChange={(v) => updateField("heroSecondaryBtnText", v)} placeholder="LATEST UPDATES" />
                  <TextInput label="Link" value={form.heroSecondaryBtnLink} onChange={(v) => updateField("heroSecondaryBtnLink", v)} placeholder="#updates" />
                </div>
              </div>
            </EditorBlock>
          </>
        }
        previewColumn={
          <PreviewPanel footnote="Updates as you type. Save to publish.">
            <div className="admin-hero-preview" style={heroPreviewStyle(form.heroImage)}>
              <div className="admin-hero-preview-inner">
                <p className="admin-hero-preview-eyebrow">{eyebrow}</p>
                <h3 className="admin-hero-preview-title">
                  {line1}
                  <span>{line2}</span>
                </h3>
                <p className="admin-hero-preview-desc">{description}</p>
                <div className="admin-hero-preview-actions">
                  <span className="admin-hero-preview-btn admin-hero-preview-btn-primary">{primaryText}</span>
                  <span className="admin-hero-preview-btn admin-hero-preview-btn-secondary">{secondaryText}</span>
                </div>
              </div>
            </div>
          </PreviewPanel>
        }
      />
    </SectionEditorShell>
  );
}
