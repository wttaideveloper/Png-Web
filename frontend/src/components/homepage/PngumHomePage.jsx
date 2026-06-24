import { sampleHomePage } from "../../mock/sampleHomePage";
import HeroSlider from "./HeroSlider";
import { getImageUrl, hexToRgba, mergeItems, parseButtonStyle, parseSectionStyle, parseTypography } from "../../styles/themeUtils";

function byName(sections, sectionName) {
  return (sections || []).find((item) => item.sectionName === sectionName && item.isActive !== false);
}

function titlePair(section, fallbackTop, fallbackBottom) {
  const combined = section?.title || "";
  if (combined.includes("|")) {
    const [top, bottom] = combined.split("|").map((value) => value.trim());
    return [top || fallbackTop, bottom || fallbackBottom];
  }
  return [section?.title || fallbackTop, section?.subtitle || fallbackBottom];
}

function coverStyle(imageUrl) {
  if (!imageUrl) return undefined;
  return {
    backgroundImage: `linear-gradient(125deg, rgba(4,22,42,0.88), rgba(8,57,86,0.52)), url(${imageUrl})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };
}

function resolveMediaUrl(...candidates) {
  for (const candidate of candidates) {
    const url = getImageUrl(candidate);
    if (url) return url;
  }
  return "";
}

function isVideoLike(candidate, url) {
  if (!url) return false;
  const cleanUrl = url.split("?")[0].toLowerCase();
  const hasVideoExt = /\.(mp4|webm|ogg|ogv|mov|m4v)$/i.test(cleanUrl);
  if (hasVideoExt) return true;
  const mime = candidate?.mime || candidate?.data?.attributes?.mime || "";
  return typeof mime === "string" && mime.startsWith("video/");
}

function getYouTubeEmbedUrl(rawUrl = "") {
  if (!rawUrl) return "";
  try {
    const url = new URL(rawUrl);
    const host = url.hostname.toLowerCase();
    if (host.includes("youtu.be")) {
      const id = url.pathname.replace("/", "");
      return id ? `https://www.youtube.com/embed/${id}` : "";
    }
    if (host.includes("youtube.com")) {
      if (url.pathname.startsWith("/embed/")) return rawUrl;
      if (url.pathname.startsWith("/shorts/")) {
        const id = url.pathname.replace("/shorts/", "").split("/")[0];
        return id ? `https://www.youtube.com/embed/${id}` : "";
      }
      const id = url.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : "";
    }
  } catch {
    return "";
  }
  return "";
}

function ministryImage(item) {
  return resolveMediaUrl(item.image, item.thumbnail, item.imageMedia?.url);
}

function videoThumb(video) {
  return resolveMediaUrl(video.thumbnail, video.image, video.thumbnailMedia?.url);
}

function videoSource(video) {
  const candidates = [video?.video, video?.videoUrl, video?.link, video?.videoMedia];
  for (const candidate of candidates) {
    const url = resolveMediaUrl(candidate, candidate?.url);
    if (isVideoLike(candidate, url)) return url;
  }
  return "";
}

function normalizeMinistryItems(section) {
  const components = section?.ministryItems || [];
  const jsonItems = Array.isArray(section?.items) ? section.items : [];

  if (components.length) {
    return components.map((item) => {
      const jsonItem = jsonItems.find((entry) => entry.title === item.title);
      return {
        ...item,
        image: item.image || jsonItem?.image,
      };
    });
  }

  return jsonItems;
}

function normalizeVideoItems(section) {
  const components = section?.videoItems || [];
  const jsonItems = Array.isArray(section?.mediaItems) ? section.mediaItems : [];

  if (components.length) {
    return components.map((item) => {
      const jsonItem = jsonItems.find((entry) => entry.title === item.title);
      return {
        ...item,
        thumbnail: item.thumbnail,
        image: jsonItem?.image,
        videoUrl: item.link || jsonItem?.videoUrl,
        video: item.video,
        link: item.link || jsonItem?.videoUrl,
      };
    });
  }

  return jsonItems;
}

function normalizeNewsItems(section) {
  const components = section?.newsItems || [];
  const jsonItems = Array.isArray(section?.items) ? section.items : [];

  if (components.length) {
    return components.map((item) => {
      const jsonItem = jsonItems.find((entry) => entry.title === item.title);
      return {
        ...item,
        image: item.image || jsonItem?.image,
      };
    });
  }

  return jsonItems;
}

