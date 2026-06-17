import { getImageUrl } from "../styles/themeUtils";
import { formatCopyright, groupFooterLinks, resolveFooterLinks } from "../utils/footerUtils";

const DEFAULT_DESCRIPTION =
  "Seventh-day Adventist Church in Papua New Guinea, proclaiming everlasting hope through worship, education, health, media, and service.";

function DefaultLogo() {
  return (
    <div className="brand-mark brand-lockup footer-brand-mark">
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
  );
}

const defaultColumns = [
  {
    title: "ABOUT",
    links: [
      { label: "Who We Are", link: "#" },
      { label: "Leadership", link: "#" },
      { label: "History", link: "#" },
    ],
  },
  {
    title: "MINISTRIES",
    links: [
      { label: "Education", link: "#" },
      { label: "Health & ADRA", link: "#" },
      { label: "Youth", link: "#" },
    ],
  },
  {
    title: "CONNECT",
    links: [
      { label: "Find a Church", link: "#" },
      { label: "Events Calendar", link: "#" },
      { label: "Contact Us", link: "#" },
    ],
  },
];

function FooterLinkList({ title, links, className = "", grid = false }) {
  if (!links?.length) return null;
  return (
    <div className={`footer-links-col ${className}`.trim()}>
      {title ? <strong>{title}</strong> : null}
      <ul className={`footer-links-list${grid ? " footer-links-list-grid" : ""}`}>
        {links.map((item, idx) => (
          <li key={`${item.label}-${idx}`}>
            <a href={item.link || "#"}>{item.label}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FooterNav({ columns, socialLinks }) {
  const columnCount = Math.min(columns.length, 3);

  return (
    <nav className="footer-nav" aria-label="Footer navigation">
      <div className="footer-nav-columns" style={{ "--footer-cols": String(columnCount) }}>
        {columns.map((column, index) => (
          <FooterLinkList
            key={column.title || `footer-col-${index}`}
            title={column.title}
            links={column.links}
            grid={column.title === "QUICK LINKS" && column.links.length > 4}
          />
        ))}
      </div>
      {socialLinks?.length ? (
        <FooterLinkList
          title="FOLLOW"
          links={socialLinks.map((social) => ({
            label: social.platform,
            link: social.url || "#",
          }))}
          className="footer-social-col"
        />
      ) : null}
    </nav>
  );
}

export default function Footer({ settings, sitePages = [] }) {
  if (!settings) {
    return (
      <footer className="site-footer">
        <div className="container footer-shell">
          <div className="footer-inner">
            <div className="footer-brand">
              <DefaultLogo />
              <p>{DEFAULT_DESCRIPTION}</p>
            </div>
            <FooterNav columns={defaultColumns} />
          </div>
          <div className="footer-bottom">
            <small>{formatCopyright()}</small>
          </div>
        </div>
      </footer>
    );
  }

  const logo = getImageUrl(settings.logo);
  const footerLinks = resolveFooterLinks(settings, sitePages);
  const linkColumns = groupFooterLinks(footerLinks);
  const columns = linkColumns.length ? linkColumns : defaultColumns;
  const socialLinks = (settings.socialLinks || []).filter((item) => item?.platform);
  const description = settings.description?.trim() || DEFAULT_DESCRIPTION;
  const copyright = formatCopyright(settings.copyrightText);

  return (
    <footer
      className="site-footer"
      style={{ backgroundColor: settings.backgroundColor, color: settings.textColor }}
    >
      <div className="container footer-shell">
        <div className="footer-inner footer-inner-dynamic">
          <div className="footer-brand">
            {logo ? <img className="footer-logo" src={logo} alt="PNGUM logo" /> : <DefaultLogo />}
            <p>{description}</p>
          </div>

          <FooterNav columns={columns} socialLinks={socialLinks} />
        </div>

        <div className="footer-bottom">
          <small>{copyright}</small>
        </div>
      </div>
    </footer>
  );
}
