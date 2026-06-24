import { useMemo } from "react";
import { ArrowDown, ArrowUp, Eye, ImageIcon, MousePointerClick, Plus, Trash2, Type } from "lucide-react";
import { sampleHomePage } from "../../mock/sampleHomePage";
import useHeroSlideCarousel from "../../hooks/useHeroSlideCarousel";
import { buildPreviewHero, resolveHeroSlidesFromForm } from "../../utils/heroSlides";
import HeroSlider, { HeroSliderDots, HeroSliderTrack } from "../homepage/HeroSlider";
import HeroSlideImageField from "./HeroSlideImageField";
import MediaUploadField from "./MediaUploadField";
import {
  EditorBlock,
  PreviewPanel,
  SectionEditorShell,
  SectionLayout,
  TextArea,
  TextInput,
} from "./editorUi";

export default function HeroSectionEditor({ form, updateField, updateListField, apiToken }) {
  const slides = form.heroSlides?.length ? form.heroSlides : [];
  const resolvedSlides = useMemo(
    () => resolveHeroSlidesFromForm(slides, form.heroImage),
    [slides, form.heroImage]
  );
  const { activeIndex, setActiveIndex } = useHeroSlideCarousel(resolvedSlides);
  const previewHero = useMemo(
    () => buildPreviewHero(slides, form.heroImage),
    [slides, form.heroImage]
  );

  const eyebrow = form.heroSubtitle || sampleHomePage.hero.eyebrow;
  const line1 = form.heroLine1 || sampleHomePage.hero.headingTop;
  const line2 = form.heroLine2 || sampleHomePage.hero.headingBottom;
  const description = form.heroDescription || sampleHomePage.hero.description;
  const primaryText = form.heroPrimaryBtnText || sampleHomePage.hero.primaryCta.text;
  const secondaryText = form.heroSecondaryBtnText || sampleHomePage.hero.secondaryCta.text;

  function addSlide() {
    const next = [
      ...slides,
      { imageMedia: { id: null, url: "" }, durationSeconds: 5 },
    ];
    updateListField("heroSlides", next);
    setActiveIndex(next.length - 1);
  }

  function updateSlide(index, key, value) {
    const next = slides.map((slide, i) => (i === index ? { ...slide, [key]: value } : slide));
    updateListField("heroSlides", next);
  }

  function removeSlide(index) {
    const next = slides.filter((_, i) => i !== index);
    updateListField("heroSlides", next);
    setActiveIndex(Math.max(0, index - 1));
  }

  function moveSlide(index, direction) {
    const next = [...slides];
    const swap = direction === "up" ? index - 1 : index + 1;
    if (swap < 0 || swap >= next.length) return;
    [next[index], next[swap]] = [next[swap], next[index]];
    updateListField("heroSlides", next);
    setActiveIndex(swap);
  }

  return (
    <SectionEditorShell
      kicker="Homepage / Hero"
      title="Hero banner slider"
      description="Add multiple slides, set display order, and choose how long each slide stays visible."
    >
      <SectionLayout
        formColumn={
          <>
            <EditorBlock icon={Type} title="Headline" description="Eyebrow and two-line main heading.">
              <TextInput label="Eyebrow text" value={form.heroSubtitle} onChange={(v) => updateField("heroSubtitle", v)} placeholder="SEVENTH-DAY ADVENTIST CHURCH..." />
              <div className="admin-field-grid-2">
                <TextInput label="Title line 1" value={form.heroLine1} onChange={(v) => updateField("heroLine1", v)} placeholder="Serving God's People" />
                <TextInput label="Title line 2" value={form.heroLine2} onChange={(v) => updateField("heroLine2", v)} placeholder="Across the Islands" />
              </div>
            </EditorBlock>

            <EditorBlock icon={Type} title="Intro paragraph" description="Supporting text under the headline.">
              <TextArea label="Description" value={form.heroDescription} onChange={(v) => updateField("heroDescription", v)} placeholder="Proclaiming the everlasting gospel..." />
            </EditorBlock>

            <EditorBlock icon={ImageIcon} title="Slider images" description="First slide shows first. Reorder with arrows. Each slide uses its own duration in seconds.">
              {resolvedSlides.length > 0 ? (
                <div className="admin-hero-inline-slider">
                  <HeroSliderTrack slides={resolvedSlides} activeIndex={activeIndex} />
                  <HeroSliderDots slides={resolvedSlides} activeIndex={activeIndex} onSelect={setActiveIndex} />
                  <span className="admin-hero-inline-slider-meta">
                    Slide {activeIndex + 1} of {resolvedSlides.length} · {resolvedSlides[activeIndex]?.durationSeconds || 5}s
                  </span>
                </div>
              ) : null}

              <div className="admin-hero-slides-toolbar">
                <button type="button" className="admin-primary-btn" onClick={addSlide}>
                  <Plus size={16} />
                  Add Slide
                </button>
                <span className="admin-pages-toolbar-hint">{slides.length} slide{slides.length === 1 ? "" : "s"}</span>
              </div>

              {slides.length ? (
                <div className="admin-hero-slide-list">
                  {slides.map((slide, index) => (
                    <article
                      key={`slide-${index}`}
                      className={`admin-hero-slide-card${activeIndex === index ? " is-active" : ""}`}
                    >
                      <div className="admin-hero-slide-card-top">
                        <div className="admin-hero-slide-card-title">
                          <span className="admin-hero-slide-order">{index + 1}</span>
                          <span>Slide {index + 1}</span>
                        </div>
                        <div className="admin-hero-slide-card-actions">
                          <button
                            type="button"
                            className="admin-table-icon-btn"
                            onClick={() => setActiveIndex(index)}
                            title="Preview in slider"
                            aria-label={`Preview slide ${index + 1}`}
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            type="button"
                            className="admin-table-icon-btn"
                            disabled={index === 0}
                            onClick={() => moveSlide(index, "up")}
                            aria-label="Move up"
                          >
                            <ArrowUp size={16} />
                          </button>
                          <button
                            type="button"
                            className="admin-table-icon-btn"
                            disabled={index === slides.length - 1}
                            onClick={() => moveSlide(index, "down")}
                            aria-label="Move down"
                          >
                            <ArrowDown size={16} />
                          </button>
                          <button
                            type="button"
                            className="admin-table-icon-btn admin-table-icon-btn-danger"
                            onClick={() => removeSlide(index)}
                            aria-label="Delete slide"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <HeroSlideImageField
                        apiToken={apiToken}
                        value={slide.imageMedia || { id: null, url: "" }}
                        onChange={(v) => updateSlide(index, "imageMedia", v)}
                        accept="image/*"
                      />

                      <div className="admin-hero-slide-duration-row">
                        <label htmlFor={`hero-slide-duration-${index}`}>Duration (seconds)</label>
                        <input
                          id={`hero-slide-duration-${index}`}
                          type="number"
                          className="admin-field-input admin-hero-duration-input"
                          min={2}
                          max={60}
                          step={1}
                          value={slide.durationSeconds ?? 5}
                          onChange={(e) => updateSlide(index, "durationSeconds", Number(e.target.value) || 5)}
                        />
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="admin-hero-slide-empty">
                  No slides yet. Click <strong>Add Slide</strong> or upload a fallback image below.
                </p>
              )}

              <MediaUploadField
                label="Fallback hero image (used if no slides)"
                apiToken={apiToken}
                value={form.heroImage}
                onChange={(v) => updateField("heroImage", v)}
                helpText="Optional backup when the slider is empty."
                accept="image/*"
              />
            </EditorBlock>

            <EditorBlock icon={MousePointerClick} title="Call-to-action buttons" description="Primary (filled) and secondary (outline) buttons.">
              <div className="admin-cta-grid">
                <div className="admin-cta-card admin-cta-card-primary">
                  <p className="admin-cta-card-label">Primary button</p>
                  <TextInput label="Button text" value={form.heroPrimaryBtnText} onChange={(v) => updateField("heroPrimaryBtnText", v)} placeholder="OUR MINISTRIES" />
                  <TextInput label="Link" value={form.heroPrimaryBtnLink} onChange={(v) => updateField("heroPrimaryBtnLink", v)} placeholder="/ministries" />
                </div>
                <div className="admin-cta-card admin-cta-card-secondary">
                  <p className="admin-cta-card-label">Secondary button</p>
                  <TextInput label="Button text" value={form.heroSecondaryBtnText} onChange={(v) => updateField("heroSecondaryBtnText", v)} placeholder="LATEST UPDATES" />
                  <TextInput label="Link" value={form.heroSecondaryBtnLink} onChange={(v) => updateField("heroSecondaryBtnLink", v)} placeholder="#updates" />
                </div>
              </div>
            </EditorBlock>
          </>
        }
        previewColumn={
          <PreviewPanel footnote="Preview auto-rotates using each slide's duration. Publish to update the live homepage slider.">
            <div className="admin-hero-preview-slider">
              <HeroSlider hero={previewHero} autoPlay>
                <p className="admin-hero-preview-eyebrow">{eyebrow}</p>
                <h3 className="admin-hero-preview-title">
                  {line1}
                  <span>{line2}</span>
                </h3>
                <p className="admin-hero-preview-desc">{description}</p>
                <div className="admin-hero-preview-actions">
                  <span className="admin-hero-preview-btn admin-hero-preview-btn-primary">{primaryText}</span>
                  <span className="admin-hero-preview-btn admin-hero-preview-btn-secondary">{secondaryText}</span>
                </div>
              </HeroSlider>
            </div>
          </PreviewPanel>
        }
      />
    </SectionEditorShell>
  );
}
