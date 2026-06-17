import { ImageIcon, MousePointerClick, Type, Wallet } from "lucide-react";
import { sampleHomePage } from "../../mock/sampleHomePage";
import { getImageUrl } from "../../styles/themeUtils";
import ListCardEditor from "./ListCardEditor";
import MediaUploadField from "./MediaUploadField";
import {
  EditorBlock,
  PreviewPanel,
  SectionEditorShell,
  SectionLayout,
  TextArea,
  TextInput,
} from "./editorUi";

export default function SupportSectionEditor({ form, updateField, updateListField, apiToken }) {
  const amounts = form.supportAmounts?.length ? form.supportAmounts : sampleHomePage.support.amounts;
  const imageUrl = getImageUrl(form.supportImage?.url);

  return (
    <SectionEditorShell
      kicker="Homepage / Giving"
      title="Support / giving"
      description="Donation call-to-action with preset amount buttons."
      previewHref="/#support"
    >
      <SectionLayout
        formColumn={
          <>
            <EditorBlock icon={Type} title="Section copy" description="Eyebrow, headline, and description for the giving block.">
              <TextInput label="Eyebrow" value={form.supportEyebrow} onChange={(v) => updateField("supportEyebrow", v)} placeholder="SUPPORT THE MISSION" />
              <TextInput label="Section title" value={form.supportTitle} onChange={(v) => updateField("supportTitle", v)} />
              <TextArea label="Description" value={form.supportDescription} onChange={(v) => updateField("supportDescription", v)} />
            </EditorBlock>
            <EditorBlock icon={ImageIcon} title="Background" description="Optional image behind the giving section.">
              <MediaUploadField
                label="Background image"
                apiToken={apiToken}
                value={form.supportImage}
                onChange={(v) => updateField("supportImage", v)}
              />
            </EditorBlock>
            <EditorBlock icon={Wallet} title="Donation amounts" description="Quick-select amount labels shown as outline buttons.">
              <ListCardEditor
                items={form.supportAmounts}
                apiToken={apiToken}
                emptyItem={{ amount: "K50" }}
                addLabel="Add amount"
                itemLabel={(_, item) => item.amount || "Amount"}
                fields={[{ key: "amount", label: "Amount label", placeholder: "K100" }]}
                onChange={(v) => updateListField("supportAmounts", v)}
              />
            </EditorBlock>
            <EditorBlock icon={MousePointerClick} title="Give button" description="Primary call-to-action below the amount chips.">
              <div className="admin-field-grid-2">
                <TextInput label="Button text" value={form.supportButtonText} onChange={(v) => updateField("supportButtonText", v)} placeholder="Give Now" />
                <TextInput label="Button link" value={form.supportButtonLink} onChange={(v) => updateField("supportButtonLink", v)} placeholder="#support" />
              </div>
            </EditorBlock>
          </>
        }
        previewColumn={
          <PreviewPanel footnote="Amount buttons are display-only until linked to a payment flow.">
            <div
              className="admin-support-preview"
              style={imageUrl ? { backgroundImage: `linear-gradient(rgba(3,28,57,0.88), rgba(3,28,57,0.88)), url(${imageUrl})`, backgroundSize: "cover" } : undefined}
            >
              <p className="admin-support-preview-eyebrow">{form.supportEyebrow || sampleHomePage.support.eyebrow}</p>
              <h3>{form.supportTitle || sampleHomePage.support.title}</h3>
              <p>{form.supportDescription || sampleHomePage.support.description}</p>
              <div className="admin-support-preview-amounts">
                {amounts.slice(0, 4).map((item, i) => (
                  <span key={i}>{item.amount || item}</span>
                ))}
              </div>
              <span className="admin-support-preview-cta">{form.supportButtonText || sampleHomePage.support.cta}</span>
            </div>
          </PreviewPanel>
        }
      />
    </SectionEditorShell>
  );
}
