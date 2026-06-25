import { useEffect, useState } from "react";
import { getImageUrl } from "../styles/themeUtils";

function DefaultLogo() {
  return (
    <a href="/" className="header-brand-link" aria-label="PNGUM home">
      <div className="brand-mark brand-lockup">
        <span className="brand-icon" aria-hidden="true">
          <svg viewBox="0 0 120 120">
            <path d="M58 18c-8 10-12 18-12 28 0 7 2 13 7 18-14-8-20-19-20-31 0-10 6-19 18-30l7 15z" />
            <path d="M74 22c9 8 14 16 14 25 0 8-4 15-11 21 4-6 5-12 3-18-2-8-7-15-14-22l8-6z" />
            <path d="M60 55c4 7 6 13 6 19 0 8-3 15-9 21 2-6 2-12 0-18-2-6-6-12-11-18l14-4z" />
            <path d="M23 85l29-4h16l29 4-8 11H31l-8-11z" />
            <path d="M58 72h4v32h-4z" />
          </svg>
        </span>
        <span>
          PAPUA NEW GUINEA
          <br />
          Union Mission
        </span>
      </div>
    </a>
  );
}

const fallbackMenu = [
  { label: "Home", link: "/" },
  { label: "Ministries", link: "#ministries" },
  { label: "Updates", link: "#updates" },
  { label: "Giving", link: "#support" },
];

function NavItem({ item, idx, resolveNavHref, closeMenu }) {
  const children = Array.isArray(item.children) ? item.children.filter((child) => child?.label) : [];
  const href = resolveNavHref(item.link);

  if (!children.length) {
    return (
      <a key={`${item.label}-${idx}`} href={href} onClick={closeMenu}>
        {item.label}
      </a>
    );
  }

  return (
    <div key={`${item.label}-${idx}`} className="header-nav-group">
      <a href={href} onClick={closeMenu} className="header-nav-parent">
        {item.label}
      </a>
      <div className="header-nav-dropdown">
        {children.map((child, childIdx) => (
          <a key={`${child.label}-${childIdx}`} href={resolveNavHref(child.link)} onClick={closeMenu}>
            {child.label}
          </a>
        ))}
      </div>
    </div>
  );
}

export default function Header({ settings }) {
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  useEffect(() => {
    function onResize() {
      if (window.innerWidth > 900) setMenuOpen(false);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;

    function onKeyDown(event) {
      if (event.key === "Escape") closeMenu();
    }

    document.body.classList.add("nav-open");
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.classList.remove("nav-open");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const menuItems = settings?.menuItems?.length ? settings.menuItems : fallbackMenu;
  const logo = settings?.logo || settings?.logoUrl ? getImageUrl(settings.logo, settings.logoUrl) : null;
  const currentPath = typeof window !== "undefined" ? window.location.pathname : "/";

  function resolveNavHref(rawLink) {
    const link = (rawLink || "#").trim();
    if (!link) return "#";
    if (link.startsWith("http://") || link.startsWith("https://")) return link;
    if (link.startsWith("#")) return currentPath === "/" ? link : `/${link}`;
    if (link.startsWith("/")) return link;
    return `/${link}`;
  }

  const headerStyle = settings
    ? {
        backgroundColor: settings.backgroundColor,
        color: settings.textColor,
        fontFamily: settings.fontFamily,
      }
    : undefined;

  return (
    <header
      className={`site-header${menuOpen ? " site-header--menu-open" : ""}`}
      style={headerStyle}
    >
      {menuOpen ? (
        <button type="button" className="header-backdrop" aria-label="Close menu" onClick={closeMenu} />
      ) : null}

      <div className="container header-toolbar">
        <div className="header-brand-slot">
          {logo ? (
            <a href="/" className="header-brand-link" aria-label="PNGUM home">
              <img className="header-logo" src={logo} alt="PNGUM logo" />
            </a>
          ) : (
            <DefaultLogo />
          )}
        </div>

        <button
          type="button"
          className="header-menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="site-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
          <span className="header-menu-icon" aria-hidden="true">
            <span className="header-menu-bar" />
            <span className="header-menu-bar" />
            <span className="header-menu-bar" />
          </span>
        </button>

        <nav
          id="site-navigation"
          className={`header-nav${menuOpen ? " is-open" : ""}`}
          aria-label="Main navigation"
        >
          <div className="header-nav-panel">
            {menuItems.map((item, idx) => (
              <NavItem key={`${item.label}-${idx}`} item={item} idx={idx} resolveNavHref={resolveNavHref} closeMenu={closeMenu} />
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
