import type { Schema, Struct } from '@strapi/strapi';

export interface PageFooterSettings extends Struct.ComponentSchema {
  collectionName: 'components_page_footer_settings';
  info: {
    displayName: 'Footer Settings';
  };
  attributes: {
    backgroundColor: Schema.Attribute.String;
    copyrightText: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    footerLinks: Schema.Attribute.Component<'shared.menu-item', true>;
    logo: Schema.Attribute.Media<'images'>;
    socialLinks: Schema.Attribute.Component<'shared.social-link', true>;
    textColor: Schema.Attribute.String;
  };
}

export interface PageHeaderSettings extends Struct.ComponentSchema {
  collectionName: 'components_page_header_settings';
  info: {
    displayName: 'Header Settings';
  };
  attributes: {
    backgroundColor: Schema.Attribute.String;
    ctaButton: Schema.Attribute.Component<'shared.button-settings', false>;
    fontFamily: Schema.Attribute.String;
    logo: Schema.Attribute.Media<'images'>;
    menuItems: Schema.Attribute.Component<'shared.menu-item', true>;
    stickyHeader: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    textColor: Schema.Attribute.String;
  };
}

export interface PageHomeSection extends Struct.ComponentSchema {
  collectionName: 'components_page_home_section';
  info: {
    description: 'Dynamic homepage section with content and styling';
    displayName: 'Home Section';
  };
  attributes: {
    bodyTypography: Schema.Attribute.Component<
      'shared.typography-settings',
      false
    >;
    borderRadius: Schema.Attribute.Integer;
    buttonSettings: Schema.Attribute.Component<'shared.button-settings', false>;
    colorSettings: Schema.Attribute.Component<'shared.color-settings', false>;
    containerWidth: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    displayOrder: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    donationItems: Schema.Attribute.Component<'shared.donation-amount', true>;
    featuredItems: Schema.Attribute.JSON;
    imageSettings: Schema.Attribute.Component<'shared.image-settings', false>;
    isActive: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    items: Schema.Attribute.JSON;
    layoutType: Schema.Attribute.Enumeration<['stack', 'split', 'grid']> &
      Schema.Attribute.DefaultTo<'stack'>;
    mediaItems: Schema.Attribute.JSON;
    ministryItems: Schema.Attribute.Component<'shared.ministry-item', true>;
    newsItems: Schema.Attribute.Component<'shared.news-item', true>;
    secondaryButtonSettings: Schema.Attribute.Component<
      'shared.button-settings',
      false
    >;
    sectionName: Schema.Attribute.Enumeration<
      [
        'header',
        'hero',
        'about',
        'services',
        'categories',
        'products',
        'testimonials',
        'faq',
        'contact',
        'footer',
      ]
    > &
      Schema.Attribute.Required;
    seoSettings: Schema.Attribute.Component<'shared.seo-settings', false>;
    spacingSettings: Schema.Attribute.Component<
      'shared.spacing-settings',
      false
    >;
    statItems: Schema.Attribute.Component<'shared.stat-item', true>;
    subtitle: Schema.Attribute.String;
    subtitleTypography: Schema.Attribute.Component<
      'shared.typography-settings',
      false
    >;
    title: Schema.Attribute.String;
    titleTypography: Schema.Attribute.Component<
      'shared.typography-settings',
      false
    >;
    videoItems: Schema.Attribute.Component<'shared.video-item', true>;
  };
}

export interface PageRailSettings extends Struct.ComponentSchema {
  collectionName: 'components_page_rail_settings';
  info: {
    description: 'Right-side seventh-day rail styling';
    displayName: 'Seventh Rail Settings';
  };
  attributes: {
    backgroundColor: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'#f08a16'>;
    logoColor: Schema.Attribute.String & Schema.Attribute.DefaultTo<'#ffffff'>;
    showLogo: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    width: Schema.Attribute.String & Schema.Attribute.DefaultTo<'132px'>;
  };
}

export interface SharedButtonSettings extends Struct.ComponentSchema {
  collectionName: 'components_shared_button_settings';
  info: {
    displayName: 'Button Settings';
  };
  attributes: {
    backgroundColor: Schema.Attribute.String;
    borderRadius: Schema.Attribute.Integer;
    link: Schema.Attribute.String;
    padding: Schema.Attribute.String;
    text: Schema.Attribute.String;
    textColor: Schema.Attribute.String;
  };
}

export interface SharedColorSettings extends Struct.ComponentSchema {
  collectionName: 'components_shared_color_settings';
  info: {
    displayName: 'Color Settings';
  };
  attributes: {
    backgroundColor: Schema.Attribute.String;
    primaryColor: Schema.Attribute.String;
    secondaryColor: Schema.Attribute.String;
    textColor: Schema.Attribute.String;
  };
}

export interface SharedDonationAmount extends Struct.ComponentSchema {
  collectionName: 'components_shared_donation_amounts';
  info: {
    description: 'Donation chip amount label';
    displayName: 'Donation Amount';
  };
  attributes: {
    amount: Schema.Attribute.String & Schema.Attribute.Required;
    link: Schema.Attribute.String;
  };
}

