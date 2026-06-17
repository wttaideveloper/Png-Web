import HeaderSection from "./sections/HeaderSection";
import HeroSection from "./sections/HeroSection";
import AboutSection from "./sections/AboutSection";
import ServicesSection from "./sections/ServicesSection";
import CategoriesSection from "./sections/CategoriesSection";
import ProductsSection from "./sections/ProductsSection";
import TestimonialsSection from "./sections/TestimonialsSection";
import FAQSection from "./sections/FAQSection";
import ContactSection from "./sections/ContactSection";
import FooterSection from "./sections/FooterSection";

const sectionMap = {
  header: HeaderSection,
  hero: HeroSection,
  about: AboutSection,
  services: ServicesSection,
  categories: CategoriesSection,
  products: ProductsSection,
  testimonials: TestimonialsSection,
  faq: FAQSection,
  contact: ContactSection,
  footer: FooterSection,
};

export default function SectionRenderer({ sections }) {
  return sections
    .filter((section) => section.isActive && ![ "header", "footer" ].includes(section.sectionName))
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
    .map((section) => {
      const Component = sectionMap[section.sectionName] || HeroSection;
      return <Component key={section.id || `${section.sectionName}-${section.displayOrder}`} section={section} />;
    });
}
