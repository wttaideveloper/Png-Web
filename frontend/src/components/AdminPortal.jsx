import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { LogOut, Menu, Moon, RefreshCw, Save, Sun } from "lucide-react";
import { fetchAdminHomePage, fetchCurrentUser, fetchHomePage, loginAdmin, publishHomePage, saveAndPublishHomePage, saveHomePageDraft } from "../api/strapi";
import { buildFormFromData, buildPayloadFromForm, applyNavigationPagesToData, enrichHomePageData } from "./admin/adminFormState";
import { createPageId } from "../utils/menuUtils";
import { sectionsFromTemplate } from "../utils/pageSections";
import AdminLogin from "./admin/AdminLogin";
import AdminSidebar from "./admin/AdminSidebar";
import AdminOverview from "./admin/AdminOverview";
import AdminToast from "./admin/AdminToast";
import HeroSectionEditor from "./admin/HeroSectionEditor";
import ThemeSectionEditor from "./admin/ThemeSectionEditor";
import HeaderSectionEditor from "./admin/HeaderSectionEditor";
import PagesSectionEditor from "./admin/PagesSectionEditor";
import MissionSectionEditor from "./admin/MissionSectionEditor";
import MinistriesSectionEditor from "./admin/MinistriesSectionEditor";
import UpdatesSectionEditor from "./admin/UpdatesSectionEditor";
import SupportSectionEditor from "./admin/SupportSectionEditor";
import HomepageBuilderEditor from "./admin/HomepageBuilderEditor";
import FooterSectionEditor from "./admin/FooterSectionEditor";
import SeoSectionEditor from "./admin/SeoSectionEditor";
import { findPanel } from "./admin/panelConfig";
import { slugify } from "../utils/pageUtils";
import { emptyMediaRef } from "../styles/themeUtils";

const ADMIN_PANEL_KEY = "portal_active_panel";

function readStoredPanel() {
  try {
    const stored = sessionStorage.getItem(ADMIN_PANEL_KEY);
    return stored && findPanel(stored).id === stored ? stored : "overview";
  } catch {
    return "overview";
  }
}
const panels = [
  { id: "overview", label: "Dashboard", section: "Overview" },
  { id: "theme", label: "Theme & Branding", section: "Global" },
  { id: "seo", label: "SEO & Social", section: "SEO" },
  { id: "header", label: "Header & Rail", section: "Header" },
  { id: "pages", label: "Pages & Navigation", section: "Menus" },
  { id: "hero", label: "Hero", section: "Hero" },
  { id: "homepage-builder", label: "Add Sections", section: "Builder" },
  { id: "mission", label: "Mission", section: "Mission" },
  { id: "ministries", label: "Ministries", section: "Ministries" },
  { id: "updates", label: "Updates & Media", section: "News & Videos" },
  { id: "support", label: "Support / Giving", section: "Support" },
  { id: "footer", label: "Footer", section: "Footer" },
];