export interface SharedImageSettings extends Struct.ComponentSchema {
  collectionName: 'components_shared_image_settings';
  info: {
    displayName: 'Image Settings';
  };
  attributes: {
    altText: Schema.Attribute.String;
    icon: Schema.Attribute.Media<'images'>;
    image: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedMenuItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_menu_item';
  info: {
    displayName: 'Menu Item';
  };
  attributes: {
    label: Schema.Attribute.String;
    link: Schema.Attribute.String;
  };
}

export interface SharedMinistryItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_ministry_items';
  info: {
    description: 'Ministry card content';
    displayName: 'Ministry Item';
  };
  attributes: {
    buttonText: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    icon: Schema.Attribute.Media<'images'>;
    image: Schema.Attribute.Media<'images'>;
    link: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedNewsItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_news_items';
  info: {
    description: 'News and announcement entry';
    displayName: 'News Item';
  };
  attributes: {
    date: Schema.Attribute.String;
    excerpt: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'>;
    link: Schema.Attribute.String;
    tag: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedSeoSettings extends Struct.ComponentSchema {
  collectionName: 'components_shared_seo_settings';
  info: {
    displayName: 'SEO Settings';
  };
  attributes: {
    keywords: Schema.Attribute.Text;
    metaDescription: Schema.Attribute.Text;
    metaTitle: Schema.Attribute.String;
    ogImage: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_social_link';
  info: {
    displayName: 'Social Link';
  };
  attributes: {
    icon: Schema.Attribute.Media<'images'>;
    platform: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface SharedSpacingSettings extends Struct.ComponentSchema {
  collectionName: 'components_shared_spacing_settings';
  info: {
    displayName: 'Spacing Settings';
  };
  attributes: {
    margin: Schema.Attribute.String;
    padding: Schema.Attribute.String;
    sectionSpacing: Schema.Attribute.String;
  };
}

export interface SharedStatItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_stat_items';
  info: {
    description: 'Mission statistics counter';
    displayName: 'Stat Item';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedThemeSettings extends Struct.ComponentSchema {
  collectionName: 'components_shared_theme_settings';
  info: {
    description: 'Global colors, fonts, and layout tokens';
    displayName: 'Theme Settings';
  };
  attributes: {
    accentOrange: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'#f08a16'>;
    backgroundColor: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'#efefea'>;
    bodyFontSize: Schema.Attribute.String & Schema.Attribute.DefaultTo<'1rem'>;
    borderRadius: Schema.Attribute.String & Schema.Attribute.DefaultTo<'0px'>;
    buttonStyle: Schema.Attribute.Component<'shared.button-settings', false>;
    cardStyle: Schema.Attribute.Component<'shared.spacing-settings', false>;
    containerWidth: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'1180px'>;
    fontFamily: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Inter, system-ui, sans-serif'>;
    headingFontFamily: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Georgia, Times New Roman, serif'>;
    headingFontSize: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'2.8rem'>;
    navyColor: Schema.Attribute.String & Schema.Attribute.DefaultTo<'#072b52'>;
    primaryColor: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'#f08a16'>;
    secondaryColor: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'#072b52'>;
    sectionSpacing: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'80px'>;
    tealColor: Schema.Attribute.String & Schema.Attribute.DefaultTo<'#0b6f7d'>;
    textColor: Schema.Attribute.String & Schema.Attribute.DefaultTo<'#1f2530'>;
  };
}

export interface SharedTypographySettings extends Struct.ComponentSchema {
  collectionName: 'components_shared_typography_settings';
  info: {
    displayName: 'Typography Settings';
  };
  attributes: {
    fontFamily: Schema.Attribute.String;
    fontSize: Schema.Attribute.String;
    fontWeight: Schema.Attribute.String;
    lineHeight: Schema.Attribute.String;
  };
}

export interface SharedVideoItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_video_items';
  info: {
    description: 'Featured video entry';
    displayName: 'Video Item';
  };
  attributes: {
    description: Schema.Attribute.String;
    duration: Schema.Attribute.String;
    link: Schema.Attribute.String;
    thumbnail: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    video: Schema.Attribute.Media<'videos'>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'page.footer-settings': PageFooterSettings;
      'page.header-settings': PageHeaderSettings;
      'page.home-section': PageHomeSection;
      'page.rail-settings': PageRailSettings;
      'shared.button-settings': SharedButtonSettings;
      'shared.color-settings': SharedColorSettings;
      'shared.donation-amount': SharedDonationAmount;
      'shared.image-settings': SharedImageSettings;
      'shared.menu-item': SharedMenuItem;
      'shared.ministry-item': SharedMinistryItem;
      'shared.news-item': SharedNewsItem;
      'shared.seo-settings': SharedSeoSettings;
      'shared.social-link': SharedSocialLink;
      'shared.spacing-settings': SharedSpacingSettings;
      'shared.stat-item': SharedStatItem;
      'shared.theme-settings': SharedThemeSettings;
      'shared.typography-settings': SharedTypographySettings;
      'shared.video-item': SharedVideoItem;
    }
  }
}
