"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import { useQuery } from "convex/react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowRight, ArrowUpRight, Droplets, PackageCheck, Sprout, MessageCircle } from "lucide-react";
import { api } from "../../convex/_generated/api";
import ProductCard from "@/components/ProductCard";
import Header from "./Header";
import Footer from "./Footer";
import {
  DewDrops,
  Magnetic,
  Marquee,
  Reveal,
  RotatingBadge,
  SplitReveal,
  TrapMark,
} from "@/components/motion";
import { CARE_INFO, CATEGORIES, GENERA, IMAGES, subcategoryHref } from "@/lib/catalog";

const RULES = [
  {
    title: "Pure water only",
    text: "Rain, distilled or reverse-osmosis water. Tap water minerals build up in the soil and slowly burn the roots.",
    bg: "bg-moss-800",
  },
  {
    title: "Sun. Then more sun.",
    text: "Most carnivores want full sun or a strong grow light. Light is what turns a flytrap's jaws blood-red.",
    bg: "bg-moss-600",
  },
  {
    title: "No soil, no food, no fuss",
    text: "Nutrient-free peat and perlite only, never fertilizer. They catch their own dinner, so please don't offer them hamburger.",
    bg: "bg-trap-600",
  },
];

const PROMISES = [
  { icon: Sprout, title: "Grown, not imported", text: "Raised in our own collection, never bought in by the thousand." },
  { icon: Droplets, title: "Pure water raised", text: "Grown on rain and RO water, so they settle straight into your setup." },
  { icon: PackageCheck, title: "Packed by hand", text: "Wrapped in damp sphagnum and boxed snugly to arrive happy." },
  { icon: MessageCircle, title: "Grower on call", text: "Questions later? Ask the person who actually grew your plant." },
];

