"use client";

import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { CATEGORIES, SHOP_EMAIL, SHOP_NAME } from "@/lib/catalog";
import { Flourish, Wordmark } from "@/components/motion";

const linkClass = "text-bone/55 transition-colors hover:text-bone";

// TODO: replace with the client's real social profiles
const SOCIALS = [
  { href: "https://instagram.com", label: "Instagram" },
  { href: "https://facebook.com", label: "Facebook" },
  { href: "https://youtube.com", label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-bone/10 bg-crypt">
      {/* Red glow rising from below, like a hearth */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%] bg-[radial-gradient(ellipse_at_bottom,rgba(150,42,34,0.22),transparent_65%)]" />

      <div className="container relative mx-auto px-4 pt-20">
        <div className="flex flex-col items-center text-center">
          <Flourish />
          <p className="latin mt-6 max-w-xl text-2xl text-bone/70 md:text-3xl">
            Rare carnivorous plants, raised in rainwater and shipped to hunt in your home.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-10 border-y border-bone/10 py-12 md:grid-cols-4">
          <div>
            <h3 className="label mb-5 text-blood-400">Shop</h3>
            <ul className="space-y-2.5">
              <li><Link href="/products" className={linkClass}>All specimens</Link></li>
              {CATEGORIES.map((category) => (
                <li key={category.slug}>
                  <Link href={`/${category.slug}`} className={linkClass}>{category.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="label mb-5 text-blood-400">Learn</h3>
            <ul className="space-y-2.5">
              <li><Link href="/care" className={linkClass}>Care guide</Link></li>
              <li><Link href="/about" className={linkClass}>Our story</Link></li>
              <li><Link href="/about#shipping" className={linkClass}>Shipping</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="label mb-5 text-blood-400">Account</h3>
            <ul className="space-y-2.5">
              <li><Link href="/profile" className={linkClass}>Profile</Link></li>
              <li><Link href="/wishlist" className={linkClass}>Wishlist</Link></li>
              <li><Link href="/cart" className={linkClass}>Bag</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="label mb-5 text-blood-400">Correspondence</h3>
            <ul className="space-y-2.5 text-bone/55">
              <li><a href={`mailto:${SHOP_EMAIL}`} className={linkClass}>{SHOP_EMAIL}</a></li>
              <li>Local pickup by appointment</li>
              {SOCIALS.map(({ href, label }) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    {label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 py-6 text-bone/40 sm:flex-row">
          <p className="label text-[0.66rem]">&copy; {new Date().getFullYear()} {SHOP_NAME} · Grown in the dark, shipped into the light</p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="label flex items-center gap-2 text-[0.66rem] transition-colors hover:text-bone"
          >
            Ascend <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Giant wordmark, cropped by the bottom edge */}
      <div aria-hidden className="relative mx-auto -mb-[3vw] w-[110%] max-w-none -translate-x-[4.5%] px-4 opacity-[0.12]">
        <Wordmark />
      </div>
    </footer>
  );
}
