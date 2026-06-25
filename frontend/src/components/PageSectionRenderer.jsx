import { getImageUrl } from "../styles/themeUtils";
import { getYouTubeEmbedUrl, normalizeVideoSlots } from "../utils/videoEmbed";

function paragraphs(text = "") {
  return text
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);
}

function alignClass(align) {
  if (align === "center") return " is-center";
  if (align === "right") return " is-right";
  return " is-left";
}

function VideoEmbed({ videoUrl, caption, title }) {
  const embed = getYouTubeEmbedUrl(videoUrl);
  if (!embed) return null;
  return (
    <figure className="page-block-video-item">
      <div className="page-block-video-frame">
        <iframe src={embed} title={caption || title || "Video"} allowFullScreen loading="lazy" />
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

export default function PageSectionRenderer({ section }) {
  if (!section) return null;

  switch (section.type) {
    case "banner": {
      const url = getImageUrl(section.image);
      if (!url) return null;
      const height = section.height || "medium";
      return (
        <div className={`page-block page-block-banner page-block-banner--${height}`}>
          <img src={url} alt="" />
        </div>
      );
    }

    case "heading":
      return (
        <div className={`page-block page-block-heading${alignClass(section.align)}`}>
          {section.eyebrow ? <p className="page-block-eyebrow">{section.eyebrow}</p> : null}
          {section.title ? <h2>{section.title}</h2> : null}
          {section.subtitle ? <p className="page-block-subtitle">{section.subtitle}</p> : null}
        </div>
      );

    case "text":
      return (
        <div className={`page-block page-block-text page-block-text--${section.size || "normal"} content-prose${alignClass(section.align)}`}>
          {paragraphs(section.content).map((text, index) => (
            <p key={index}>{text}</p>
          ))}
        </div>
      );

    case "image": {
      const url = getImageUrl(section.image);
      if (!url) return null;
      return (
        <figure className={`page-block page-block-image page-block-image--${section.size || "large"}${alignClass(section.align)}`}>
          <img src={url} alt={section.caption || ""} />
          {section.caption ? <figcaption>{section.caption}</figcaption> : null}
        </figure>
      );
    }

    case "split": {
      const url = getImageUrl(section.image);
      const imageLeft = section.imagePosition === "left";
      return (
        <div className={`page-block page-block-split${imageLeft ? " image-left" : " image-right"}`}>
          <div className="page-block-split-text content-prose">
            {paragraphs(section.content).map((text, index) => (
              <p key={index}>{text}</p>
            ))}
          </div>
          {url ? (
            <div className="page-block-split-media">
              <img src={url} alt="" />
            </div>
          ) : null}
        </div>
      );
    }

    case "columns":
      return (
        <div className="page-block page-block-columns">
          <div className="page-block-column content-prose">
            {paragraphs(section.leftContent).map((text, index) => (
              <p key={`l-${index}`}>{text}</p>
            ))}
          </div>
          <div className="page-block-column content-prose">
            {paragraphs(section.rightContent).map((text, index) => (
              <p key={`r-${index}`}>{text}</p>
            ))}
          </div>
        </div>
      );

    case "quote":
      return (
        <blockquote className={`page-block page-block-quote${alignClass(section.align)}`}>
          <p>{section.content}</p>
          {section.author ? <cite>— {section.author}</cite> : null}
        </blockquote>
      );

    case "video": {
      const { columnCount, videos } = normalizeVideoSlots(section);
      const hasAny = videos.some((item) => getYouTubeEmbedUrl(item.videoUrl));
      if (!hasAny) return null;
      return (
        <div className={`page-block page-block-video-grid page-block-video-grid--${columnCount}${alignClass(section.align)}`}>
          {videos.map((item, index) => (
            <VideoEmbed key={`video-${index}`} videoUrl={item.videoUrl} caption={item.caption} title={`Video ${index + 1}`} />
          ))}
        </div>
      );
    }

    case "divider":
      return <div className={`page-block page-block-divider page-block-divider--${section.style || "line"}`} aria-hidden="true" />;

    case "cta":
      return (
        <div className={`page-block page-block-cta${alignClass(section.align)}`}>
          {section.buttonText ? (
            <a className={`btn ${section.style === "outline" ? "btn-outline" : "btn-orange"}`} href={section.buttonLink || "#"}>
              {section.buttonText}
            </a>
          ) : null}
        </div>
      );

    default:
      return null;
  }
}
