"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Header from "@/app/Header";
import Footer from "@/app/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import Lancet from "@/components/Lancet";
import { Corners, Embers, Reveal } from "@/components/motion";
import { CARE_INFO, CATEGORIES, categoryHref, subcategoryHref, toRoman } from "@/lib/catalog";

export default function CategoryLanding({ slug }: { slug: string }) {
  const category = CATEGORIES.find((c) => c.slug === slug)!;
  const index = CATEGORIES.indexOf(category);

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-grow">
        {/* Chamber header: dim photo behind a giant blackletter title */}
        <section ref={heroRef} className="relative overflow-hidden border-b border-bone/10">
          <motion.div className="absolute inset-0" style={{ y: imageY }}>
            <Image
              src={category.image}
              alt=""
              fill
              priority
              sizes="100vw"
              className="scale-110 object-cover opacity-30 [filter:grayscale(0.6)_sepia(0.3)]"
            />
          </motion.div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--color-crypt)_80%)]" />
          <Embers count={8} />
          <Corners className="hidden md:block" />

          <div className="container relative mx-auto px-4 pb-24 pt-10 text-center">
            <div className="flex justify-center">
              <Breadcrumbs items={[{ label: category.name, href: `/${category.slug}` }]} />
            </div>
            <motion.p
              className="label mt-12 text-blood-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              Chamber {toRoman(index + 1)} of {toRoman(CATEGORIES.length)} · {category.subcategories.length} collections
            </motion.p>
            <motion.h1
              className="gothic mt-6 text-8xl leading-none text-bone md:text-[11rem]"
              initial={{ opacity: 0, filter: "blur(14px)", scale: 0.96 }}
              animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {category.name}
            </motion.h1>
            <motion.p
              className="latin mx-auto mt-6 max-w-xl text-2xl text-bone/75 md:text-3xl"
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
              <Link href={categoryHref(category.name)} className="btn btn-blood mt-10">
                Browse all {category.name.toLowerCase()} <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Collections */}
        <section className="container mx-auto px-4 py-24">
          <div className="grid grid-cols-1 gap-x-10 gap-y-20 sm:grid-cols-2 lg:grid-cols-3">
            {category.subcategories.map((sub, i) => {
              const care = CARE_INFO[sub.name];
              return (
                <Reveal key={sub.name} delay={(i % 3) * 0.12} className={i % 3 === 1 ? "lg:mt-24" : ""}>
                  <Link href={subcategoryHref(sub.name)} className="group block text-center">
                    <span className="rune block text-3xl text-blood-500">{toRoman(i + 1)}</span>
                    <Lancet
                      src={sub.image}
                      alt={sub.name}
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="mx-auto mt-4 aspect-[4/6] w-full max-w-sm transition-transform duration-700 group-hover:-translate-y-2"
                    />
                    <h2 className="mt-7 text-4xl text-bone">
                      {sub.latin ? <em className="!text-bone">{sub.latin}</em> : sub.name}
                    </h2>
                    {sub.latin && <p className="label mt-2 text-bone/50">{sub.name}</p>}
                    <p className="mx-auto mt-4 max-w-xs text-bone/60">{sub.description}</p>
                    {care && (
                      <p className="mx-auto mt-5 flex w-fit items-center gap-3 border-t border-bone/10 pt-4 text-sm text-bone/55">
                        {sub.hunt && (
                          <>
                            <span>{sub.hunt}</span>
                            <span className="text-blood-500">✦</span>
                          </>
                        )}
                        <span>{care.difficulty}</span>
                      </p>
                    )}
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