export default function Home() {
  const featuredProducts = useQuery(api.products.getFeatured);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        <Hero />
        <GenusTicker />
        <CollectionIndex />

        {/* Featured Products */}
        <section className="container mx-auto px-4 py-24">
          <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <Reveal>
                <p className="label mb-4 text-trap-500">Ready to ship · this week</p>
              </Reveal>
              <SplitReveal
                text="Fresh from the *bog*"
                className="text-5xl md:text-7xl text-ink"
              />
            </div>
            <Reveal delay={0.2}>
              <Link href="/products" className="group inline-flex items-center gap-3 text-ink">
                <span className="label">See all in stock</span>
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/20 transition-all duration-300 group-hover:bg-ink group-hover:text-parchment group-hover:rotate-[-45deg]">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </Reveal>
          </div>

          {!featuredProducts ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-8 sm:gap-y-14">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-[4/5] animate-pulse rounded-t-[12rem] rounded-b-3xl bg-moss-100" />
              ))}
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-12 text-ink/60">
              No featured plants yet. Run the seed mutation to add sample products.
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-8 sm:gap-y-14">
              {featuredProducts.slice(0, 8).map((product, i) => (
                <Reveal key={product._id} delay={(i % 4) * 0.1}>
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
          )}
        </section>

        <CategoryTriptych />
        <GoldenRules />
        <GrowerNote />
        <RestockSignup />
      </main>

      <Footer />
    </div>
  );
}

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.2]);
  const circleY = useTransform(scrollYProgress, [0, 1], ["0%", "-60%"]);

  return (
    <section ref={ref} className="relative overflow-hidden">
      <div className="container mx-auto grid grid-cols-1 items-center gap-12 px-4 pt-12 pb-20 lg:grid-cols-[1.1fr_0.9fr] lg:pt-16 lg:pb-28">
        {/* Copy */}
        <div className="relative z-10">
          <motion.p
            className="label mb-6 flex items-center gap-3 text-moss-700"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="h-px w-10 bg-moss-700" />
            Carnivorous plant nursery
          </motion.p>

          <SplitReveal
            as="h1"
            inView={false}
            delay={0.1}
            text="Beautiful plants with *questionable* table manners."
            className="text-[3.4rem] leading-[0.98] sm:text-7xl xl:text-[6.2rem] text-ink"
          />

          <motion.p
            className="mt-8 max-w-xl text-lg text-ink/70"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            Venus flytraps, pitcher plants, sundews and butterworts, raised by a fellow
            enthusiast in pure water and full sun, then packed by hand for your windowsill.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap items-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <Magnetic>
              <Link
                href="/plants"
                className="group inline-flex items-center gap-3 rounded-full bg-ink py-4 pl-7 pr-4 text-parchment transition-colors hover:bg-trap-500"
              >
                Shop the collection
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-parchment text-ink transition-transform duration-300 group-hover:rotate-[-45deg]">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </Magnetic>
            <Link
              href="/care"
              className="text-ink underline decoration-trap-400 decoration-2 underline-offset-[6px] hover:decoration-ink transition-colors"
            >
              New to carnivores?
            </Link>
          </motion.div>

          <motion.dl
            className="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-ink/15 pt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            {[
              ["5", "genera grown"],
              ["100%", "pure water"],
              ["0", "imports"],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="font-display text-4xl text-ink">{value}</dt>
                <dd className="label mt-1 text-ink/55">{label}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* Imagery */}
        <div className="relative mx-auto w-full max-w-[520px]">
          <motion.div
            className="relative aspect-[4/5] overflow-hidden rounded-t-[20rem] rounded-b-[2.5rem] bg-moss-200 shadow-[0_40px_80px_-30px_rgba(21,27,20,0.5)]"
            initial={{ clipPath: "inset(100% 0 0 0)" }}
            animate={{ clipPath: "inset(0% 0 0 0)" }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          >
            <motion.div className="absolute inset-0" style={{ y: imageY, scale: imageScale }}>
              <Image
                src={IMAGES.hero}
                alt="A lush display of pitcher plants and sundews"
                fill
                sizes="(min-width: 1024px) 520px, 100vw"
                className="object-cover"
                priority
              />
            </motion.div>
            <DewDrops />
          </motion.div>

          {/* Floating sundew porthole */}
          <motion.div
            className="absolute -left-6 bottom-10 h-40 w-40 overflow-hidden rounded-full border-[6px] border-parchment shadow-xl sm:-left-14 sm:h-48 sm:w-48"
            style={{ y: circleY }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image src={IMAGES.sundewDew} alt="Sundew droplets" fill sizes="200px" className="object-cover" />
          </motion.div>

          {/* Rotating badge */}
          <motion.div
            className="absolute -right-2 -top-4 sm:-right-8"
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ duration: 1.2, delay: 1.3 }}
          >
            <RotatingBadge
              text="HAND-GROWN · PURE WATER · PACKED WITH CARE · "
              className="h-32 w-32 rounded-full bg-parchment text-ink shadow-lg sm:h-36 sm:w-36"
            >
              <span className="group">
                <TrapMark className="h-12 w-12 text-ink" />
              </span>
            </RotatingBadge>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function GenusTicker() {
  return (
    <section className="border-y border-ink/10 bg-moss-950 py-6 text-parchment overflow-hidden">
      <Marquee>
        {GENERA.map((g) => (
          <span key={g.name} className="flex items-center">
            <span className="latin px-8 text-5xl md:text-7xl">{g.latin}</span>
            <svg viewBox="0 0 24 24" className="h-6 w-6 text-trap-400" aria-hidden>
              <path
                fill="currentColor"
                d="M12 0c.6 5.4 3.6 9.6 12 12-8.4 2.4-11.4 6.6-12 12-.6-5.4-3.6-9.6-12-12C8.4 9.6 11.4 5.4 12 0z"
              />
            </svg>
          </span>
        ))}
      </Marquee>
      <Marquee reverse className="mt-3">
        {GENERA.map((g) => (
          <span key={g.name} className="label px-8 text-parchment/50">
            {g.name} &nbsp;·&nbsp; {CARE_INFO[g.name]?.difficulty}
          </span>
        ))}
      </Marquee>
    </section>
  );
}

