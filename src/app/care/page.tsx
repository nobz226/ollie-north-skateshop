"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, Droplets, Sun, Snowflake, Ban } from "lucide-react";
import Header from "../Header";
import Footer from "../Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { DewDrops, Reveal, SplitReveal } from "@/components/motion";
import { CARE_INFO, GENERA, IMAGES, subcategoryHref } from "@/lib/catalog";

const BASICS = [
  {
    icon: Droplets,
    title: "Water",
    text: "Use only rain, distilled or reverse-osmosis water. Most carnivores like the tray method: stand the pot in a saucer with 1–2 cm of water.",
  },
  {
    icon: Sun,
    title: "Light",
    text: "More than you think. A sunny south-facing window, outdoors in summer, or a strong LED grow light for 12–16 hours a day.",
  },
  {
    icon: Snowflake,
    title: "Dormancy",
    text: "Temperate plants (flytraps, Sarracenia, many sundews) need a cool winter rest. Skipping it weakens and eventually kills them.",
  },
  {
    icon: Ban,
    title: "Never",
    text: "No potting soil, no fertilizer, no tap water, and no feeding them hamburger. Live insects only, or nothing at all.",
  },
];

const DIFFICULTY_DOTS = { Beginner: 1, Intermediate: 2, Advanced: 3 } as const;

export default function CarePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Header */}
        <section className="container mx-auto grid items-end gap-12 px-4 pt-10 pb-20 lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            <Breadcrumbs items={[{ label: "Care Guide", href: "/care" }]} />
            <p className="label mb-6 mt-8 text-trap-500">Field guide · vol. 1</p>
            <SplitReveal
              as="h1"
              inView={false}
              text="How to keep a *carnivore* happy"
              className="text-6xl md:text-8xl leading-[0.95] text-ink"
            />
            <motion.p
              className="mt-8 max-w-xl text-lg text-ink/70"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Carnivorous plants are easy once you unlearn your houseplant habits. They grow in
              bogs: wet, sunny and starved of nutrients. Recreate that and they&apos;ll thrive.
            </motion.p>
          </div>
          <motion.div
            className="relative aspect-square overflow-hidden rounded-full"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image src={IMAGES.sundewDew} alt="Sundew dew drops" fill sizes="40vw" className="object-cover" priority />
            <DewDrops />
          </motion.div>
        </section>

        {/* Basics */}
        <section className="bg-ink py-24 text-parchment">
          <div className="container mx-auto px-4">
            <SplitReveal text="The *basics*" className="mb-14 text-5xl md:text-7xl" />
            <div className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl bg-parchment/10 sm:grid-cols-2 lg:grid-cols-4">
              {BASICS.map(({ icon: Icon, title, text }, i) => (
                <Reveal key={title} delay={i * 0.1} className="bg-ink">
                  <div className="group h-full p-8 transition-colors duration-500 hover:bg-moss-900">
                    <div className="mb-10 flex items-center justify-between">
                      <Icon className="h-8 w-8 text-dew-300 transition-transform duration-500 group-hover:scale-125 group-hover:-rotate-12" />
                      <span className="label text-parchment/30">0{i + 1}</span>
                    </div>
                    <h3 className="mb-3 text-3xl">{title}</h3>
                    <p className="text-sm text-parchment/65">{text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* By plant type */}
        <section className="container mx-auto px-4 py-24">
          <div className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <SplitReveal text="By plant *type*" className="text-5xl md:text-7xl text-ink" />
            <p className="label flex items-center gap-3 text-ink/50">
              Difficulty
              <span className="flex gap-1">
                <span className="h-2 w-2 rounded-full bg-trap-500" />
                <span className="h-2 w-2 rounded-full bg-ink/15" />
                <span className="h-2 w-2 rounded-full bg-ink/15" />
              </span>
            </p>
          </div>

          <div className="space-y-10">
            {GENERA.map((type, i) => {
              const care = CARE_INFO[type.name];
              const dots = DIFFICULTY_DOTS[care.difficulty];
              return (
                <Reveal key={type.name}>
                  <article className={`grid items-center gap-8 md:grid-cols-2 md:gap-16 ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}>
                    <div className="group relative aspect-[5/4] overflow-hidden rounded-[2rem]">
                      <Image
                        src={type.image}
                        alt={type.name}
                        fill
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className="object-cover transition-transform duration-[1.2s] group-hover:scale-105"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-4">
                        <span className="label text-ink/40">0{i + 1}</span>
                        <span className="flex gap-1" aria-label={care.difficulty}>
                          {[1, 2, 3].map((d) => (
                            <span key={d} className={`h-2 w-2 rounded-full ${d <= dots ? "bg-trap-500" : "bg-ink/15"}`} />
                          ))}
                        </span>
                        <span className="label text-ink/50">{care.difficulty}</span>
                      </div>
                      <h3 className="mt-4 text-5xl text-ink">
                        <em>{type.latin}</em>
                      </h3>
                      <p className="label mt-2 text-moss-600">{type.name}</p>
                      <p className="mt-5 text-ink/70">{type.description}</p>
                      <dl className="mt-8 space-y-4 border-t border-ink/15 pt-6">
                        {[
                          ["Light", care.light],
                          ["Water", care.water],
                          ["Dormancy", care.dormancy],
                        ].map(([label, text]) => (
                          <div key={label} className="grid grid-cols-[100px_1fr] gap-4">
                            <dt className="label pt-1 text-ink/45">{label}</dt>
                            <dd className="text-ink/80">{text}</dd>
                          </div>
                        ))}
                      </dl>
                      <Link
                        href={subcategoryHref(type.name)}
                        className="group mt-8 inline-flex items-center gap-2 text-ink underline decoration-trap-400 decoration-2 underline-offset-[6px]"
                      >
                        Shop {type.name.toLowerCase()}
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
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
