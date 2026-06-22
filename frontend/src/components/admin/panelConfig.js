import {
  BookOpen,
  ExternalLink,
  Heart,
  LayoutDashboard,
  Menu,
  Newspaper,
  Palette,
  PanelBottom,
  PanelTop,
  Route,
  Sparkles,
  Search,
  Target,
} from "lucide-react";

export const panelGroups = [
  {
    id: "start",
    label: "Start",
    panels: [{ id: "overview", label: "Dashboard", icon: LayoutDashboard, hint: "Quick links & status" }],
  },
  {
    id: "setup",
    label: "Site setup",
    panels: [
      { id: "theme", label: "Theme & Branding", icon: Palette, hint: "Colors & fonts" },
      { id: "seo", label: "SEO & Social", icon: Search, hint: "Search & share metadata" },
      { id: "header", label: "Header & Rail", icon: PanelTop, hint: "Logo & navigation bar" },
      { id: "footer", label: "Footer", icon: PanelBottom, hint: "Footer content" },
    ],
  },
  {
    id: "content",
    label: "Homepage sections",
    panels: [
      { id: "hero", label: "Hero", icon: Sparkles, hint: "Top banner" },
      { id: "mission", label: "Mission", icon: Target, hint: "Mission & stats" },
      { id: "ministries", label: "Ministries", icon: BookOpen, hint: "Ministry cards" },
      { id: "updates", label: "Updates & Media", icon: Newspaper, hint: "News & videos" },
      { id: "support", label: "Support / Giving", icon: Heart, hint: "Donation section" },
    ],
  },
  {
    id: "nav",
    label: "Navigation",
    panels: [{ id: "pages", label: "Pages & Menus", icon: Route, hint: "Header & footer links" }],
  },
];

export const allPanels = panelGroups.flatMap((group) => group.panels);

export function findPanel(id) {
  return allPanels.find((panel) => panel.id === id) || allPanels[0];
}

export const quickActions = [
  { id: "pages", label: "Edit menu links", description: "Add, reorder, and hide pages in the header or footer.", icon: Menu },
  { id: "hero", label: "Update hero banner", description: "Change the main headline, image, and call-to-action buttons.", icon: Sparkles },
  { id: "updates", label: "Publish news & videos", description: "Add articles and YouTube or uploaded videos.", icon: Newspaper },
  { id: "theme", label: "Adjust brand colors", description: "Apply a preset or fine-tune colors and fonts.", icon: Palette },
];

export const DEMO_CREDENTIALS = {
  identifier: "clientadmin",
  password: "ClientAdmin123!",
};
