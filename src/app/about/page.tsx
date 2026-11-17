"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Header from "../Header";
import Footer from "../Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import Lancet from "@/components/Lancet";
import { Flourish, Marquee, Reveal, SplitReveal } from "@/components/motion";
import { IMAGES, SHOP_NAME, toRoman } from "@/lib/catalog";

// TODO: replace placeholder story and shipping policy with the client's own details
const SHIPPING = [
  {
    title: "Shipped early in the week",
    text: "Orders ship Monday to Wednesday so plants never sit in a depot over the weekend.",
  },
  {
    title: "Weather-watched",
    text: "During heatwaves or hard frosts we hold orders (and let you know) until it's safe to ship.",
  },
  {
    title: "Live arrival guarantee",
    text: "If a plant arrives damaged, send a photo within 48 hours and we'll replace or refund it.",
  },
  {
    title: "Local pickup",
    text: "Nearby? Choose pickup and see the collection in person by appointment.",
  },
];

const TIMELINE = [
  ["Year one", "A single supermarket Venus flytrap on a kitchen windowsill. It survived (barely)."],
  ["Year three", "Sarracenia, sundews and a first greenhouse shelf. Learned the hard way about tap water."],
  ["Year five", "Seed-grown hybrids, hundreds of divisions, and friends asking to buy spares."],
  ["Today", `${SHOP_NAME}: the collection, finally with a proper home online.`],
];

export default function AboutPage() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["-4%", "14%"]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-grow">
        {/* Header */}
        <section className="container mx-auto px-4 pb-16 pt-10 text-center">
          <div className="flex justify-center">
            <Breadcrumbs items={[{ label: "About", href: "/about" }]} />
          </div>
          <p className="label mb-8 mt-12 text-blood-400">Our story</p>
          <SplitReveal
            as="h1"
            inView={false}
            text="From one windowsill flytrap to a *collection* worth sharing."
            className="mx-auto max-w-5xl text-5xl leading-[1] text-bone md:text-8xl"
          />
          <Flourish className="mx-auto mt-14" />
        </section>

        {/* Story with parallax lancet windows */}
        <section ref={ref} className="container mx-auto grid items-center gap-16 px-4 py-16 lg:grid-cols-2">
          <div className="relative mx-auto h-[36rem] w-full max-w-lg">
            <motion.div style={{ y: y1 }} className="absolute left-0 top-0 h-[28rem] w-[62%]">
              <Lancet src={IMAGES.sarracenia} alt="Colourful Sarracenia pitcher plants" sizes="30vw" className="h-full w-full" alive />
            </motion.div>
            <motion.div style={{ y: y2 }} className="absolute bottom-0 right-0 h-80 w-[48%]">
              <Lancet src={IMAGES.windowsill} alt="Venus flytraps on a windowsill" sizes="25vw" className="h-full w-full" />
            </motion.div>
          </div>

          <div className="space-y-6 text-lg leading-relaxed text-bone/70">
            <Reveal>
              <p>
                <span className="gothic float-left mr-3 mt-1 text-8xl leading-[0.75] text-blood-500">E</span>
                very collection starts with one plant. {SHOP_NAME} started the way most carnivorous
                plant collections do: with a single Venus flytrap and a lot of curiosity. A few years
                (and many divisions, seedlings and greenhouse shelves) later, the collection outgrew
                the windowsill.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p>
                Instead of scattering plants across marketplace listings, we built a proper home for
                them. Every plant here is grown by us in pure water and nutrient-free media,
                photographed honestly, and packed by the same hands that potted it.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="latin text-3xl text-bone">
                Buying your first flytrap or hunting a specific cultivar? Let&apos;s talk plants.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Timeline */}
        <section className="container mx-auto px-4 py-24">
          <div className="grid gap-px bg-bone/10 md:grid-cols-4">
            {TIMELINE.map(([year, text], i) => (
              <Reveal key={year} delay={i * 0.1} className="bg-crypt">
                <div className="h-full p-8 text-center">
                  <span className="rune text-4xl text-blood-500">{toRoman(i + 1)}</span>
                  <h3 className="mt-5 text-3xl text-bone">{year}</h3>
                  <p className="mt-3 text-bone/60">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Shipping */}
        <section id="shipping" className="scroll-mt-32 border-y border-bone/10 bg-vault/60 py-24">
          <div className="container mx-auto px-4">
            <div className="mb-16 grid gap-6 md:grid-cols-2 md:items-end">
              <div>
                <p className="label mb-5 text-blood-400">Delivery</p>
                <SplitReveal text="Shipping *live* plants" className="text-5xl text-bone md:text-7xl" />
              </div>
              <Reveal delay={0.2}>
                <p className="max-w-md text-bone/60 md:ml-auto">
                  Plants usually travel bare-root, wrapped in damp sphagnum moss. That&apos;s the
                  safest way to ship carnivores and how growers worldwide do it.
                </p>
              </Reveal>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {SHIPPING.map(({ title, text }, i) => (
                <Reveal key={title} delay={i * 0.1} className="h-full">
                  <div className="frame group h-full p-8 transition-colors duration-500 hover:border-blood-500/50">
                    <span className="rune text-3xl text-blood-500">{toRoman(i + 1)}</span>
                    <h3 className="mb-3 mt-8 text-2xl text-bone">{title}</h3>
                    <p className="text-bone/60">{text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <div className="border-b border-bone/10 py-10">
          <Marquee>
            {["Pure water", "Full sun", "No fertilizer", "Cold winters", "Live food only", "Patience"].map((t) => (
              <span key={t} className="flex items-center">
                <span className="gothic px-10 text-5xl text-bone/20">{t}</span>
                <span className="text-blood-600">✦</span>
              </span>
            ))}
          </Marquee>
        </div>
      </main>

      <Footer />
    </div>
  );
}
