import { BarChart3, ImageIcon, Palette, Target, Type } from "lucide-react";
import { sampleHomePage } from "../../mock/sampleHomePage";
import { getImageUrl, hexToRgba } from "../../styles/themeUtils";
import ListCardEditor from "./ListCardEditor";
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

function missionPreviewStyle(backgroundColor, textColor, imageUrl) {
  const bg = backgroundColor || "#072b52";
  const style = { background: bg, color: textColor || "#ffffff" };
  if (imageUrl) {
    style.backgroundImage = `linear-gradient(${hexToRgba(bg, 0.9)}, ${hexToRgba(bg, 0.9)}), url(${imageUrl})`;
    style.backgroundSize = "cover";
  }
  return style;
}

export default function MissionSectionEditor({ form, updateField, updateListField, apiToken }) {
  const eyebrow = form.missionEyebrow || sampleHomePage.mission.eyebrow;
  const title = form.missionTitle || sampleHomePage.mission.title;
  const description = form.missionDescription || sampleHomePage.mission.description;
  const stats = form.missionStats?.length ? form.missionStats : sampleHomePage.mission.stats;
  const imageUrl = getImageUrl(form.missionImage?.url);
  const previewStyle = missionPreviewStyle(form.missionBgColor, form.missionTextColor, imageUrl);

  return (
    <SectionEditorShell
      kicker="Homepage / Mission"
      title="Mission section"
      description="Mission statement and key statistics shown below the hero."
    >
      <SectionLayout
        formColumn={
          <>
            <EditorBlock icon={Type} title="Section copy" description="Eyebrow, mission statement, and supporting text.">
              <TextInput label="Eyebrow" value={form.missionEyebrow} onChange={(v) => updateField("missionEyebrow", v)} placeholder="OUR MISSION" />
              <TextArea label="Mission title" value={form.missionTitle} onChange={(v) => updateField("missionTitle", v)} rows={3} />
              <TextArea label="Description" value={form.missionDescription} onChange={(v) => updateField("missionDescription", v)} />
            </EditorBlock>
            <EditorBlock icon={ImageIcon} title="Background image" description="Optional image behind the mission block.">
              <MediaUploadField
                label="Mission image"
                apiToken={apiToken}
                value={form.missionImage}
                onChange={(v) => updateField("missionImage", v)}
                helpText="Optional landscape or texture image."
              />
            </EditorBlock>
            <EditorBlock icon={Palette} title="Section colors" description="Background and text colors for the mission block.">
              <div className="admin-field-grid-2">
                <ColorField label="Background" value={form.missionBgColor} onChange={(v) => updateField("missionBgColor", v)} />
                <ColorField label="Text" value={form.missionTextColor} onChange={(v) => updateField("missionTextColor", v)} />
              </div>
            </EditorBlock>
            <EditorBlock icon={BarChart3} title="Statistics" description="Four key numbers displayed in a row.">
              <ListCardEditor
                items={form.missionStats}
                apiToken={apiToken}
                emptyItem={{ value: "", label: "" }}
                addLabel="Add statistic"
                itemLabel={(_, item) => item.label || item.value || "New stat"}
                fields={[
                  { key: "value", label: "Value", placeholder: "250,000+" },
                  { key: "label", label: "Label", placeholder: "CHURCH MEMBERS" },
                ]}
                onChange={(v) => updateListField("missionStats", v)}
              />
            </EditorBlock>
          </>
        }
        previewColumn={
          <PreviewPanel footnote="Stats preview shows up to four items.">
            <div className="admin-mission-preview" style={previewStyle}>
              <p className="admin-mission-preview-eyebrow">{eyebrow}</p>
              <h3>{title}</h3>
              <p className="admin-mission-preview-desc">{description}</p>
              <div className="admin-mission-preview-stats">
                {stats.slice(0, 4).map((item, i) => (
                  <div key={i}>
                    <strong>{item.value}</strong>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </PreviewPanel>
        }
      />
    </SectionEditorShell>
  );
}
