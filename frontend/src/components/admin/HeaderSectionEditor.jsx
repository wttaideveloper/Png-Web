import { MousePointerClick, PanelTop, Sidebar } from "lucide-react";
import { getImageUrl } from "../../styles/themeUtils";
import MediaUploadField from "./MediaUploadField";
import {
  CheckboxField,
  ColorField,
  EditorBlock,
  PreviewPanel,
  SectionEditorShell,
  SectionLayout,
  TextInput,
} from "./editorUi";

export default function HeaderSectionEditor({ form, updateField, apiToken }) {
  const logoUrl = getImageUrl(form.headerLogo);
  const railLogoUrl = getImageUrl(form.railLogo);

  return (
    <SectionEditorShell
      kicker="Site setup / Header"
      title="Header & right rail"
      description="Top navigation bar, logo, give button, and the orange seventh-day rail."
    >
      <SectionLayout
        formColumn={
          <>
            <EditorBlock icon={PanelTop} title="Header bar" description="Colors and logo for the sticky top navigation.">
              <div className="admin-field-grid-2">
                <ColorField label="Background" value={form.headerBg} onChange={(v) => updateField("headerBg", v)} />
                <ColorField label="Text color" value={form.headerText} onChange={(v) => updateField("headerText", v)} />
              </div>
              <MediaUploadField
                label="Header logo"
                apiToken={apiToken}
                value={form.headerLogo}
                onChange={(v) => updateField("headerLogo", v)}
                helpText="Appears in the top-left of the navigation."
              />
            </EditorBlock>
            <EditorBlock icon={MousePointerClick} title="Give Now button" description="Call-to-action shown in the header.">
              <div className="admin-field-grid-2">
                <TextInput label="Button text" value={form.headerCtaText} onChange={(v) => updateField("headerCtaText", v)} placeholder="Give Now" />
                <TextInput label="Button link" value={form.headerCtaLink} onChange={(v) => updateField("headerCtaLink", v)} placeholder="#support" hint="Use #support or a full URL." />
              </div>
              <p className="admin-inline-tip">Menu links are managed in Pages & Menus.</p>
            </EditorBlock>
            <EditorBlock icon={Sidebar} title="Right rail" description="Orange vertical strip with the SDA logo.">
              <div className="admin-field-grid-2">
                <ColorField label="Rail color" value={form.railBg} onChange={(v) => updateField("railBg", v)} />
                <TextInput label="Rail width" value={form.railWidth} onChange={(v) => updateField("railWidth", v)} placeholder="132px" />
              </div>
              <MediaUploadField
                label="Rail logo"
                apiToken={apiToken}
                value={form.railLogo}
                onChange={(v) => updateField("railLogo", v)}
                helpText="Replaces the default SDA logo in the right rail. Leave empty to use the built-in logo."
              />
              <CheckboxField
                id="show-rail-logo"
                label="Show logo in right rail"
                checked={form.showRailLogo}
                onChange={(v) => updateField("showRailLogo", v)}
              />
            </EditorBlock>
          </>
        }
        previewColumn={
          <PreviewPanel footnote="Navigation links come from Pages & Menus.">
            <div className="admin-header-preview">
              <div className="admin-header-preview-bar" style={{ background: form.headerBg, color: form.headerText }}>
                {logoUrl ? <img src={logoUrl} alt="" className="admin-header-preview-logo" /> : <span className="admin-header-preview-brand">PNGUM</span>}
                <span className="admin-header-preview-nav">Home · Ministries · Updates</span>
                <span className="admin-header-preview-cta">{form.headerCtaText || "Give Now"}</span>
              </div>
              <div className="admin-header-preview-page">
                <div className="admin-header-preview-content" style={{ background: form.backgroundColor || "#efefea" }} />
                <div className="admin-header-preview-rail" style={{ background: form.railBg, width: form.railWidth || "48px" }}>
                  {form.showRailLogo ? (
                    railLogoUrl ? (
                      <img src={railLogoUrl} alt="" className="admin-header-preview-rail-logo" />
                    ) : (
                      <span>✦</span>
                    )
                  ) : null}
                </div>
              </div>
            </div>
          </PreviewPanel>
        }
      />
    </SectionEditorShell>
  );
}
