import { Copyright, FileText, ImageIcon, Palette } from "lucide-react";
import { getImageUrl } from "../../styles/themeUtils";
import MediaUploadField from "./MediaUploadField";
import {
  ColorField,
  EditorBlock,
  PreviewPanel,
  SectionEditorShell,
  SectionLayout,
  TextArea,
  TextInput,
} from "./editorUi";

export default function FooterSectionEditor({ form, updateField, apiToken }) {
  const logoUrl = getImageUrl(form.footerLogo?.url);

  return (
    <SectionEditorShell
      kicker="Site setup / Footer"
      title="Footer"
      description="Bottom of the homepage with logo, description, and copyright."
    >
      <SectionLayout
        formColumn={
          <>
            <EditorBlock icon={ImageIcon} title="Footer logo" description="Optional logo above the footer description.">
              <MediaUploadField
                label="Footer logo"
                apiToken={apiToken}
                value={form.footerLogo}
                onChange={(v) => updateField("footerLogo", v)}
              />
            </EditorBlock>
            <EditorBlock icon={FileText} title="Footer content" description="Short church description shown in the footer.">
              <TextArea label="Description" value={form.footerDescription} onChange={(v) => updateField("footerDescription", v)} rows={4} />
            </EditorBlock>
            <EditorBlock icon={Copyright} title="Copyright" description="Legal line at the very bottom of the page.">
              <TextInput label="Copyright text" value={form.footerCopyright} onChange={(v) => updateField("footerCopyright", v)} placeholder="© Papua New Guinea Union Mission" />
              <p className="admin-inline-tip">Footer menu links are managed in Pages & Menus.</p>
            </EditorBlock>
            <EditorBlock icon={Palette} title="Footer colors" description="Background and text colors saved to Strapi footerSettings.">
              <div className="admin-field-grid-2">
                <ColorField label="Background" value={form.footerBg} onChange={(v) => updateField("footerBg", v)} />
                <ColorField label="Text" value={form.footerText} onChange={(v) => updateField("footerText", v)} />
              </div>
            </EditorBlock>
          </>
        }
        previewColumn={
          <PreviewPanel footnote="Colors and content sync from Strapi on save.">
            <div className="admin-footer-preview" style={{ background: form.footerBg, color: form.footerText }}>
              {logoUrl ? <img src={logoUrl} alt="" className="admin-footer-preview-logo" /> : null}
              <p>{form.footerDescription}</p>
              <div className="admin-footer-preview-links">
                <span>Who We Are</span>
                <span>Contact</span>
                <span>Giving</span>
              </div>
              <small>{form.footerCopyright}</small>
            </div>
          </PreviewPanel>
        }
      />
    </SectionEditorShell>
  );
}
