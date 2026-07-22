type NavigationLink = {
  href: string;
  label: string;
};

export const siteConfig = {
  name: "Mocktail Muse",
  domain: "mocktailmuse.net",
  url: "https://mocktailmuse.net",
  tagline: "Elevated alcohol-free drinks for every occasion",
  description:
    "Mocktail Muse is an editorial guide to elegant alcohol-free drinks, refined flavor pairings, and modern entertaining.",
  defaultSeoTitle: "Mocktail Muse - Elevated Alcohol-Free Drinks",
  defaultSeoDescription:
    "Discover elegant mocktail recipes, ingredient ideas, flavor guides, and alcohol-free drink inspiration for every occasion.",
  contactEmail: "hello@mocktailmuse.net",
  supportEmail: "hello@mocktailmuse.net",
  legalEmail: "legal@mocktailmuse.net",
  teamName: "Mocktail Muse Team",
  editorialTeamName: "Mocktail Muse Editorial Team",
  operator: {
    name: "Mocktail Muse Team",
    country: "United States",
    legalStatus: "Independent Sole Proprietorship",
  },
  brand: {
    logoPrefix: "Mocktail",
    logoSuffix: "Muse",
    byline: "Mocktail Muse Editorial Team",
    copyrightYear: 2026,
  },
  content: {
    articleTypeLabel: "mocktail recipe and beverage article",
    searchPlaceholder: "Search recipes...",
    searchEmptyText: "No matching drinks found. Try another ingredient or category.",
  },
  social: {
    defaultShareTitle: "Mocktail Muse - Creative Alcohol-Free Drink Inspiration",
    defaultShareDescription: "Explore mocktail recipes, flavor guides, and drink inspiration for every occasion.",
    twitterCard: "summary",
  },
  navigation: {
    primary: [
      { href: "/category/recipes", label: "Recipes" },
      { href: "/category/flavor-guides", label: "Flavor Guides" },
      { href: "/category/collections", label: "Collections" },
      { href: "/category/lifestyle", label: "Lifestyle" },
      { href: "/category/essentials", label: "Essentials" },
      { href: "/category/experiences", label: "Experiences" },
    ] as readonly NavigationLink[],
    footerSite: [
      { href: "/", label: "Home" },
      { href: "/category/recipes", label: "Recipes" },
      { href: "/category/flavor-guides", label: "Flavor Guides" },
      { href: "/category/collections", label: "Collections" },
      { href: "/category/lifestyle", label: "Lifestyle" },
      { href: "/category/essentials", label: "Essentials" },
      { href: "/category/experiences", label: "Experiences" },
      { href: "/about", label: "About" },
      { href: "/search", label: "Search" },
      { href: "/contact", label: "Contact" },
    ] as readonly NavigationLink[],
    legal: [
      { href: "/privacy-policy", label: "Privacy Policy" },
      { href: "/terms-of-service", label: "Terms of Service" },
      { href: "/cookie-policy", label: "Cookie Policy" },
      { href: "/editorial-policy", label: "Editorial Policy" },
      { href: "/affiliate-disclosure", label: "Affiliate Disclosure" },
      { href: "/dmca-copyright", label: "DMCA / Copyright" },
      { href: "/recipe-disclaimer", label: "Recipe Disclaimer" },
      { href: "/accessibility-statement", label: "Accessibility Statement" },
    ] as readonly NavigationLink[],
  },
} as const;

export type SiteConfig = typeof siteConfig;
