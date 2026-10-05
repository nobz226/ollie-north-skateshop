// Store-wide catalog config: shop identity, top-level categories and their
// subcategories. Category/subcategory names must match the values stored on
// products in Convex (see convex/seedProducts.ts).

export const SHOP_NAME = "MD Plants";
export const SHOP_TAGLINE = "Carnivorous plants, grown with care";

const img = (id: string, width = 800) =>
  `https://images.unsplash.com/photo-${id}?w=${width}&q=80`;

export const IMAGES = {
  hero: img("1780457787438-d148895e416b", 1600),
  flytraps: img("1768425242012-fd526b6933c4"),
  sarracenia: img("1780457786486-73585724bcbf"),
  nepenthes: img("1742088821952-e8f8c92635ac"),
  sundews: img("1753561405157-68635b78abae"),
  butterworts: img("1687205069639-582def671205"),
  seedlings: img("1765405016466-a6f4c51449f5"),
  sarraceniaBloom: img("1765732570566-9f4f90fe27c2"),
  sundewDew: img("1783442417220-4f11e68f0562"),
  sphagnum: img("1769871127975-30dbbc523c89"),
  soil: img("1562722902-d33533894eea"),
  pots: img("1592064465579-6796bfdaa5cd"),
  greenhouse: img("1516253593875-bd7ba052fbc5"),
  windowsill: img("1786742393282-ba741071eeb8"),
} as const;

export interface Subcategory {
  name: string;
  latin?: string;
  description: string;
  image: string;
}

export interface Category {
  name: string;
  slug: string;
  tagline: string;
  image: string;
  subcategories: Subcategory[];
}

export const CATEGORIES: Category[] = [
  {
    name: "Plants",
    slug: "plants",
    tagline: "Nursery-grown carnivorous plants, shipped bare-root or potted",
    image: IMAGES.flytraps,
    subcategories: [
      {
        name: "Venus Flytraps",
        latin: "Dionaea",
        description: "Dionaea muscipula: the classic snap-trap, from typicals to named cultivars",
        image: IMAGES.flytraps,
      },
      {
        name: "Pitcher Plants",
        latin: "Sarracenia",
        description: "Sarracenia: hardy North American trumpet pitchers in vivid colors",
        image: IMAGES.sarracenia,
      },
      {
        name: "Tropical Pitchers",
        latin: "Nepenthes",
        description: "Nepenthes: hanging pitchers for windowsills, terrariums and greenhouses",
        image: IMAGES.nepenthes,
      },
      {
        name: "Sundews",
        latin: "Drosera",
        description: "Drosera: sparkling sticky tentacles that curl around their prey",
        image: IMAGES.sundews,
      },
      {
        name: "Butterworts",
        latin: "Pinguicula",
        description: "Pinguicula: flypaper rosettes with beautiful violet-like flowers",
        image: IMAGES.butterworts,
      },
    ],
  },
  {
    name: "Seeds",
    slug: "seeds",
    tagline: "Fresh seed from our own collection, for the patient grower",
    image: IMAGES.seedlings,
    subcategories: [
      {
        name: "Flytrap Seeds",
        description: "Grow your own Venus flytraps from fresh, hand-pollinated seed",
        image: IMAGES.seedlings,
      },
      {
        name: "Pitcher Plant Seeds",
        description: "Open-pollinated and hybrid Sarracenia seed (needs cold stratification)",
        image: IMAGES.sarraceniaBloom,
      },
      {
        name: "Sundew Seeds",
        description: "Easy, fast-germinating Drosera, perfect for beginners",
        image: IMAGES.sundewDew,
      },
    ],
  },
  {
    name: "Supplies",
    slug: "supplies",
    tagline: "Everything carnivores need, and nothing that will harm them",
    image: IMAGES.sphagnum,
    subcategories: [
      {
        name: "Growing Media",
        description: "Nutrient-free peat, sphagnum and perlite. No fertilizers, ever",
        image: IMAGES.sphagnum,
      },
      {
        name: "Pots & Trays",
        description: "Plastic and glazed pots plus water trays for the tray method",
        image: IMAGES.pots,
      },
      {
        name: "Care Kits",
        description: "Starter bundles and tools to get your collection going",
        image: IMAGES.greenhouse,
      },
    ],
  },
];

export const GENERA = CATEGORIES[0].subcategories;

/** Latin genus for a subcategory, e.g. "Venus Flytraps" -> "Dionaea" */
export const latinFor = (subcategory: string) =>
  GENERA.find((g) => g.name.toLowerCase() === subcategory.toLowerCase())?.latin;

/** Stable 3-digit "specimen number" derived from a product id */
export const specimenNumber = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return String((hash % 900) + 100);
};

export const categoryHref = (category: string) =>
  `/products?category=${encodeURIComponent(category)}`;

export const subcategoryHref = (subcategory: string) =>
  `/products?subcategory=${encodeURIComponent(subcategory)}`;

// Care-at-a-glance shown on product pages, keyed by subcategory.
export interface CareInfo {
  light: string;
  water: string;
  dormancy: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
}

export const CARE_INFO: Record<string, CareInfo> = {
  "Venus Flytraps": {
    light: "Full sun: 6+ hours of direct light or a strong grow light",
    water: "Tray method with distilled, RO or rain water; keep soil damp",
    dormancy: "Required: 3–4 months cool (0–10 °C) over winter",
    difficulty: "Beginner",
  },
  "Pitcher Plants": {
    light: "Full sun outdoors for best color",
    water: "Sit in 1–2 cm of pure water all season",
    dormancy: "Required: cold winter rest, hardy outdoors in most climates",
    difficulty: "Beginner",
  },
  "Tropical Pitchers": {
    light: "Bright indirect light; east-facing window or grow light",
    water: "Keep moist, never waterlogged; pure water only",
    dormancy: "None: keep warm (18–30 °C) with humidity above 50%",
    difficulty: "Intermediate",
  },
  Sundews: {
    light: "Bright light; sunny windowsill or grow light",
    water: "Tray method with pure water; soil always wet",
    dormancy: "Depends on species: tropical types need none",
    difficulty: "Beginner",
  },
  Butterworts: {
    light: "Bright indirect light or a sunny windowsill",
    water: "Water from below when the mix is nearly dry; pure water only",
    dormancy: "Mexican species have a dry 'succulent' winter phase",
    difficulty: "Intermediate",
  },
};
