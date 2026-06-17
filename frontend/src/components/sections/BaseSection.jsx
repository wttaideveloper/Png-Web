import { getImageUrl, parseButtonStyle, parseSectionStyle, parseTypography } from "../../styles/themeUtils";

function BaseSection({ section }) {
  const titleStyle = parseTypography(section?.titleTypography);
  const subtitleStyle = parseTypography(section?.subtitleTypography);
  const bodyStyle = parseTypography(section?.bodyTypography);
  const buttonStyle = parseButtonStyle(section?.buttonSettings);
  const imageUrl = getImageUrl(section?.imageSettings?.image || section?.media);

  return (
    <section className={`section section-${section.sectionName}`} style={parseSectionStyle(section)}>
      <div className="container" style={{ maxWidth: section.containerWidth || "var(--container-width)" }}>
        <div className={`section-layout ${section.layoutType || "stack"}`}>
          <div className="section-content">
            {section.title && <h2 style={titleStyle}>{section.title}</h2>}
            {section.subtitle && <h3 style={subtitleStyle}>{section.subtitle}</h3>}
            {section.description && <p style={bodyStyle}>{section.description}</p>}
            {section.buttonSettings?.text && (
              <a className="btn" href={section.buttonSettings.link || "#"} style={buttonStyle}>
                {section.buttonSettings.text}
              </a>
            )}
          </div>
          {imageUrl && (
            <div className="section-image">
              <img src={imageUrl} alt={section.imageSettings?.altText || section.title || "section visual"} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default BaseSection;
