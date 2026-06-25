import PageSectionRenderer from "../PageSectionRenderer";

export default function HomepageCustomBlocks({ blocks = [], preview = false }) {
  if (!blocks.length) return null;

  return (
    <section
      className={`homepage-custom-blocks${preview ? " homepage-custom-blocks-preview" : ""}`}
      aria-label="Additional homepage content"
    >
      <div className={preview ? "homepage-custom-blocks-inner" : "container"}>
        <div className="page-blocks">
          {blocks.map((section, index) => (
            <PageSectionRenderer key={section.id || `${section.type}-${index}`} section={section} />
          ))}
        </div>
      </div>
    </section>
  );
}
