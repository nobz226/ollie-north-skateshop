"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Truck, ThermometerSun, ShieldCheck, MapPin } from "lucide-react";
import Header from "../Header";
import Footer from "../Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Marquee, Reveal, SplitReveal } from "@/components/motion";
import { IMAGES } from "@/lib/catalog";

// TODO: replace placeholder story and shipping policy with the client's own details
const SHIPPING = [
  {
    icon: Truck,
    title: "Shipped early in the week",
    text: "Orders ship Monday to Wednesday so plants never sit in a depot over the weekend.",
  },
  {
    icon: ThermometerSun,
    title: "Weather-watched",
    text: "During heatwaves or hard frosts we hold orders (and let you know) until it's safe to ship.",
  },
  {
    icon: ShieldCheck,
    title: "Live arrival guarantee",
    text: "If a plant arrives damaged, send a photo within 48 hours and we'll replace or refund it.",
  },
  {
    icon: MapPin,
    title: "Local pickup",
    text: "Nearby? Choose pickup and see the collection in person by appointment.",
  },
];

const TIMELINE = [
  ["Year one", "A single supermarket Venus flytrap on a kitchen windowsill. It survived (barely)."],
  ["Year three", "Sarracenia, sundews and a first greenhouse shelf. Learned the hard way about tap water."],
  ["Year five", "Seed-grown hybrids, hundreds of divisions, and friends asking to buy spares."],
  ["Today", "MD Plants: the collection, finally with a proper home online."],
];

export default function AboutPage() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["-5%", "15%"]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Header */}
        <section className="container mx-auto px-4 pt-10 pb-16">
          <Breadcrumbs items={[{ label: "About", href: "/about" }]} />
          <p className="label mb-6 mt-8 text-trap-500">About MD Plants</p>
          <SplitReveal
            as="h1"
            inView={false}
            text="From one windowsill flytrap to a *collection* worth sharing."
            className="max-w-5xl text-6xl md:text-8xl leading-[0.95] text-ink"
          />
        </section>

        {/* Story with parallax collage */}
        <section ref={ref} className="container mx-auto grid items-center gap-16 px-4 py-16 lg:grid-cols-2">
          <div className="relative h-[34rem]">
            <motion.div style={{ y: y1 }} className="absolute left-0 top-0 h-[26rem] w-[70%] overflow-hidden rounded-t-[14rem] rounded-b-3xl">
              <Image src={IMAGES.sarracenia} alt="Colorful Sarracenia pitcher plants" fill sizes="40vw" className="object-cover" />
            </motion.div>
            <motion.div style={{ y: y2 }} className="absolute bottom-0 right-0 h-64 w-[50%] overflow-hidden rounded-3xl border-[6px] border-parchment shadow-2xl">
              <Image src={IMAGES.windowsill} alt="Venus flytraps on a windowsill" fill sizes="30vw" className="object-cover" />
            </motion.div>
          </div>

          <div className="space-y-6 text-lg leading-relaxed text-ink/75">
            <Reveal>
              <p>
                <span className="font-display float-left mr-3 mt-1 text-7xl leading-[0.8] text-trap-500">E</span>
                very collection starts with one plant. MD Plants started the way most carnivorous
                plant collections do: with a single Venus flytrap and a lot of curiosity. A few years (and many divisions, seedlings and
                greenhouse shelves) later, the collection outgrew the windowsill.
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
              <p className="latin text-2xl text-moss-700">
                Buying your first flytrap or hunting a specific cultivar? Let&apos;s talk plants.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Timeline */}
        <section className="container mx-auto px-4 py-20">
          <div className="grid gap-px overflow-hidden rounded-3xl border border-ink/10 bg-ink/10 md:grid-cols-4">
            {TIMELINE.map(([year, text], i) => (
              <Reveal key={year} delay={i * 0.1} className="bg-parchment">
                <div className="h-full p-8">
                  <span className="label text-trap-500">0{i + 1}</span>
                  <h3 className="mt-6 text-3xl">{year}</h3>
                  <p className="mt-3 text-sm text-ink/65">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Shipping */}
        <section id="shipping" className="bg-moss-900 py-24 text-parchment scroll-mt-32">
          <div className="container mx-auto px-4">
            <div className="mb-14 grid gap-6 md:grid-cols-2 md:items-end">
              <SplitReveal text="Shipping *live* plants" className="text-5xl md:text-7xl" />
              <Reveal delay={0.2}>
                <p className="max-w-md text-parchment/70 md:ml-auto">
                  Plants usually travel bare-root, wrapped in damp sphagnum moss. That&apos;s the
                  safest way to ship carnivores and how growers worldwide do it.
                </p>
              </Reveal>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {SHIPPING.map(({ icon: Icon, title, text }, i) => (
                <Reveal key={title} delay={i * 0.1}>
                  <div className="group h-full rounded-3xl border border-parchment/15 p-8 transition-colors duration-500 hover:bg-parchment hover:text-ink">
                    <Icon className="mb-10 h-8 w-8 text-dew-300 transition-colors group-hover:text-trap-500" />
                    <h3 className="mb-3 text-2xl">{title}</h3>
                    <p className="text-sm opacity-70">{text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <div className="border-b border-ink/10 py-8">
          <Marquee>
            {["Pure water", "Full sun", "No fertilizer", "Cold winters", "Live food only", "Patience"].map((t) => (
              <span key={t} className="latin px-10 text-4xl text-ink/25">
                {t} ✺
              </span>
            ))}
          </Marquee>
        </div>
      </main>

      <Footer />
    </div>
  );
}