export default function AdminPortal({ data, onSaved }) {
  const LAST_LIVE_BACKUP_KEY = "portal_last_live_backup_payload_v1";
  const [apiToken, setApiToken] = useState(() => localStorage.getItem("portal_token") || "");
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [credentials, setCredentials] = useState({ identifier: "", password: "" });
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [reloading, setReloading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [activePanel, setActivePanel] = useState(readStoredPanel);
  const [lastSavedAt, setLastSavedAt] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const [form, setForm] = useState(() => buildFormFromData(data));
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("portal_dark_mode") === "1");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [navSearch, setNavSearch] = useState("");
  const [toast, setToast] = useState({ message: "", type: "success" });

  function openPanel(panelId) {
    setActivePanel(panelId);
    try {
      sessionStorage.setItem(ADMIN_PANEL_KEY, panelId);
    } catch {
      // ignore storage errors
    }
    setMobileNavOpen(false);
    setNavSearch("");
  }

  useEffect(() => {
    if (!data || hasChanges) return;
    setForm(buildFormFromData(data));
  }, [data, hasChanges]);

  useEffect(() => {
    localStorage.setItem("portal_dark_mode", darkMode ? "1" : "0");
  }, [darkMode]);

  useEffect(() => {
    if (!toast.message) return undefined;
    const timer = setTimeout(() => setToast({ message: "", type: "success" }), 4500);
    return () => clearTimeout(timer);
  }, [toast.message]);

  useEffect(() => {
    async function checkAuth() {
      if (!apiToken) {
        setCheckingSession(false);
        return;
      }
      try {
        const me = await fetchCurrentUser(apiToken);
        setUser(me);
      } catch {
        localStorage.removeItem("portal_token");
        setApiToken("");
        setUser(null);
      } finally {
        setCheckingSession(false);
      }
    }

    checkAuth();
  }, [apiToken]);

  async function onLogin(event) {
    event.preventDefault();
    setAuthError("");
    setAuthLoading(true);
    try {
      const payload = await loginAdmin(credentials.identifier, credentials.password);
      if (!payload?.token) throw new Error("No token returned");
      localStorage.setItem("portal_token", payload.token);
      setApiToken(payload.token);
      setUser(payload.user || null);
      setCredentials({ identifier: "", password: "" });
    } catch (err) {
      setAuthError(err.message || "Login failed");
    } finally {
      setAuthLoading(false);
    }
  }

  function onLogout() {
    localStorage.removeItem("portal_token");
    setApiToken("");
    setUser(null);
    setMessage("");
    setError("");
  }

  function showToast(nextMessage, type = "success") {
    setToast({ message: nextMessage, type });
  }

  function buildCurrentPayload() {
    return buildPayloadFromForm(form, data);
  }

  function buildBackupPayloadFromCurrentLive() {
    if (!data) return null;
    const liveForm = buildFormFromData(data);
    return buildPayloadFromForm(liveForm, data);
  }

  function persistLastLiveBackup(payload) {
    if (!payload) return;
    localStorage.setItem(
      LAST_LIVE_BACKUP_KEY,
      JSON.stringify({
        savedAt: new Date().toISOString(),
        payload,
      }),
    );
  }

  function readLastLiveBackup() {
    try {
      const raw = localStorage.getItem(LAST_LIVE_BACKUP_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed?.payload ? parsed : null;
    } catch {
      return null;
    }
  }

  function notifySiteUpdated() {
    window.dispatchEvent(new CustomEvent("pngum-cms-updated"));
  }

  async function persistHomepage({ publish = true } = {}) {
    const payload = buildCurrentPayload();
    const savedNavigationPages = form.navigationPages || [];
    const saved = publish
      ? await saveAndPublishHomePage(payload, apiToken)
      : await saveHomePageDraft(payload, apiToken);
    let fresh = enrichHomePageData(saved || (await fetchAdminHomePage(apiToken)));
    fresh = applyNavigationPagesToData(fresh, savedNavigationPages);
    onSaved(fresh);
    setForm(buildFormFromData(fresh));
    setLastSavedAt(new Date().toLocaleTimeString());
    setHasChanges(false);
    notifySiteUpdated();
    return fresh;
  }

  async function onSaveDraft() {
    setSaving(true);
    setMessage("");
    setError("");
    try {
      await persistHomepage({ publish: true });
      setMessage("Changes saved and published to the live website.");
      showToast("Saved to Strapi and published. Open the homepage to see updates.");
    } catch (err) {
      const text = err.message || "Save failed";
      setError(text);
      showToast(text, "error");
    } finally {
      setSaving(false);
    }
  }

  async function onPublishLive() {
    const confirmed = window.confirm(
      "Publish these changes to the live site now?\n\nAll homepage sections, hero slider, pages, and menu will update on the public website.",
    );
    if (!confirmed) return;

    setPublishing(true);
    setMessage("");
    setError("");
    try {
      persistLastLiveBackup(buildBackupPayloadFromCurrentLive());
      await persistHomepage({ publish: true });
      showToast("Homepage published to the live website.");
    } catch (err) {
      const text = err.message || "Publish failed";
      setError(text);
      showToast(text, "error");
    } finally {
      setPublishing(false);
    }
  }

  async function onRestoreLastLive() {
    const backup = readLastLiveBackup();
    if (!backup?.payload) {
      showToast("No backup found yet. Publish once to create backup.", "error");
      return;
    }

    const confirmed = window.confirm("Restore the previous live version now?");
    if (!confirmed) return;

    setRestoring(true);
    setMessage("");
    setError("");
    try {
      const saved = await publishHomePage(backup.payload, apiToken);
      const fresh = enrichHomePageData(saved || (await fetchHomePage()));
      onSaved(fresh);
      setForm(buildFormFromData(fresh));
      setHasChanges(false);
      setLastSavedAt(new Date().toLocaleTimeString());
      showToast("Restored previous live version.");
    } catch (err) {
      const text = err.message || "Restore failed";
      setError(text);
      showToast(text, "error");
    } finally {
      setRestoring(false);
    }
  }

  useEffect(() => {
    function onKeyDown(event) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        if (!saving && !publishing && apiToken && user) onSaveDraft();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [saving, publishing, apiToken, user]);

  function updateField(key, value) {
    setHasChanges(true);
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function updateListField(key, value) {
    setHasChanges(true);
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function updateNavPage(index, key, value) {
    const next = [...(form.navigationPages || [])];
    const previous = next[index] || {};
    const item = { ...previous, [key]: value };

    if (key === "title" && item.pageType !== "link") {
      const oldTitleSlug = slugify(previous.title || "");
      const shouldAutoSlug = !previous.slug || previous.slug === oldTitleSlug;
      if (shouldAutoSlug) {
        item.slug = slugify(value);
        item.link = `/${item.slug}`;
      }
    }
    if (key === "slug" && item.pageType !== "link") {
      item.slug = slugify(value);
      item.link = `/${item.slug}`;
    }
    if (key === "pageType") {
      if (value === "content") {
        item.slug = slugify(item.title || "new-page");
        item.link = `/${item.slug}`;
      } else if (!item.link?.startsWith("#") && item.link !== "/") {
        item.link = "#";
      }
    }
    if (key === "link" && item.pageType === "content") {
      const cleaned = value.trim();
      if (cleaned.startsWith("/")) {
        item.link = cleaned;
        item.slug = cleaned.replace(/^\//, "").split("/")[0] || item.slug;
      }
    }

    next[index] = item;
    updateListField("navigationPages", next);
  }

  function replaceNavPages(nextPages) {
    updateListField("navigationPages", nextPages);
  }

  function addNavPage(templateId = "starter", title = "New Page") {
    const slug = slugify(`${title}-${Date.now().toString(36).slice(-4)}`);
    const pageId = createPageId();
    const next = [
      ...(form.navigationPages || []),
      {
        pageId,
        parentId: null,
        menuOrder: (form.navigationPages || []).length,
        title,
        slug,
        link: `/${slug}`,
        pageType: "content",
        eyebrow: "",
        body: "",
        visible: true,
        showInHeader: true,
        showInFooter: false,
        heroImage: emptyMediaRef(),
        showBannerImage: false,
        showSideImage: false,
        showPageButton: false,
        pageButtonText: "",
        pageButtonLink: "",
        bannerImage: emptyMediaRef(),
        sideImage: emptyMediaRef(),
        sections: sectionsFromTemplate(templateId),
      },
    ];
    updateListField("navigationPages", next);
    return { index: next.length - 1, pageId };
  }

  function removeNavPage(index) {
    const next = (form.navigationPages || []).filter((_, idx) => idx !== index);
    updateListField("navigationPages", next);
  }

  function moveNavPage(index, direction) {
    const next = [...(form.navigationPages || [])];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= next.length) return;
    const [item] = next.splice(index, 1);
    next.splice(newIndex, 0, item);
    updateListField("navigationPages", next);
  }

  async function reloadFromStrapiState() {
    setReloading(true);
    setMessage("");
    setError("");
    try {
      const fresh = enrichHomePageData(await fetchAdminHomePage(apiToken));
      const hasStoredPages = Array.isArray(fresh?.sitePages) && fresh.sitePages.length > 0;
      const merged = hasStoredPages ? fresh : applyNavigationPagesToData(fresh, form.navigationPages);
      onSaved(merged);
      setForm(buildFormFromData(merged));
      setHasChanges(false);
      showToast("Reloaded latest content from Strapi.");
    } catch (err) {
      const text = err.message || "Reload failed";
      setError(text);
      showToast(text, "error");
    } finally {
      setReloading(false);
    }
  }

  function applyPreset(preset) {
    setHasChanges(true);
    setForm((prev) => ({
      ...prev,
      primaryColor: preset.primaryColor,
      secondaryColor: preset.secondaryColor,
      backgroundColor: preset.backgroundColor,
      textColor: preset.textColor,
      railBg: preset.railBg,
      headerBg: preset.headerBg,
      headerText: preset.headerText,
    }));
  }

  if (checkingSession) {
    return (
      <div className="admin-login-screen">
        <div className="admin-loading-card">Loading admin workspace...</div>
      </div>
    );
  }

  if (!apiToken || !user) {
    return (
      <AdminLogin
        credentials={credentials}
        setCredentials={setCredentials}
        authError={authError}
        authLoading={authLoading}
        onLogin={onLogin}
      />
    );
  }

  const activeMeta = findPanel(activePanel);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="admin-shell">
        <AdminSidebar
          activePanel={activePanel}
          onSelectPanel={openPanel}
          collapsed={sidebarCollapsed}
          onToggleCollapsed={() => setSidebarCollapsed((v) => !v)}
          mobileOpen={mobileNavOpen}
          onCloseMobile={() => setMobileNavOpen(false)}
          search={navSearch}
          onSearchChange={setNavSearch}
        />

        <div className="admin-main">
          <header className="admin-topbar-v2">
            <div className="admin-topbar-left">
              <button type="button" className="admin-icon-btn admin-mobile-menu" onClick={() => setMobileNavOpen(true)} aria-label="Open menu">
                <Menu size={18} />
              </button>
              <div className="admin-topbar-title-block">
                <p className="admin-breadcrumb">Homepage / {activeMeta.label}</p>
                <h1>{activeMeta.label}</h1>
                <p className="admin-topbar-sub">
                  Signed in as <strong>{user.username || user.email}</strong>
                  <span className="admin-kbd-hint">Ctrl+S to save</span>
                </p>
              </div>
            </div>

            <div className="admin-topbar-toolbar">
              <span className={hasChanges ? "status-pill dirty" : "status-pill clean"}>
                {hasChanges ? "Unsaved changes" : "All changes saved"}
              </span>

              <div className="admin-topbar-btn-group" role="toolbar" aria-label="Editor actions">
                <button type="button" className="admin-icon-btn" onClick={() => setDarkMode((v) => !v)} aria-label="Toggle dark mode">
                  {darkMode ? <Sun size={16} /> : <Moon size={16} />}
                </button>
                <button type="button" className="admin-ghost-btn" disabled={reloading} onClick={reloadFromStrapiState}>
                  <RefreshCw size={16} />
                  {reloading ? "Reloading..." : "Reload"}
                </button>
                <button className="admin-ghost-btn" disabled={saving || publishing || restoring} onClick={onSaveDraft} type="button">
                  <Save size={16} />
                  {saving ? "Saving..." : "Save to Website"}
                </button>
                <button className="admin-primary-btn" disabled={saving || publishing || restoring} onClick={onPublishLive} type="button">
                  <Save size={16} />
                  {publishing ? "Publishing..." : "Publish Live"}
                </button>
                <button type="button" className="admin-ghost-btn" onClick={onRestoreLastLive} disabled={saving || publishing || restoring}>
                  <RefreshCw size={16} />
                  {restoring ? "Restoring..." : "Restore Last Live"}
                </button>
              </div>

              <span className="admin-topbar-toolbar-sep" aria-hidden="true" />

              <button type="button" className="admin-ghost-btn admin-topbar-logout-btn" onClick={onLogout}>
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </header>

          <div className="admin-content">
            {activePanel === "overview" && (
              <AdminOverview
                onOpenPanel={openPanel}
                hasChanges={hasChanges}
                lastSavedAt={lastSavedAt}
                sectionCount={panels.length - 1}
              />
            )}

            {activePanel !== "overview" ? (
            <div className="admin-grid admin-grid-single">
          {activePanel === "theme" && (
            <ThemeSectionEditor form={form} updateField={updateField} onApplyPreset={applyPreset} />
          )}
          {activePanel === "seo" && (
            <SeoSectionEditor form={form} updateField={updateField} apiToken={apiToken} />
          )}
          {activePanel === "header" && (
            <HeaderSectionEditor form={form} updateField={updateField} apiToken={apiToken} />
          )}
          {activePanel === "pages" && (
            <PagesSectionEditor
              pages={form.navigationPages || []}
              onAdd={addNavPage}
              onUpdate={updateNavPage}
              onRemove={removeNavPage}
              onReplacePages={replaceNavPages}
              onSaveDraft={onSaveDraft}
              hasChanges={hasChanges}
              saving={saving}
              apiToken={apiToken}
            />
          )}
          {activePanel === "hero" && (
            <HeroSectionEditor form={form} updateField={updateField} updateListField={updateListField} apiToken={apiToken} />
          )}
          {activePanel === "homepage-builder" && (
            <HomepageBuilderEditor form={form} updateField={updateField} apiToken={apiToken} />
          )}
          {activePanel === "mission" && (
            <MissionSectionEditor form={form} updateField={updateField} updateListField={updateListField} apiToken={apiToken} />
          )}
          {activePanel === "ministries" && (
            <MinistriesSectionEditor form={form} updateField={updateField} updateListField={updateListField} apiToken={apiToken} />
          )}
          {activePanel === "updates" && (
            <UpdatesSectionEditor form={form} updateField={updateField} updateListField={updateListField} apiToken={apiToken} />
          )}
          {activePanel === "support" && (
            <SupportSectionEditor form={form} updateField={updateField} updateListField={updateListField} apiToken={apiToken} />
          )}
          {activePanel === "footer" && (
            <FooterSectionEditor form={form} updateField={updateField} apiToken={apiToken} />
          )}
            </div>
            ) : null}
          </div>

          <AnimatePresence>
            {hasChanges ? (
              <div className="admin-sticky-save">
                <p>You have unsaved changes on the homepage.</p>
                <div className="admin-sticky-save-actions">
                  <button type="button" className="admin-ghost-btn" onClick={reloadFromStrapiState} disabled={reloading}>
                    Discard & reload
                  </button>
                  <button type="button" className="admin-primary-btn" onClick={onSaveDraft} disabled={saving || publishing || restoring}>
                    <Save size={16} />
                    {saving ? "Saving..." : "Save to Website"}
                  </button>
                  <button type="button" className="admin-ghost-btn" onClick={onPublishLive} disabled={saving || publishing || restoring}>
                    Publish Live
                  </button>
                </div>
              </div>
            ) : null}
          </AnimatePresence>

          <AdminToast message={toast.message || error} type={toast.message ? toast.type : error ? "error" : "success"} onClose={() => { setToast({ message: "", type: "success" }); setError(""); }} />
          {message && !toast.message ? <p className="ok-msg">{message}</p> : null}
        </div>
      </div>
    </div>
  );
}
