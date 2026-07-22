export const previewHero = {
  image: {
    src: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1800&q=80",
    alt: "Warm living room with neutral furniture, layered textiles, plants, and natural light",
  },
  label: "Home & Living",
  title: "A calmer way to live with the rooms you already have",
  subtitle: "Practical decorating, organizing, gardening, and product notes for a thoughtful everyday home.",
  cta: {
    label: "Read the latest stories",
    href: "#latest-articles",
  },
} as const;

export const previewHeader = {
  logo: {
    prefix: "Home",
    suffix: "rio",
    href: "#top",
  },
  primaryNavigation: [
    { label: "Decorating", href: "#category-decorating" },
    { label: "Organizing", href: "#category-organizing" },
    { label: "Gardening", href: "#category-gardening" },
    { label: "Reviews", href: "#category-product-reviews" },
  ],
  moreNavigation: [
    { label: "Seasonal Living", href: "#category-seasonal-living" },
    { label: "Home Repair", href: "#category-home-repair" },
  ],
  utilityLinks: [
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ],
  searchHref: "#search",
  searchLabel: "Search",
  menuOpenLabel: "Open menu",
  menuCloseLabel: "Close menu",
} as const;

export const previewArticles = [
  {
    title: "A calmer way to refresh the living room",
    href: "#article-living-room-refresh",
    excerpt: "Layer texture, warm light, and useful storage for a room that feels composed without feeling staged.",
    image: {
      src: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
      alt: "Warm living room with neutral furniture and natural light",
    },
    category: {
      label: "Decorating",
      href: "#category-decorating",
    },
    date: {
      label: "Jul 14, 2026",
      dateTime: "2026-07-14",
    },
    readingTime: "5 min read",
  },
  {
    title: "Small entryway habits that keep clutter away",
    href: "#article-entryway-habits",
    excerpt: "A practical reset for keys, bags, shoes, and mail before they spread through the house.",
    image: {
      src: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",
      alt: "Organized entryway with bench and wall hooks",
    },
    category: {
      label: "Organizing",
      href: "#category-organizing",
    },
    date: {
      label: "Jul 12, 2026",
      dateTime: "2026-07-12",
    },
    readingTime: "4 min read",
  },
  {
    title: "Houseplants that tolerate imperfect routines",
    href: "#article-houseplants",
    excerpt: "Reliable greenery for busy weeks, uneven watering, and rooms that need a softer edge.",
    image: {
      src: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=1200&q=80",
      alt: "Houseplants arranged near a bright window",
    },
    category: {
      label: "Gardening",
      href: "#category-gardening",
    },
    date: {
      label: "Jul 10, 2026",
      dateTime: "2026-07-10",
    },
    readingTime: "6 min read",
  },
  {
    title: "A simple checklist for weekend home upkeep",
    href: "#article-weekend-upkeep",
    excerpt: "Short, repeatable tasks that help a home stay steady without turning the weekend into a project.",
    image: {
      src: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80",
      alt: "Cleaning supplies on a bright kitchen counter",
    },
    category: {
      label: "Home Repair",
      href: "#category-home-repair",
    },
    date: {
      label: "Jul 8, 2026",
      dateTime: "2026-07-08",
    },
    readingTime: "7 min read",
  },
] as const;

export const previewCategories = [
  {
    title: "Decorating",
    href: "#category-decorating",
    description: "Quiet details that make rooms feel considered.",
    image: {
      src: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
      alt: "Styled home interior with neutral decor",
    },
  },
  {
    title: "Organizing",
    href: "#category-organizing",
    description: "Simple routines for a tidy, calm home.",
    image: {
      src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80",
      alt: "Organized shelves with baskets and folded linens",
    },
  },
  {
    title: "Gardening",
    href: "#category-gardening",
    description: "Easy plant care and fresh outdoor ideas.",
    image: {
      src: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1200&q=80",
      alt: "Hands tending plants in a garden",
    },
  },
  {
    title: "Product Reviews",
    href: "#category-product-reviews",
    description: "Thoughtful picks for useful, lasting home goods.",
    image: {
      src: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80",
      alt: "Comfortable sofa in a styled living room",
    },
  },
  {
    title: "Seasonal Living",
    href: "#category-seasonal-living",
    description: "Small rituals for a home that changes with the year.",
    image: {
      src: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
      alt: "Cozy bedroom with layered bedding",
    },
  },
] as const;

export const previewNewsletter = {
  title: "Stay inspired",
  description: "Seasonal ideas, calm routines, and thoughtful home notes are coming soon.",
  inputPlaceholder: "Email address",
  buttonLabel: "Coming soon",
  disabled: true,
} as const;

export const previewFooter = {
  logo: previewHeader.logo,
  description: "A reusable Homerio-style home and living magazine theme for ContentForge site instances.",
  contactLink: {
    label: "Contact",
    href: "#contact",
  },
  categoryLinks: previewCategories.map((category) => ({
    label: category.title,
    href: category.href,
  })),
  companyLinks: [
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
    { label: "Editorial Policy", href: "#editorial-policy" },
    { label: "Affiliate Disclosure", href: "#affiliate-disclosure" },
  ],
  legalLinks: [
    { label: "Privacy Policy", href: "#privacy-policy" },
    { label: "Terms of Service", href: "#terms-of-service" },
    { label: "Cookie Policy", href: "#cookie-policy" },
    { label: "DMCA", href: "#dmca" },
  ],
  footerImage: previewCategories[4].image,
  copyright: "Copyright 2026 Homerio Theme Preview. All Rights Reserved.",
  legalIdentity: ["Theme demo only", "No CMS data", "No runtime config"],
} as const;
