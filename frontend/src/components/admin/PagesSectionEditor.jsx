import { useState } from "react";
import PagesTableEditor from "./PagesTableEditor";
import MenuManagementEditor from "./MenuManagementEditor";
import { SectionEditorShell } from "./editorUi";

const TABS = [
  { id: "pages", label: "Pages" },
  { id: "menu", label: "Menu" },
];

export default function PagesSectionEditor({
  pages,
  onAdd,
  onUpdate,
  onRemove,
  onReplacePages,
  onSaveDraft,
  hasChanges,
  saving,
  apiToken,
}) {
  const [tab, setTab] = useState("pages");

  return (
    <SectionEditorShell
      kicker="Navigation"
      title="Pages & Menu"
      description="Create content pages and organize the site navigation."
    >
      <div className="admin-section-tabs">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`admin-section-tab${tab === item.id ? " admin-section-tab-active" : ""}`}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "pages" ? (
        <PagesTableEditor pages={pages} onAdd={onAdd} onUpdate={onUpdate} onRemove={onRemove} apiToken={apiToken} />
      ) : (
        <MenuManagementEditor
          pages={pages}
          onChange={onReplacePages}
          onSaveDraft={onSaveDraft}
          hasChanges={hasChanges}
          saving={saving}
        />
      )}
    </SectionEditorShell>
  );
}
