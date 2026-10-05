import { mutation } from "./_generated/server";

// Demo catalog for MD Plants. Category/subcategory names must match
// src/lib/catalog.ts so the category pages and care info line up.

const img = (id: string) => `https://images.unsplash.com/photo-${id}?w=800&q=80`;

const IMG = {
  flytrapCluster: img("1768425242012-fd526b6933c4"),
  flytrapOpen: img("1756776486387-ae89bb180147"),
  flytrapMouths: img("1768424694491-a78da1496f07"),
  flytrapDark: img("1755547721683-9b3d7c084083"),
  flytrapMoss: img("1780457943864-576e405c9f94"),
  flytrapMacro: img("1517369428076-d7a1fc6acb9e"),
  sarraceniaHoods: img("1779944677386-9885642b3fc5"),
  sarraceniaMoss: img("1780457786949-2b3485ec0331"),
  sarraceniaColor: img("1780457786486-73585724bcbf"),
  sarraceniaWhite: img("1768425228876-ddf37cfc7dbe"),
  sarraceniaYellow: img("1782036329091-b3e0cc48478f"),
  sarraceniaBloom: img("1765732570566-9f4f90fe27c2"),
  nepenthes: img("1742088821952-e8f8c92635ac"),
  nepenthesRim: img("1783085625980-19479f7eccfa"),
  nepenthesClose: img("1778049004898-f5e5327e4f90"),
  nepenthesSpeckled: img("1780457786680-3a9c4f0554e3"),
  sundewTentacles: img("1753561405157-68635b78abae"),
  sundewPair: img("1783442417220-4f11e68f0562"),
  sundewDew: img("1767183721668-44114977d8b6"),
  sundewGlisten: img("1783442417240-59f54f4f79ac"),
  butterwort: img("1687205069639-582def671205"),
  seedlings: img("1765405016466-a6f4c51449f5"),
  sphagnum: img("1769871127975-30dbbc523c89"),
  soil: img("1562722902-d33533894eea"),
  pots: img("1592064465579-6796bfdaa5cd"),
  greenhouse: img("1516253593875-bd7ba052fbc5"),
  windowsill: img("1786742393282-ba741071eeb8"),
};

type SeedProduct = {
  name: string;
  description: string;
  price: number; // cents
  imageUrl: string;
  category: string;
  subcategory: string;
  productType: string;
  size?: string;
  stockQuantity: number;
  featured?: boolean;
};

