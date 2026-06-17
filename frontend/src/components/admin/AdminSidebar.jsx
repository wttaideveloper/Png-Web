import { ChevronLeft, ChevronRight, ExternalLink, Search, X } from "lucide-react";
import { panelGroups } from "./panelConfig";
import { cn } from "../../lib/utils";

export default function AdminSidebar({
  activePanel,
  onSelectPanel,
  collapsed,
  onToggleCollapsed,
  mobileOpen,
  onCloseMobile,
  search,
  onSearchChange,
}) {
  const query = search.trim().toLowerCase();

  const filteredGroups = panelGroups
    .map((group) => ({
      ...group,
      panels: group.panels.filter((panel) => {
        if (!query) return true;
        return (
          panel.label.toLowerCase().includes(query) ||
          panel.hint?.toLowerCase().includes(query) ||
          group.label.toLowerCase().includes(query)
        );
      }),
    }))
    .filter((group) => group.panels.length > 0);

  return (
    <>
      {mobileOpen ? <button type="button" className="admin-sidebar-backdrop" onClick={onCloseMobile} aria-label="Close menu" /> : null}

      <aside
        className={cn(
          "admin-sidebar-v2",
          collapsed && "admin-sidebar-v2-collapsed",
          mobileOpen && "admin-sidebar-v2-mobile-open"
        )}
      >
        <div className="admin-sidebar-brand">
          {!collapsed ? (
            <div>
              <p className="admin-sidebar-eyebrow">PNGUM</p>
              <h2>Admin Portal</h2>
            </div>
          ) : (
            <span className="admin-sidebar-mark">P</span>
          )}
          <button type="button" className="admin-icon-btn admin-sidebar-collapse" onClick={onToggleCollapsed} aria-label="Toggle sidebar">
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {!collapsed ? (
          <div className="admin-sidebar-search">
            <Search size={16} />
            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search sections..."
              aria-label="Search admin sections"
            />
            {search ? (
              <button type="button" className="admin-icon-btn" onClick={() => onSearchChange("")} aria-label="Clear search">
                <X size={14} />
              </button>
            ) : null}
          </div>
        ) : null}

        <nav className="admin-sidebar-nav">
          {filteredGroups.map((group) => (
            <div key={group.id} className="admin-sidebar-group">
              {!collapsed ? <p className="admin-sidebar-group-label">{group.label}</p> : null}
              {group.panels.map((panel) => {
                const Icon = panel.icon;
                const active = activePanel === panel.id;
                return (
                  <button
                    key={panel.id}
                    type="button"
                    className={cn("admin-nav-item", active && "admin-nav-item-active")}
                    onClick={() => onSelectPanel(panel.id)}
                    title={collapsed ? panel.label : undefined}
                  >
                    <Icon size={18} className="admin-nav-icon" />
                    {!collapsed ? (
                      <span className="admin-nav-copy">
                        <span className="admin-nav-label">{panel.label}</span>
                        <span className="admin-nav-hint">{panel.hint}</span>
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <a className="admin-preview-btn" href="/" target="_blank" rel="noreferrer">
          <ExternalLink size={16} />
          {!collapsed ? <span>Preview homepage</span> : null}
        </a>
      </aside>
    </>
  );
}
