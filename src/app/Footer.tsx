"use client";

import Link from "next/link";
import { Instagram, Facebook, Youtube, ArrowUp } from "lucide-react";
import { CATEGORIES, SHOP_NAME } from "@/lib/catalog";
import { TrapMark } from "@/components/motion";

const linkClass =
  "text-parchment/60 hover:text-parchment transition-colors";

const SOCIALS = [
  { href: "https://instagram.com", label: "Instagram", icon: Instagram },
  { href: "https://facebook.com", label: "Facebook", icon: Facebook },
  { href: "https://youtube.com", label: "YouTube", icon: Youtube },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink text-parchment">
      <div className="container mx-auto px-4 pt-20">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* About */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="group inline-flex items-center gap-3">
              <TrapMark className="h-10 w-10 text-parchment" />
              <span className="font-display text-3xl">
                MD <em className="latin text-moss-300">Plants</em>
              </span>
            </Link>
            <p className="mt-5 max-w-xs text-sm text-parchment/60 leading-relaxed">
              Hobbyist-grown carnivorous plants for collectors and the newly curious.
              Every plant is raised in our own collection and packed by hand.
            </p>
            <div className="mt-6 flex gap-3">
              {SOCIALS.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-parchment/20 text-parchment/70 transition-all hover:border-trap-400 hover:bg-trap-500 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="label mb-5 text-trap-300">Shop</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/products" className={linkClass}>
                  All products
                </Link>
              </li>
              {CATEGORIES.map((category) => (
                <li key={category.slug}>
                  <Link href={`/${category.slug}`} className={linkClass}>
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="label mb-5 text-trap-300">Info</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/care" className={linkClass}>Care guide</Link></li>
              <li><Link href="/about" className={linkClass}>About</Link></li>
              <li><Link href="/about#shipping" className={linkClass}>Shipping</Link></li>
              <li><Link href="/profile" className={linkClass}>My account</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="label mb-5 text-trap-300">Contact</h3>
            {/* TODO: replace with the client's real contact details */}
            <ul className="space-y-3 text-sm text-parchment/60">
              <li>hello@mdplants.com</li>
              <li>Local pickup by appointment</li>
              <li>Ships Mon–Wed</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-parchment/10 py-6 text-xs text-parchment/40 sm:flex-row">
          <p className="label">&copy; {new Date().getFullYear()} {SHOP_NAME} · Grown with care</p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="label flex items-center gap-2 hover:text-parchment transition-colors"
          >
            Back to top <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Giant outlined wordmark */}
      <div aria-hidden className="pointer-events-none select-none overflow-hidden text-center leading-[0.8] -mb-[0.1em] pt-6">
        <span
          className="font-display block whitespace-nowrap text-[19vw] text-transparent"
          style={{ WebkitTextStroke: "1.5px var(--color-moss-600)" }}
        >
          MD <em className="latin">Plants</em>
        </span>
      </div>
    </footer>
  );
}
