export type PublicCategoryMeta = {
  name: string;
  slug: string;
  description: string;
};

export const publicCategoryMetaBySlug: Record<string, PublicCategoryMeta> = {
  recipes: {
    name: "Recipes",
    slug: "recipes",
    description: "Creative alcohol-free drink recipes and step-by-step mocktail ideas.",
  },
  "flavor-guides": {
    name: "Flavor Guides",
    slug: "flavor-guides",
    description: "Guides to balancing flavors, sweetness, acidity, aroma, and ingredients.",
  },
  collections: {
    name: "Collections",
    slug: "collections",
    description: "Seasonal drinks, party ideas, and themed mocktail collections.",
  },
  lifestyle: {
    name: "Lifestyle",
    slug: "lifestyle",
    description: "Modern alcohol-free living, entertaining rituals, and sober curious inspiration.",
  },
  essentials: {
    name: "Essentials",
    slug: "essentials",
    description: "Helpful answers, glassware basics, tools, and mocktail technique essentials.",
  },
  experiences: {
    name: "Experiences",
    slug: "experiences",
    description: "Interactive drink inspiration, playful ideas, and memorable mocktail moments.",
  },
};

const publicSlugToDatabaseSlugs: Record<string, readonly string[]> = {
  recipes: ["recipes", "mocktail-recipes"],
  "flavor-guides": ["flavor-guides", "mocktail-guides"],
  collections: ["collections", "mocktail-gifts-shopping", "mocktail-gifts-and-shopping", "drink-collections", "featured-drinks"],
  lifestyle: ["lifestyle", "sober-curious-lifestyle"],
  essentials: ["essentials", "mocktail-faq"],
  experiences: ["experiences", "mocktail-fun-interactive"],
};

const databaseSlugToPublicSlug = new Map<string, string>(
  Object.entries(publicSlugToDatabaseSlugs).flatMap(([publicSlug, databaseSlugs]) =>
    databaseSlugs.map((databaseSlug) => [databaseSlug, publicSlug] as const),
  ),
);

export function isPublicCategorySlug(slug: string): boolean {
  return slug in publicCategoryMetaBySlug;
}

export function categoryDatabaseSlugCandidates(slug: string): readonly string[] {
  return publicSlugToDatabaseSlugs[slug] ?? [slug];
}

export function publicCategorySlug(slug: string): string {
  return databaseSlugToPublicSlug.get(slug) ?? slug;
}

export function publicCategoryHref(slug: string): string {
  return `/category/${publicCategorySlug(slug)}`;
}

export function publicCategoryMeta(slug: string): PublicCategoryMeta | undefined {
  return publicCategoryMetaBySlug[publicCategorySlug(slug)];
}
