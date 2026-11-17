"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Header from "../Header";
import Footer from "../Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import Lancet from "@/components/Lancet";
import { Embers, Flourish, Reveal, SplitReveal } from "@/components/motion";
import { CARE_INFO, GENERA, IMAGES, subcategoryHref, toRoman } from "@/lib/catalog";

const BASICS = [
  {
    title: "Water",
    text: "Use only rain, distilled or reverse-osmosis water. Most carnivores like the tray method: stand the pot in a saucer with 1–2 cm of water.",
  },
  {
    title: "Light",
    text: "More than you think. A sunny south-facing window, outdoors in summer, or a strong LED grow light for 12–16 hours a day.",
  },
  {
    title: "Dormancy",
    text: "Temperate plants (flytraps, Sarracenia, many sundews) need a cool winter rest. Skipping it weakens and eventually kills them.",
  },
  {
    title: "Never",
    text: "No potting soil, no fertilizer, no tap water, and no feeding them hamburger. Live insects only, or nothing at all.",
  },
];

const DIFFICULTY_LEVEL = { Beginner: 1, Intermediate: 2, Advanced: 3 } as const;

export default function CarePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-grow">
        {/* Header */}
        <section className="container mx-auto grid items-center gap-12 px-4 pb-20 pt-10 lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            <Breadcrumbs items={[{ label: "Care Guide", href: "/care" }]} />
            <p className="label mb-6 mt-10 text-blood-400">The keeper&apos;s grimoire · vol. I</p>
            <SplitReveal
              as="h1"
              inView={false}
              text="How to keep a *carnivore* content"
              className="text-6xl leading-[0.95] text-bone md:text-8xl"
            />
            <motion.p
              className="mt-8 max-w-xl text-lg text-bone/65"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Carnivorous plants are easy once you unlearn your houseplant habits. They grow in
              bogs: wet, sunny and starved of nutrients. Recreate that and they&apos;ll thrive for
              decades.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-sm"
          >
            <Lancet src={IMAGES.sundewDew} alt="Sundew dew drops" sizes="30vw" className="aspect-[3/5] w-full" priority alive>
              <Embers count={6} />
            </Lancet>
          </motion.div>
        </section>

        {/* Basics */}
        <section className="border-y border-bone/10 bg-vault/60 py-24">
          <div className="container mx-auto px-4">
            <div className="mb-16 text-center">
              <p className="label mb-5 text-blood-400">The fundamentals</p>
              <SplitReveal text="The *basics*" className="text-5xl text-bone md:text-7xl" />
            </div>
            <div className="grid grid-cols-1 gap-px bg-bone/10 sm:grid-cols-2 lg:grid-cols-4">
              {BASICS.map(({ title, text }, i) => (
                <Reveal key={title} delay={i * 0.1} className="bg-crypt">
                  <div className="group h-full p-8 transition-colors duration-500 hover:bg-blood-950/60">
                    <span className="rune text-6xl leading-none text-blood-500">{toRoman(i + 1)}</span>
                    <h3 className="mb-3 mt-8 text-3xl text-bone">{title}</h3>
                    <p className="text-bone/60">{text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* By plant type */}
        <section className="container mx-auto px-4 py-24">
          <div className="mb-20 text-center">
            <p className="label mb-5 text-blood-400">Genus by genus</p>
            <SplitReveal text="By plant *type*" className="text-5xl text-bone md:text-7xl" />
            <Flourish className="mx-auto mt-10" />
          </div>

          <div className="space-y-24">
            {GENERA.map((type, i) => {
              const care = CARE_INFO[type.name];
              const level = DIFFICULTY_LEVEL[care.difficulty];
              return (
                <Reveal key={type.name}>
                  <article className={`grid items-center gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-20 ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}>
                    <div className="group mx-auto w-full max-w-sm">
                      <Lancet
                        src={type.image}
                        alt={type.name}
                        sizes="(min-width: 768px) 30vw, 100vw"
                        className="aspect-[4/5] w-full"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-4">
                        <span className="rune text-3xl text-blood-500">{toRoman(i + 1)}</span>
                        <span className="h-px w-10 bg-bone/20" />
                        <span className="flex gap-1.5" aria-label={care.difficulty}>
                          {[1, 2, 3].map((d) => (
                            <span key={d} className={`h-2 w-2 rotate-45 ${d <= level ? "bg-blood-500" : "bg-bone/15"}`} />
                          ))}
                        </span>
                        <span className="label text-bone/50">{care.difficulty}</span>
                      </div>
                      <h3 className="mt-5 text-6xl text-bone">
                        <em>{type.latin}</em>
                      </h3>
                      <p className="label mt-3 text-bone/50">
                        {type.name} · {type.hunt}
                      </p>
                      <p className="mt-5 text-bone/65">{type.description}</p>
                      <dl className="mt-8 space-y-4 border-t border-bone/10 pt-6">
                        {[
                          ["Light", care.light],
                          ["Water", care.water],
                          ["Dormancy", care.dormancy],
                        ].map(([label, text]) => (
                          <div key={label} className="grid grid-cols-[110px_1fr] gap-4">
                            <dt className="label pt-1 text-blood-400/80">{label}</dt>
                            <dd className="text-bone/80">{text}</dd>
                          </div>
                        ))}
                      </dl>
                      <Link href={subcategoryHref(type.name)} className="btn btn-ghost mt-10">
                        Shop {type.name.toLowerCase()} <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