/** Editorial index of plant types with an image that follows the cursor. */
function CollectionIndex() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 160, damping: 22 });
  const y = useSpring(my, { stiffness: 160, damping: 22 });

  return (
    <section className="container mx-auto px-4 py-24">
      <div className="mb-12 grid gap-6 md:grid-cols-2 md:items-end">
        <div>
          <Reveal>
            <p className="label mb-4 text-trap-500">The collection · 01—05</p>
          </Reveal>
          <SplitReveal text="Choose your *predator*" className="text-5xl md:text-7xl text-ink" />
        </div>
        <Reveal delay={0.2}>
          <p className="max-w-md text-ink/65 md:ml-auto">
            Five genera, five hunting strategies: snap traps, pitfall traps, flypaper and
            sticky tentacles. Pick the one that suits your windowsill.
          </p>
        </Reveal>
      </div>

      <div
        ref={ref}
        className="relative"
        onMouseMove={(e) => {
          const rect = ref.current!.getBoundingClientRect();
          mx.set(e.clientX - rect.left);
          my.set(e.clientY - rect.top);
        }}
        onMouseLeave={() => setActive(null)}
      >
        {GENERA.map((g, i) => (
          <Reveal key={g.name} delay={i * 0.06} y={20}>
            <Link
              href={subcategoryHref(g.name)}
              onMouseEnter={() => setActive(i)}
              className="group relative grid grid-cols-[auto_1fr_auto] items-center gap-6 border-t border-ink/15 py-7 last:border-b md:grid-cols-[80px_1.2fr_1fr_140px_auto]"
            >
              <span className="label text-ink/40">0{i + 1}</span>
              <span className="flex items-center gap-5">
                <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full md:hidden">
                  <Image src={g.image} alt="" fill sizes="56px" className="object-cover" />
                </span>
                <span>
                  <span className="latin block text-4xl text-ink transition-all duration-500 group-hover:translate-x-3 group-hover:text-trap-500 md:text-6xl">
                    {g.latin}
                  </span>
                  <span className="label mt-1 block text-ink/50 md:hidden">{g.name}</span>
                </span>
              </span>
              <span className="hidden text-ink/60 md:block">{g.name}</span>
              <span className="label hidden text-moss-600 md:block">{CARE_INFO[g.name]?.difficulty}</span>
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/20 transition-all duration-300 group-hover:border-trap-500 group-hover:bg-trap-500 group-hover:text-white">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
          </Reveal>
        ))}

        {/* Cursor-following preview (desktop) */}
        <motion.div
          className="pointer-events-none absolute left-0 top-0 z-20 hidden md:block"
          style={{ x, y }}
        >
          <AnimatePresence mode="popLayout">
            {active !== null && (
              <motion.div
                key={active}
                className="relative -ml-32 -mt-44 h-80 w-64 overflow-hidden rounded-t-[8rem] rounded-b-2xl shadow-2xl"
                initial={{ opacity: 0, scale: 0.7, rotate: -8 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.8, rotate: 8 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image src={GENERA[active].image} alt="" fill sizes="256px" className="object-cover" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

function CategoryTriptych() {
  return (
    <section className="relative overflow-hidden bg-ink py-28 text-parchment">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <Reveal>
            <p className="label mb-4 text-trap-300">Shop by category</p>
          </Reveal>
          <SplitReveal
            text="Everything for the *bog*"
            className="text-5xl md:text-7xl"
          />
        </div>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
          {CATEGORIES.map((category, i) => (
            <Reveal key={category.slug} delay={i * 0.15} className={i === 1 ? "md:mt-24" : ""}>
              <Link href={`/${category.slug}`} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden rounded-t-[14rem] rounded-b-3xl">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
                  <span className="label absolute left-1/2 top-8 -translate-x-1/2 rounded-full bg-ink/40 px-3 py-1 text-parchment/80 backdrop-blur-sm">
                    0{i + 1} / 03
                  </span>
                  <div className="absolute inset-x-0 bottom-0 p-7">
                    <h3 className="text-5xl transition-transform duration-500 group-hover:-translate-y-2">
                      {category.name}
                    </h3>
                    <p className="mt-3 max-w-xs text-sm text-parchment/70">{category.tagline}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm text-trap-300 opacity-0 transition-all duration-500 group-hover:opacity-100">
                      Explore <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Rule cards that stack on top of each other as you scroll. */
function GoldenRules() {
  return (
    <section className="container mx-auto px-4 py-28">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="lg:sticky lg:top-40 lg:self-start">
          <Reveal>
            <p className="label mb-4 text-trap-500">Care guide · the short version</p>
          </Reveal>
          <SplitReveal text="Three rules. *No* exceptions." className="text-5xl md:text-7xl text-ink" />
          <Reveal delay={0.3}>
            <p className="mt-6 max-w-sm text-ink/65">
              Carnivores aren&apos;t difficult. They just play by different rules than your
              monstera. Get these right and they&apos;ll thrive for decades.
            </p>
            <Link
              href="/care"
              className="mt-8 inline-flex items-center gap-2 text-ink underline decoration-trap-400 decoration-2 underline-offset-[6px]"
            >
              Read the full care guide <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>

        <div className="space-y-6">
          {RULES.map((rule, i) => (
            <div key={rule.title} className="sticky" style={{ top: `${9 + i * 1.5}rem` }}>
              <Reveal>
                <div
                  className={`${rule.bg} relative min-h-[18rem] overflow-hidden rounded-[2rem] p-10 text-parchment shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.4)]`}
                >
                  <span className="font-display absolute -right-4 -top-10 text-[12rem] leading-none text-parchment/10">
                    {i + 1}
                  </span>
                  <p className="label mb-10 text-parchment/60">Rule no. {i + 1}</p>
                  <h3 className="text-4xl md:text-5xl">{rule.title}</h3>
                  <p className="mt-5 max-w-lg text-parchment/80">{rule.text}</p>
                </div>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GrowerNote() {
  return (
    <section className="bg-parchment-dark/60 py-28">
      <div className="container mx-auto grid items-center gap-16 px-4 lg:grid-cols-2">
        {/* Taped-in field note */}
        <Reveal>
          <div className="relative mx-auto max-w-md rotate-[-2.5deg]">
            <span className="absolute -top-4 left-1/2 z-10 h-8 w-32 -translate-x-1/2 rotate-[3deg] bg-dew-300/70" />
            <div className="bg-white p-4 pb-16 shadow-[0_30px_60px_-25px_rgba(21,27,20,0.45)]">
              <div className="relative aspect-square overflow-hidden">
                <Image src={IMAGES.windowsill} alt="Venus flytraps on a windowsill" fill sizes="450px" className="object-cover object-top" />
              </div>
              <p className="latin absolute bottom-5 left-6 text-2xl text-ink/80">
                where it all started, windowsill no. 1
              </p>
            </div>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <p className="label mb-6 text-trap-500">A note from the grower</p>
          </Reveal>
          <SplitReveal
            text="“Every plant here was grown by me, not imported by the *thousand*.”"
            className="text-4xl md:text-5xl text-ink leading-[1.1]"
          />
          <Reveal delay={0.3}>
            <p className="latin mt-6 text-xl text-moss-700">MD, founder &amp; chief bog keeper</p>
          </Reveal>

          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {PROMISES.map(({ icon: Icon, title, text }, i) => (
              <Reveal key={title} delay={0.1 * i}>
                <div className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-moss-800 text-parchment">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-xl">{title}</h3>
                    <p className="mt-1 text-sm text-ink/65">{text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function RestockSignup() {
  return (
    <section className="container mx-auto px-4 py-24">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-moss-900 px-6 py-20 text-center text-parchment md:px-16">
        <DewDrops />
        <div className="relative">
          <span className="group inline-block">
            <TrapMark className="mx-auto mb-6 h-14 w-14 text-parchment" />
          </span>
          <SplitReveal text="Never miss a *restock*" className="text-5xl md:text-7xl" />
          <p className="mx-auto mt-6 max-w-xl text-parchment/70">
            Rare cultivars and fresh seed batches go fast. Get one short email when new plants
            are potted up and ready to ship.
          </p>
          <form
            className="mx-auto mt-10 flex max-w-md items-center gap-2 rounded-full bg-parchment p-1.5"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="you@example.com"
              className="min-w-0 flex-grow bg-transparent px-5 py-3 text-ink placeholder:text-ink/40 focus:outline-none"
            />
            <button className="rounded-full bg-trap-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-trap-600">
              Notify me
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
