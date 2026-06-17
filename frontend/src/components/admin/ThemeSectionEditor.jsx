import { Palette, Type } from "lucide-react";
import { colorPresets, fontOptions, headingFontOptions } from "./adminConfig";
import {
  ColorField,
  EditorBlock,
  PreviewPanel,
  SectionEditorShell,
  SectionLayout,
  SelectInput,
} from "./editorUi";

export default function ThemeSectionEditor({ form, updateField, onApplyPreset }) {
  return (
    <SectionEditorShell
      kicker="Site setup / Theme"
      title="Theme & branding"
      description="Global colors and typography used across the entire homepage."
    >
      <SectionLayout
        formColumn={
          <>
            <EditorBlock icon={Palette} title="Color presets" description="Start with a curated palette, then fine-tune below.">
              <div className="admin-preset-grid">
                {colorPresets.map((preset) => (
                  <button key={preset.name} type="button" className="admin-preset-card" onClick={() => onApplyPreset(preset)}>
                    <span className="admin-preset-swatches">
                      <i style={{ background: preset.primaryColor }} />
                      <i style={{ background: preset.secondaryColor }} />
                      <i style={{ background: preset.backgroundColor }} />
                    </span>
                    {preset.name}
                  </button>
                ))}
              </div>
            </EditorBlock>
            <EditorBlock icon={Palette} title="Brand colors" description="Accent, navy, background, and body text colors.">
              <div className="admin-field-grid-2">
                <ColorField label="Primary (accents)" value={form.primaryColor} onChange={(v) => updateField("primaryColor", v)} />
                <ColorField label="Secondary (navy)" value={form.secondaryColor} onChange={(v) => updateField("secondaryColor", v)} />
                <ColorField label="Page background" value={form.backgroundColor} onChange={(v) => updateField("backgroundColor", v)} />
                <ColorField label="Body text" value={form.textColor} onChange={(v) => updateField("textColor", v)} />
              </div>
            </EditorBlock>
            <EditorBlock icon={Type} title="Typography" description="Fonts for body copy and headings.">
              <SelectInput
                id="body-font"
                label="Body font"
                value={form.fontFamily}
                onChange={(v) => updateField("fontFamily", v)}
                options={fontOptions}
              />
              <SelectInput
                id="heading-font"
                label="Heading font"
                value={form.headingFontFamily}
                onChange={(v) => updateField("headingFontFamily", v)}
                options={headingFontOptions}
              />
            </EditorBlock>
          </>
        }
        previewColumn={
          <PreviewPanel footnote="Theme tokens apply site-wide after you save.">
            <div
              className="admin-theme-preview"
              style={{ background: form.backgroundColor, color: form.textColor }}
            >
              <div className="admin-theme-preview-bar" style={{ background: form.secondaryColor }} />
              <div className="admin-theme-preview-body">
                <p style={{ fontFamily: form.fontFamily, margin: 0 }}>
                  Body text preview — proclaiming hope through worship, education, and service.
                </p>
                <h3 style={{ fontFamily: form.headingFontFamily, color: form.secondaryColor, margin: "0.75rem 0 0" }}>
                  Heading preview
                </h3>
                <span className="admin-theme-preview-btn" style={{ background: form.primaryColor }}>
                  Accent button
                </span>
              </div>
            </div>
          </PreviewPanel>
        }
      />
    </SectionEditorShell>
  );
}
