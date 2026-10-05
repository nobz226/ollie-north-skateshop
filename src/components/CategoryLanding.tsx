"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Header from "@/app/Header";
import Footer from "@/app/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Reveal, SplitReveal } from "@/components/motion";
import { CARE_INFO, CATEGORIES, categoryHref, subcategoryHref } from "@/lib/catalog";

export default function CategoryLanding({ slug }: { slug: string }) {
  const category = CATEGORIES.find((c) => c.slug === slug)!;
  const index = CATEGORIES.indexOf(category);

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Page Header */}
        <section ref={heroRef} className="container mx-auto grid items-end gap-10 px-4 pt-10 pb-16 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <Breadcrumbs items={[{ label: category.name, href: `/${category.slug}` }]} />
            <p className="label mb-6 mt-8 text-trap-500">
              Category 0{index + 1} / 0{CATEGORIES.length} · {category.subcategories.length} collections
            </p>
            <SplitReveal
              as="h1"
              inView={false}
              text={`The *${category.name.toLowerCase()}*`}
              className="text-7xl md:text-[8.5rem] leading-[0.9] text-ink"
            />
            <motion.p
              className="mt-8 max-w-lg text-lg text-ink/70"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {category.tagline}.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <Link
                href={categoryHref(category.name)}
                className="group mt-8 inline-flex items-center gap-3 rounded-full bg-ink py-3.5 pl-6 pr-3.5 text-parchment transition-colors hover:bg-trap-500"
              >
                Browse all {category.name.toLowerCase()}
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-parchment text-ink transition-transform group-hover:rotate-[-45deg]">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </motion.div>
          </div>

          <motion.div
            className="relative aspect-[4/5] overflow-hidden rounded-t-[16rem] rounded-b-[2rem] bg-moss-200"
            initial={{ clipPath: "inset(100% 0 0 0)" }}
            animate={{ clipPath: "inset(0% 0 0 0)" }}
            transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          >
            <motion.div className="absolute inset-0 scale-110" style={{ y: imageY }}>
              <Image src={category.image} alt={category.name} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" priority />
            </motion.div>
          </motion.div>
        </section>

        {/* Subcategories */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
            {category.subcategories.map((sub, i) => {
              const care = CARE_INFO[sub.name];
              return (
                <Reveal key={sub.name} delay={(i % 3) * 0.12} className={i % 3 === 1 ? "lg:mt-20" : ""}>
                  <Link href={subcategoryHref(sub.name)} className="group block">
                    <div className="relative aspect-[4/5] overflow-hidden rounded-t-[12rem] rounded-b-3xl bg-moss-100">
                      <Image
                        src={sub.image}
                        alt={sub.name}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-110"
                      />
                      <span className="absolute right-5 bottom-5 flex h-12 w-12 items-center justify-center rounded-full bg-parchment text-ink transition-all duration-500 group-hover:rotate-45 group-hover:bg-trap-500 group-hover:text-white">
                        <ArrowUpRight className="h-5 w-5" />
                      </span>
                    </div>
                    <div className="mt-6 flex items-baseline justify-between gap-4 border-b border-ink/15 pb-4">
                      <h2 className="text-3xl text-ink transition-colors group-hover:text-moss-700">
                        {sub.latin ? <em>{sub.latin}</em> : sub.name}
                      </h2>
                      <span className="label text-ink/40">0{i + 1}</span>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-4">
                      {sub.latin && <span className="label text-moss-600">{sub.name}</span>}
                      {care && (
                        <span className="label rounded-full border border-ink/15 px-3 py-1 text-ink/60">
                          {care.difficulty}
                        </span>
                      )}
                    </div>
                    <p className="mt-3 text-ink/65">{sub.description}</p>
                  </Link>
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
