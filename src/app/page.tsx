"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { useQuery } from "convex/react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { api } from "../../convex/_generated/api";
import ProductCard from "@/components/ProductCard";
import Lancet from "@/components/Lancet";
import Header from "./Header";
import Footer from "./Footer";
import {
  Corners,
  Embers,
  Flourish,
  InkReveal,
  Magnetic,
  Reveal,
  SplitReveal,
  Wordmark,
} from "@/components/motion";
import { CARE_INFO, CATEGORIES, GENERA, IMAGES, subcategoryHref, toRoman } from "@/lib/catalog";

const COMMANDMENTS = [
  {
    title: "Pure water only",
    text: "Rain, distilled or reverse-osmosis water. The minerals in tap water build up in the soil and slowly burn the roots.",
  },
  {
    title: "Sun, then more sun",
    text: "Most carnivores want full sun or a strong grow light. Light is what turns a flytrap's jaws blood-red.",
  },
  {
    title: "Starve the soil",
    text: "Nutrient-free peat and perlite, never fertilizer. They catch their own dinner. Please don't offer them hamburger.",
  },
];

const PROMISES = [
  { title: "Grown, never imported", text: "Raised in our own collection, not bought in by the thousand." },
  { title: "Raised on rainwater", text: "So they settle straight into your setup without sulking." },
  { title: "Packed by hand", text: "Wrapped in damp sphagnum and boxed snugly to arrive alive." },
  { title: "A keeper on call", text: "Questions later? Ask the person who actually grew your plant." },
];

export default function Home() {
  const featuredProducts = useQuery(api.products.getFeatured);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-grow">
        <Hero />
        <Creed />
        <Bestiary />

        {/* Featured specimens */}
        <section className="container mx-auto px-4 py-28">
          <div className="mb-16 text-center">
            <Reveal>
              <p className="label mb-5 text-blood-400">Ready to ship this week</p>
            </Reveal>
            <SplitReveal text="Newly *unearthed*" className="text-5xl text-bone md:text-7xl" />
          </div>

          {!featuredProducts ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-[3/5] animate-pulse bg-vault" />
              ))}
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="py-12 text-center text-bone/60">
              No featured plants yet. Run the seed mutation to add sample products.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
              {featuredProducts.slice(0, 8).map((product, i) => (
                <Reveal key={product._id} delay={(i % 4) * 0.1} className="h-full">
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
          )}

          <div className="mt-16 text-center">
            <Link href="/products" className="btn btn-ghost">
              See every specimen <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <Chambers />
        <Commandments />
        <KeepersLetter />
        <FeedingList />
      </main>

      <Footer />
    </div>
  );
}

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative flex min-h-[calc(100svh-7.5rem)] items-center overflow-hidden">
      {/* Backdrop: a dim, candle-lit plant photo */}
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <Image
          src={IMAGES.hero}
          alt=""
          fill
          priority
          sizes="100vw"
          className="scale-110 object-cover opacity-35 [filter:grayscale(0.6)_sepia(0.3)_contrast(1.1)]"
        />
      </motion.div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_10%,var(--color-crypt)_78%)]" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-crypt to-transparent" />
      <div className="absolute left-1/2 top-1/2 h-[60vh] w-[60vh] -translate-x-1/2 -translate-y-1/2 animate-flicker rounded-full bg-blood-700/20 blur-[120px]" />
      <Embers />
      <Corners className="hidden md:block" />

      <motion.div
        className="container relative mx-auto flex flex-col items-center px-4 py-20 text-center"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <motion.p
          className="label mb-10 flex items-center gap-4 text-bone/60"
          initial={{ opacity: 0, letterSpacing: "0.6em" }}
          animate={{ opacity: 1, letterSpacing: "0.24em" }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="h-px w-8 bg-blood-500" />
          Carnivorous plant nursery
          <span className="h-px w-8 bg-blood-500" />
        </motion.p>

        {/* The logo, inked onto the page */}
        <motion.div
          className="w-full max-w-5xl"
          initial={{ opacity: 0, filter: "blur(16px)", clipPath: "inset(0 50% 0 50%)" }}
          animate={{ opacity: 1, filter: "blur(0px)", clipPath: "inset(0 0% 0 0%)" }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        >
          <h1 className="sr-only">Carnivorables: rare carnivorous plants</h1>
          <Wordmark priority className="drop-shadow-[0_0_40px_rgba(150,42,34,0.35)]" />
        </motion.div>

        <motion.p
          className="latin mt-10 max-w-2xl text-2xl text-bone/80 md:text-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.3 }}
        >
          Beautiful plants with questionable table manners.
        </motion.p>

        <motion.div
          className="mt-12 flex flex-col items-center gap-4 sm:flex-row"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.6 }}
        >
          <Magnetic>
            <Link href="/plants" className="btn btn-blood">
              Enter the collection <ArrowRight className="h-4 w-4" />
            </Link>
          </Magnetic>
          <Link href="/care" className="btn btn-ghost">
            New to carnivores?
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
      >
        <span className="label text-[0.62rem] text-bone/40">Descend</span>
        <span className="relative h-12 w-px overflow-hidden bg-bone/15">
          <motion.span
            className="absolute inset-x-0 top-0 h-1/2 bg-blood-400"
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </section>
  );
}