const PRODUCTS: SeedProduct[] = [
  // ========== PLANTS: VENUS FLYTRAPS ==========
  {
    name: "Venus Flytrap 'Typical'",
    description: "The classic Dionaea muscipula. Green traps with red interiors, vigorous and forgiving. The perfect first carnivorous plant.",
    price: 1499,
    imageUrl: IMG.flytrapOpen,
    category: "Plants", subcategory: "Venus Flytraps", productType: "Mature Plant", size: "3.5\" pot",
    stockQuantity: 24, featured: true,
  },
  {
    name: "Venus Flytrap 'B52'",
    description: "Famous for some of the largest traps of any flytrap cultivar. Traps can exceed 4 cm on mature plants in strong light.",
    price: 2499,
    imageUrl: IMG.flytrapCluster,
    category: "Plants", subcategory: "Venus Flytraps", productType: "Mature Plant", size: "3.5\" pot",
    stockQuantity: 8, featured: true,
  },
  {
    name: "Venus Flytrap 'Red Dragon'",
    description: "Also known as 'Akai Ryu'. Turns a deep burgundy red all over in full sun, traps and leaves alike.",
    price: 2299,
    imageUrl: IMG.flytrapDark,
    category: "Plants", subcategory: "Venus Flytraps", productType: "Mature Plant", size: "3.5\" pot",
    stockQuantity: 6, featured: true,
  },
  {
    name: "Venus Flytrap 'Dentate'",
    description: "Short, triangular teeth give this form a jagged, shark-like look. A great contrast plant in a mixed bog.",
    price: 1999,
    imageUrl: IMG.flytrapMouths,
    category: "Plants", subcategory: "Venus Flytraps", productType: "Young Plant", size: "2.5\" pot",
    stockQuantity: 10,
  },
  {
    name: "Venus Flytrap Divisions (3-pack)",
    description: "Three healthy bare-root divisions of mixed typical clones, wrapped in damp sphagnum. Great value for a windowsill tray.",
    price: 2499,
    imageUrl: IMG.flytrapMoss,
    category: "Plants", subcategory: "Venus Flytraps", productType: "Bare-root Division", size: "3 plants",
    stockQuantity: 12,
  },

  // ========== PLANTS: PITCHER PLANTS (SARRACENIA) ==========
  {
    name: "Sarracenia purpurea",
    description: "The purple pitcher plant. Squat, rain-catching pitchers with gorgeous veining. Extremely cold hardy and very forgiving.",
    price: 1899,
    imageUrl: IMG.sarraceniaColor,
    category: "Plants", subcategory: "Pitcher Plants", productType: "Mature Plant", size: "4\" pot",
    stockQuantity: 9, featured: true,
  },
  {
    name: "Sarracenia leucophylla",
    description: "The white-topped pitcher plant. Tall trumpets with white, red-veined lids. A showstopper from late summer into autumn.",
    price: 2999,
    imageUrl: IMG.sarraceniaWhite,
    category: "Plants", subcategory: "Pitcher Plants", productType: "Mature Plant", size: "4\" pot",
    stockQuantity: 5, featured: true,
  },
  {
    name: "Sarracenia flava",
    description: "The yellow trumpet. Bright lime-to-yellow pitchers that can reach 60 cm or more. Loves full sun.",
    price: 2499,
    imageUrl: IMG.sarraceniaYellow,
    category: "Plants", subcategory: "Pitcher Plants", productType: "Mature Plant", size: "4\" pot",
    stockQuantity: 7,
  },
  {
    name: "Sarracenia 'Judith Hindle'",
    description: "A classic hybrid with deep red, white-spotted pitchers and wavy lids. Vigorous and quick to form clumps.",
    price: 3499,
    imageUrl: IMG.sarraceniaHoods,
    category: "Plants", subcategory: "Pitcher Plants", productType: "Mature Plant", size: "4\" pot",
    stockQuantity: 4,
  },
  {
    name: "Sarracenia psittacina",
    description: "The parrot pitcher plant. Low, beaked rosettes that trap prey like a lobster pot. Can even catch tadpoles underwater in the wild.",
    price: 1999,
    imageUrl: IMG.sarraceniaMoss,
    category: "Plants", subcategory: "Pitcher Plants", productType: "Young Plant", size: "3.5\" pot",
    stockQuantity: 0,
  },

  // ========== PLANTS: TROPICAL PITCHERS (NEPENTHES) ==========
  {
    name: "Nepenthes ventricosa",
    description: "An easy highland Nepenthes with hourglass-shaped red pitchers. Tolerates normal household humidity well.",
    price: 2999,
    imageUrl: IMG.nepenthesRim,
    category: "Plants", subcategory: "Tropical Pitchers", productType: "Young Plant", size: "4\" pot",
    stockQuantity: 6, featured: true,
  },
  {
    name: "Nepenthes x 'Miranda'",
    description: "A fast-growing hybrid that produces large, speckled pitchers. Ideal for hanging baskets in bright windows.",
    price: 3999,
    imageUrl: IMG.nepenthesSpeckled,
    category: "Plants", subcategory: "Tropical Pitchers", productType: "Mature Plant", size: "6\" hanging basket",
    stockQuantity: 3,
  },
  {
    name: "Nepenthes alata",
    description: "A forgiving lowland/intermediate species with slender green-to-red pitchers. A great introduction to tropical pitchers.",
    price: 2499,
    imageUrl: IMG.nepenthes,
    category: "Plants", subcategory: "Tropical Pitchers", productType: "Young Plant", size: "3.5\" pot",
    stockQuantity: 5,
  },
  {
    name: "Nepenthes ampullaria (Red Speckled)",
    description: "A collector's species with round, ground-hugging pitchers. Needs warmth and high humidity, best for terrariums.",
    price: 6999,
    imageUrl: IMG.nepenthesClose,
    category: "Plants", subcategory: "Tropical Pitchers", productType: "Young Plant", size: "4\" pot",
    stockQuantity: 2,
  },

  // ========== PLANTS: SUNDEWS (DROSERA) ==========
  {
    name: "Drosera capensis",
    description: "The Cape sundew. Long, strappy leaves covered in glistening dew that curl around prey. Nearly unkillable, perfect for beginners.",
    price: 1299,
    imageUrl: IMG.sundewTentacles,
    category: "Plants", subcategory: "Sundews", productType: "Mature Plant", size: "3.5\" pot",
    stockQuantity: 18, featured: true,
  },
  {
    name: "Drosera capensis 'Alba'",
    description: "A white-flowered form of the Cape sundew with bright green leaves and clear dew.",
    price: 1399,
    imageUrl: IMG.sundewDew,
    category: "Plants", subcategory: "Sundews", productType: "Mature Plant", size: "3.5\" pot",
    stockQuantity: 10,
  },
  {
    name: "Drosera aliciae",
    description: "A compact South African rosette sundew that turns brilliant red in strong light. Lovely on a sunny windowsill.",
    price: 1199,
    imageUrl: IMG.sundewPair,
    category: "Plants", subcategory: "Sundews", productType: "Young Plant", size: "2.5\" pot",
    stockQuantity: 14,
  },
  {
    name: "Drosera binata 'Forked Sundew'",
    description: "Y-shaped leaves that branch as the plant matures. A fast grower that's excellent at catching gnats.",
    price: 1599,
    imageUrl: IMG.sundewGlisten,
    category: "Plants", subcategory: "Sundews", productType: "Mature Plant", size: "3.5\" pot",
    stockQuantity: 8,
  },

  // ========== PLANTS: BUTTERWORTS (PINGUICULA) ==========
  {
    name: "Pinguicula 'Tina'",
    description: "A robust Mexican butterwort hybrid with lime-green rosettes and pink-violet flowers. The best gnat-catcher for houseplant collections.",
    price: 1499,
    imageUrl: IMG.butterwort,
    category: "Plants", subcategory: "Butterworts", productType: "Mature Plant", size: "2.5\" pot",
    stockQuantity: 12,
  },
  {
    name: "Pinguicula moranensis",
    description: "A variable Mexican species forming flat, sticky rosettes and producing magenta flowers through much of the year.",
    price: 1699,
    imageUrl: IMG.butterwort,
    category: "Plants", subcategory: "Butterworts", productType: "Mature Plant", size: "2.5\" pot",
    stockQuantity: 6,
  },
  {
    name: "Pinguicula gigantea",
    description: "One of the largest butterworts, with leaves up to 20 cm across in ideal conditions. Upright rosettes and violet blooms.",
    price: 2499,
    imageUrl: IMG.butterwort,
    category: "Plants", subcategory: "Butterworts", productType: "Young Plant", size: "3.5\" pot",
    stockQuantity: 3,
  },

  // ========== SEEDS ==========
  {
    name: "Venus Flytrap Seeds",
    description: "Fresh, hand-pollinated seed from our own plants. No stratification needed. Sow on the surface of damp peat under bright light.",
    price: 599,
    imageUrl: IMG.seedlings,
    category: "Seeds", subcategory: "Flytrap Seeds", productType: "Seed Packet", size: "20 seeds",
    stockQuantity: 40,
  },
  {
    name: "Sarracenia Mixed Hybrid Seeds",
    description: "Open-pollinated seed from our collection of hybrids. Every seedling is unique! Requires 4–6 weeks of cold stratification.",
    price: 699,
    imageUrl: IMG.sarraceniaBloom,
    category: "Seeds", subcategory: "Pitcher Plant Seeds", productType: "Seed Packet", size: "25 seeds",
    stockQuantity: 30,
  },
  {
    name: "Sarracenia leucophylla Seeds",
    description: "Species seed from our white-topped pitcher plants. Requires 4–6 weeks of cold stratification before sowing.",
    price: 799,
    imageUrl: IMG.sarraceniaWhite,
    category: "Seeds", subcategory: "Pitcher Plant Seeds", productType: "Seed Packet", size: "25 seeds",
    stockQuantity: 15,
  },
  {
    name: "Drosera capensis Seeds",
    description: "The easiest carnivorous plant to grow from seed, often germinating in under two weeks. Great project for kids and classrooms.",
    price: 499,
    imageUrl: IMG.sundewDew,
    category: "Seeds", subcategory: "Sundew Seeds", productType: "Seed Packet", size: "50+ seeds",
    stockQuantity: 50,
  },

  // ========== SUPPLIES ==========
  {
    name: "Carnivore Mix (Peat & Perlite)",
    description: "Our own 1:1 blend of nutrient-free sphagnum peat and washed perlite. The same mix we pot every flytrap and Sarracenia in.",
    price: 1299,
    imageUrl: IMG.soil,
    category: "Supplies", subcategory: "Growing Media", productType: "Growing Mix", size: "5 L bag",
    stockQuantity: 25,
  },
  {
    name: "Long-Fibre Sphagnum Moss",
    description: "Premium long-fibre sphagnum for Nepenthes, top-dressing and seed sowing. Free of fertilizers and additives.",
    price: 1499,
    imageUrl: IMG.sphagnum,
    category: "Supplies", subcategory: "Growing Media", productType: "Moss", size: "150 g",
    stockQuantity: 20,
  },
  {
    name: "Washed Perlite",
    description: "Pre-rinsed horticultural perlite with no added fertilizer. Improves drainage and aeration in any carnivore mix.",
    price: 899,
    imageUrl: IMG.soil,
    category: "Supplies", subcategory: "Growing Media", productType: "Additive", size: "5 L bag",
    stockQuantity: 18,
  },
  {
    name: "Tall Sarracenia Pots (5-pack)",
    description: "Deep plastic pots that give pitcher plant rhizomes room to grow. Plastic won't leach minerals like terracotta can.",
    price: 1199,
    imageUrl: IMG.pots,
    category: "Supplies", subcategory: "Pots & Trays", productType: "Pots", size: "4\" deep",
    stockQuantity: 20,
  },
  {
    name: "Bog Water Tray",
    description: "A sturdy, shallow tray for the tray method. Holds 4–6 small pots standing in pure water.",
    price: 999,
    imageUrl: IMG.windowsill,
    category: "Supplies", subcategory: "Pots & Trays", productType: "Trays", size: "40 × 20 cm",
    stockQuantity: 15,
  },
  {
    name: "Beginner Bog Starter Kit",
    description: "Everything to start right: a Venus flytrap, a Cape sundew, carnivore mix, two pots, a water tray and a printed care card.",
    price: 4499,
    imageUrl: IMG.flytrapMacro,
    category: "Supplies", subcategory: "Care Kits", productType: "Kit", size: "2 plants + supplies",
    stockQuantity: 6, featured: true,
  },
  {
    name: "Feeding Tweezers & Labels Set",
    description: "Long stainless steel tweezers for feeding and repotting, plus 20 reusable plant labels.",
    price: 1299,
    imageUrl: IMG.greenhouse,
    category: "Supplies", subcategory: "Care Kits", productType: "Tools",
    stockQuantity: 22,
  },
];

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    // Clear existing products
    const existingProducts = await ctx.db.query("products").collect();
    for (const product of existingProducts) {
      await ctx.db.delete(product._id);
    }

    const now = Date.now();
    for (const product of PRODUCTS) {
      await ctx.db.insert("products", {
        ...product,
        inStock: product.stockQuantity > 0,
        createdAt: now,
      });
    }

    return { success: true, count: PRODUCTS.length };
  },
});