function VideoBlock({ video, className }) {
  const thumbUrl = videoThumb(video);
  const youtubeUrl = getYouTubeEmbedUrl(video?.link || video?.videoUrl || "");
  const src = videoSource(video);

  if (youtubeUrl) {
    return (
      <div className={className}>
        <iframe
          src={youtubeUrl}
          title={video?.title || "Video"}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  if (src) {
    return (
      <div className={className}>
        <video src={src} controls playsInline poster={thumbUrl || undefined} />
      </div>
    );
  }

  return <div className={className} style={coverStyle(thumbUrl)} />;
}

export default function PngumHomePage({ sections = [] }) {
  const hero = byName(sections, "hero");
  const about = byName(sections, "about");
  const ministriesSection = byName(sections, "services") || byName(sections, "categories");
  const updatesSection = byName(sections, "products") || byName(sections, "testimonials");
  const supportSection = byName(sections, "contact");

  const [heroTop, heroBottom] = titlePair(hero, sampleHomePage.hero.headingTop, sampleHomePage.hero.headingBottom);
  const heroStyle = parseSectionStyle(hero);

  const missionImage = resolveMediaUrl(about?.imageSettings?.image, about?.items?.missionImageUrl);
  const missionBaseStyle = parseSectionStyle(about);
  const missionBg = missionBaseStyle.backgroundColor || "#072b52";
  const missionStyle = {
    ...(missionImage ? { color: missionBaseStyle.color } : missionBaseStyle),
    ...(missionImage
      ? {
          backgroundImage: `linear-gradient(180deg, ${hexToRgba(missionBg, 0.92)}, ${hexToRgba(missionBg, 0.96)}), url(${missionImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
      : {}),
  };

  const missionStats = mergeItems(about?.statItems, about?.items, sampleHomePage.mission.stats);
  const ministryItems = normalizeMinistryItems(ministriesSection);
  const resolvedMinistryItems = ministryItems.length ? ministryItems.slice(0, 6) : sampleHomePage.ministries.items;
  const updatesItems = normalizeNewsItems(updatesSection);
  const resolvedNewsItems = updatesItems.length ? updatesItems : sampleHomePage.updates.news;
  const videoItems = normalizeVideoItems(updatesSection);
  const resolvedVideoItems = videoItems.length ? videoItems : sampleHomePage.updates.videos;
  const supportImage = resolveMediaUrl(supportSection?.imageSettings?.image, supportSection?.items?.backgroundImageUrl);
  const supportStyle = {
    ...parseSectionStyle(supportSection),
    ...(supportImage
      ? {
          backgroundImage: `linear-gradient(120deg, rgba(3,28,57,0.9), rgba(7,43,82,0.82)), url(${supportImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
      : {}),
  };

  const donationItems = mergeItems(
    supportSection?.donationItems,
    supportSection?.items,
    sampleHomePage.support.amounts.map((amount) => ({ amount }))
  );

  const heroPrimaryBtn = hero?.buttonSettings || {};
  const heroSecondaryBtn = hero?.secondaryButtonSettings || sampleHomePage.hero.secondaryCta;

  return (
    <>
      <HeroSlider hero={hero} heroStyle={heroStyle}>
          <p className="eyebrow" style={parseTypography(hero?.subtitleTypography)}>
            {hero?.subtitle || sampleHomePage.hero.eyebrow}
          </p>
          <h1 className="hero-title" style={parseTypography(hero?.titleTypography)}>
            {heroTop}
            <span>{heroBottom}</span>
          </h1>
          <p className="hero-description" style={parseTypography(hero?.bodyTypography)}>
            {hero?.description || sampleHomePage.hero.description}
          </p>
          <div className="hero-actions">
            <a className="btn btn-orange" href={heroPrimaryBtn.link || sampleHomePage.hero.primaryCta.link} style={parseButtonStyle(heroPrimaryBtn)}>
              {heroPrimaryBtn.text || sampleHomePage.hero.primaryCta.text}
            </a>
            <a className="btn btn-outline" href={heroSecondaryBtn.link || sampleHomePage.hero.secondaryCta.link} style={parseButtonStyle(heroSecondaryBtn)}>
              {heroSecondaryBtn.text || sampleHomePage.hero.secondaryCta.text}
            </a>
          </div>
      </HeroSlider>

      <section className="pngum-mission" style={missionStyle}>
        <div className="container">
          <p className="eyebrow" style={parseTypography(about?.subtitleTypography)}>
            {about?.subtitle || sampleHomePage.mission.eyebrow}
          </p>
          <h2 style={parseTypography(about?.titleTypography)}>{about?.title || sampleHomePage.mission.title}</h2>
          <p className="muted" style={parseTypography(about?.bodyTypography)}>
            {about?.description || sampleHomePage.mission.description}
          </p>
          <div className="stats-grid">
            {missionStats.map((item, idx) => (
              <div key={`${item.label || item.title}-${idx}`} className="stat-item">
                <strong>{item.value || item.title || "0"}</strong>
                <span>{item.label || item.subtitle || "METRIC"}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pngum-ministries" id="ministries" aria-labelledby="ministries-heading" style={parseSectionStyle(ministriesSection)}>
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow" style={parseTypography(ministriesSection?.subtitleTypography)}>
                {ministriesSection?.subtitle || sampleHomePage.ministries.eyebrow}
              </p>
              <h2 id="ministries-heading" style={parseTypography(ministriesSection?.titleTypography)}>
                {ministriesSection?.title || sampleHomePage.ministries.title}
              </h2>
            </div>
            <a href={ministriesSection?.buttonSettings?.link || "#"} style={parseButtonStyle(ministriesSection?.buttonSettings)}>
              {ministriesSection?.buttonSettings?.text || `${sampleHomePage.ministries.ctaText} →`}
            </a>
          </div>
          <div className="ministry-grid">
            {resolvedMinistryItems.map((item, idx) => (
              <article key={`${item.title}-${idx}`} className="ministry-card">
                <div className="ministry-cover" style={coverStyle(ministryImage(item))} />
                <div className="ministry-body">
                  <h3>{item.title}</h3>
                  <p>{item.desc || item.description}</p>
                  <a href={item.link || "#"}>{item.cta || item.buttonText || "Learn More"} →</a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pngum-updates" id="updates" aria-labelledby="updates-heading" style={parseSectionStyle(updatesSection)}>
        <div className="container updates-layout">
          <div>
            <p className="eyebrow" style={parseTypography(updatesSection?.subtitleTypography)}>
              {updatesSection?.subtitle || sampleHomePage.updates.eyebrow}
            </p>
            <h2 id="updates-heading" style={parseTypography(updatesSection?.titleTypography)}>
              {updatesSection?.title || sampleHomePage.updates.title}
            </h2>
            <div className="news-list">
              {resolvedNewsItems.map((item, idx) => (
                <article key={`${item.title}-${idx}`} className="news-item">
                  {resolveMediaUrl(item.image) && (
                    <div className="news-thumb" style={coverStyle(resolveMediaUrl(item.image))} />
                  )}
                  <div className="news-meta">
                    <span>{item.tag || item.category || "News"}</span> {item.date || item.publishedAt || ""}
                  </div>
                  <h3>{item.title}</h3>
                </article>
              ))}
            </div>
          </div>
          <div>
            {resolvedVideoItems[0] ? <VideoBlock video={resolvedVideoItems[0]} className="video-large" /> : null}
            <div className="video-grid">
              {resolvedVideoItems.slice(1).map((video, idx) => (
                <article key={`${video.title}-${idx}`} className="video-card">
                  <VideoBlock video={video} className="video-thumb" />
                  <h3>{video.title}</h3>
                  <p>{video.meta || video.description || ""}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pngum-support" id="support" aria-labelledby="support-heading" style={supportStyle}>
        <div className="container">
          <p className="eyebrow" style={parseTypography(supportSection?.subtitleTypography)}>
            {supportSection?.subtitle || sampleHomePage.support.eyebrow}
          </p>
          <h2 id="support-heading" style={parseTypography(supportSection?.titleTypography)}>
            {supportSection?.title || sampleHomePage.support.title}
          </h2>
          <p style={parseTypography(supportSection?.bodyTypography)}>
            {supportSection?.description || sampleHomePage.support.description}
          </p>
          <div className="support-actions">
            {donationItems.map((item, idx) => (
              <button key={`${item.amount || item.value}-${idx}`} type="button" className="btn btn-outline">
                {item.amount || item.value}
              </button>
            ))}
            <button type="button" className="btn btn-orange" style={parseButtonStyle(supportSection?.buttonSettings)}>
              {supportSection?.buttonSettings?.text || sampleHomePage.support.cta}
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