/** A statement that lights up word by word as it scrolls past. */
function Creed() {
  return (
    <section className="container mx-auto flex flex-col items-center px-4 py-28 text-center md:py-40">
      <p className="label mb-10 text-blood-400">The creed</p>
      <InkReveal
        text="Every specimen here is raised by one obsessive grower in rainwater, full sun and nutrient-starved peat. Then it is packed by hand and sent out to *hunt* in your home."
        className="max-w-4xl text-3xl font-light italic leading-[1.3] text-bone md:text-5xl"
      />
      <Flourish className="mt-16" />
    </section>
  );
}

/** The five genera, each in its own Gothic window. */
function Bestiary() {
  return (
    <section className="relative border-y border-bone/10 bg-vault/60 py-28">
      <div className="container mx-auto px-4">
        <div className="mb-16 grid gap-8 md:grid-cols-2 md:items-end">
          <div>
            <Reveal>
              <p className="label mb-5 text-blood-400">Five genera · five ways to kill</p>
            </Reveal>
            <SplitReveal text="The *bestiary*" className="text-6xl text-bone md:text-7xl" />
          </div>
          <Reveal delay={0.2}>
            <p className="max-w-md text-lg text-bone/60 md:ml-auto">
              Snap traps, pitfalls, flypaper and glistening tentacles. Choose your predator by
              its method, or by how much attention you can spare it.
            </p>
          </Reveal>
        </div>

        <div className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 lg:grid-cols-5">
          {GENERA.map((g, i) => (
            <Reveal key={g.name} delay={i * 0.1} className="w-[70vw] shrink-0 snap-center sm:w-[45vw] md:w-auto">
              <Link href={subcategoryHref(g.name)} className="group block text-center">
                <span className="rune block text-3xl text-blood-500 transition-colors group-hover:text-blood-400">
                  {toRoman(i + 1)}
                </span>
                <Lancet
                  src={g.image}
                  alt={g.name}
                  sizes="(min-width: 1024px) 20vw, (min-width: 768px) 33vw, 70vw"
                  className="mt-4 aspect-[3/5] w-full transition-transform duration-700 group-hover:-translate-y-2"
                />
                <h3 className="latin mt-6 text-3xl text-bone">{g.latin}</h3>
                <p className="label mt-2 text-bone/50">{g.name}</p>
                <div className="mx-auto mt-4 flex w-fit items-center gap-3 border-t border-bone/10 pt-4 text-sm text-bone/60">
                  <span>{g.hunt}</span>
                  <span className="text-blood-500">✦</span>
                  <span>{CARE_INFO[g.name]?.difficulty}</span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Plants / Seeds / Supplies as tall panels that widen when hovered. */
function Chambers() {
  return (
    <section className="border-y border-bone/10">
      <div className="flex flex-col md:h-[80vh] md:flex-row">
        {CATEGORIES.map((category, i) => (
          <Link
            key={category.slug}
            href={`/${category.slug}`}
            className="group relative h-80 overflow-hidden border-bone/10 transition-[flex-grow] duration-700 ease-[cubic-bezier(.22,1,.36,1)] md:h-auto md:flex-1 md:border-l md:first:border-l-0 md:hover:flex-[1.7]"
          >
            <Image
              src={category.image}
              alt={category.name}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="specimen-img object-cover group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-crypt via-crypt/50 to-crypt/20 transition-opacity duration-700 group-hover:opacity-70" />
            <div className="absolute inset-0 flex flex-col items-center justify-end p-8 text-center md:p-10">
              <span className="label text-bone/50">Chamber {toRoman(i + 1)}</span>
              <h2 className="gothic mt-3 text-6xl text-bone md:text-7xl">{category.name}</h2>
              <p className="mt-4 max-w-xs text-bone/70">{category.tagline}</p>
              <span className="label mt-6 flex items-center gap-2 text-blood-400 transition-all duration-500 md:translate-y-4 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
                Enter <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/** The care basics, set like a manuscript with rubricated numerals. */
function Commandments() {
  return (
    <section className="container mx-auto px-4 py-28 md:py-36">
      <div className="mb-20 text-center">
        <Reveal>
          <p className="label mb-5 text-blood-400">Care, in brief</p>
        </Reveal>
        <SplitReveal text="The three *commandments*" className="text-5xl text-bone md:text-7xl" />
      </div>

      <div className="grid gap-px bg-bone/10 md:grid-cols-3">
        {COMMANDMENTS.map((rule, i) => (
          <Reveal key={rule.title} delay={i * 0.15} className="bg-crypt">
            <div className="h-full px-6 py-10 text-center md:px-10">
              <span className="rune block text-8xl leading-none text-blood-500">{toRoman(i + 1)}</span>
              <h3 className="mt-8 text-3xl text-bone md:text-4xl">{rule.title}</h3>
              <p className="mx-auto mt-4 max-w-xs text-bone/60">{rule.text}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-16 text-center">
        <Link href="/care" className="label link-rule text-bone/80 hover:text-bone">
          Read the full care guide
        </Link>
      </div>
    </section>
  );
}

/** A handwritten-feeling letter from the grower, sealed in red wax. */
function KeepersLetter() {
  return (
    <section className="relative overflow-hidden border-t border-bone/10 bg-vault/60 py-28">
      <div className="container mx-auto grid items-center gap-16 px-4 lg:grid-cols-[1.05fr_0.95fr]">
        <Reveal>
          <div className="relative mx-auto max-w-xl -rotate-1 bg-bone px-8 py-12 text-crypt shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)] sm:px-12">
            {/* paper tone */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,transparent_40%,rgba(120,80,40,0.18))]" />
            <div className="relative">
              <div className="w-48 opacity-90">
                <Wordmark tone="ink" />
              </div>
              <p className="latin mt-8 text-2xl">Dear future keeper,</p>
              <p className="mt-4 leading-relaxed text-crypt/80">
                Every plant in this shop was grown by me, on my own shelves, in my own greenhouse.
                Nothing is imported by the thousand. When you buy a flytrap here, you&apos;re
                getting one I&apos;ve watered, divided and (honestly) talked to.
              </p>
              <p className="mt-4 leading-relaxed text-crypt/80">
                If it sulks, write to me. I&apos;ll help you bring it back.
              </p>
              <p className="gothic mt-8 text-3xl">MD</p>
              <p className="label mt-1 text-[0.62rem] text-crypt/60">Founder &amp; keeper of the bog</p>
            </div>
            {/* Wax seal */}
            <div className="absolute -bottom-8 right-8 flex h-24 w-24 rotate-12 items-center justify-center rounded-[47%_53%_49%_51%] bg-blood-600 shadow-[inset_0_-6px_12px_rgba(0,0,0,0.35),inset_0_4px_8px_rgba(255,255,255,0.15),0_8px_20px_rgba(0,0,0,0.5)]">
              <div className="flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full border border-blood-800/70">
                <Image src="/brand/monogram-bone.png" alt="" width={271} height={415} className="h-11 w-auto opacity-80" />
              </div>
            </div>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <p className="label mb-5 text-blood-400">The keeper&apos;s promises</p>
          </Reveal>
          <SplitReveal text="Grown here, *not* shipped in" className="text-5xl text-bone md:text-6xl" />
          <ul className="mt-12">
            {PROMISES.map(({ title, text }, i) => (
              <Reveal key={title} delay={0.1 * i}>
                <li className="flex gap-6 border-t border-bone/10 py-6">
                  <span className="rune w-10 shrink-0 text-2xl text-blood-500">{toRoman(i + 1)}</span>
                  <div>
                    <h3 className="text-2xl text-bone">{title}</h3>
                    <p className="mt-1 text-bone/60">{text}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function FeedingList() {
  return (
    <section className="relative overflow-hidden py-32">
      <Embers count={10} />
      <div className="container relative mx-auto px-4">
        <div className="frame mx-auto max-w-4xl px-6 py-16 text-center md:px-16">
          <Corners className="!inset-3" />
          <p className="label mb-6 text-blood-400">The feeding list</p>
          <SplitReveal text="Be first when the *rare* ones surface" className="text-5xl text-bone md:text-6xl" />
          <p className="mx-auto mt-6 max-w-lg text-bone/60">
            Named cultivars and fresh seed batches go fast. One short letter when new plants are
            potted up and ready to ship. Nothing else.
          </p>
          {/* TODO: connect to a mailing list provider; this form does not submit anywhere yet */}
          <form
            className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="your@email.com"
              aria-label="Email address"
              className="min-w-0 flex-grow border-b border-bone/30 bg-transparent px-1 py-3 text-bone placeholder:text-bone/35 focus:border-blood-400 focus:outline-none"
            />
            <button className="btn btn-blood">Summon me</button>
          </form>
        </div>
      </div>
    </section>
  );
}
