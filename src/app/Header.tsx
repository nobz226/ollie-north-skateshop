"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from "framer-motion";
import { api } from "../../convex/_generated/api";
import { useConvexUser } from "@/hooks/useConvexUser";
import { useGuestCart } from "@/hooks/useGuestCart";
import { ShoppingBag, Heart, Menu, X } from "lucide-react";
import { Marquee, Wordmark } from "@/components/motion";
import { toRoman } from "@/lib/catalog";

const NAV_LEFT = [
  { href: "/plants", label: "Plants" },
  { href: "/seeds", label: "Seeds" },
  { href: "/supplies", label: "Supplies" },
];
const NAV_RIGHT = [
  { href: "/care", label: "Care" },
  { href: "/about", label: "About" },
];
const NAV_LINKS = [...NAV_LEFT, ...NAV_RIGHT];

const ANNOUNCEMENTS = [
  "Hand-grown in pure water",
  "Ships Mon–Wed, weather permitting",
  "Live arrival guaranteed",
  "New Sarracenia divisions just potted",
  "Local pickup by appointment",
];

function CountBadge({ count }: { count: number }) {
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.span
          key={count}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 18 }}
          className="absolute -right-2.5 -top-2 flex h-[18px] min-w-[18px] items-center justify-center bg-blood-600 px-1 text-[10px] font-semibold text-bone"
        >
          {count}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

export default function Header() {
  const { isSignedIn } = useUser();
  const { convexUser } = useConvexUser();
  const { guestCart, isLoaded } = useGuestCart();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const cart = useQuery(api.cart.getUserCart, convexUser ? { userId: convexUser._id } : "skip");
  const wishlist = useQuery(api.wishlist.getUserWishlist, convexUser ? { userId: convexUser._id } : "skip");

  // Use guest cart count if not signed in, otherwise use convex cart
  const itemCount = convexUser
    ? (cart?.reduce((sum, item) => sum + item.quantity, 0) || 0)
    : (isLoaded ? guestCart.reduce((sum, item) => sum + item.quantity, 0) : 0);
  const wishlistCount = wishlist?.length || 0;

  // Hide the header while scrolling down, reveal it when scrolling up
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => {
    const previous = scrollY.getPrevious() ?? 0;
    setHidden(y > previous && y > 200);
  });

  // Close the mobile menu on navigation, and lock page scroll while it is open
  useEffect(() => setMenuOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const navLink = (link: { href: string; label: string }) => (
    <Link
      key={link.href}
      href={link.href}
      aria-current={pathname === link.href ? "page" : undefined}
      className="label link-rule text-bone/70 transition-colors hover:text-bone aria-[current=page]:text-bone"
    >
      {link.label}
    </Link>
  );

  return (
    <>
      <motion.header
        className="sticky top-0 z-50"
        animate={{ y: hidden && !menuOpen ? "-100%" : "0%" }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Announcement ticker */}
        <div className="border-b border-bone/10 bg-crypt py-2">
          <Marquee>
            {ANNOUNCEMENTS.map((text) => (
              <span key={text} className="label flex items-center gap-8 px-8 text-[0.66rem] text-bone/55">
                {text}
                <span className="text-blood-500">✦</span>
              </span>
            ))}
          </Marquee>
        </div>

        <div className="border-b border-bone/10 bg-crypt/85 backdrop-blur-md">
          <div className="container mx-auto grid h-20 grid-cols-[1fr_auto_1fr] items-center gap-6 px-4">
            {/* Left: menu button (mobile) / shop links (desktop) */}
            <div className="flex items-center gap-8">
              <button
                onClick={() => setMenuOpen(true)}
                className="text-bone/80 hover:text-bone lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" strokeWidth={1.25} />
              </button>
              <nav className="hidden items-center gap-8 lg:flex">{NAV_LEFT.map(navLink)}</nav>
            </div>

            {/* Centre: the wordmark */}
            <Link href="/" aria-label="Carnivorables home" className="block w-44 transition-opacity hover:opacity-80 sm:w-56">
              <Wordmark priority />
            </Link>

            {/* Right: info links + actions */}
            <div className="flex items-center justify-end gap-6">
              <nav className="hidden items-center gap-8 lg:flex">{NAV_RIGHT.map(navLink)}</nav>
              <span className="hidden h-5 w-px bg-bone/15 lg:block" />
              {isSignedIn && (
                <Link href="/wishlist" className="relative hidden text-bone/75 hover:text-blood-400 sm:block" aria-label="Wishlist">
                  <Heart className="h-5 w-5" strokeWidth={1.25} />
                  <CountBadge count={wishlistCount} />
                </Link>
              )}
              <Link href="/cart" className="relative text-bone/75 hover:text-bone" aria-label="Cart">
                <ShoppingBag className="h-5 w-5" strokeWidth={1.25} />
                <CountBadge count={itemCount} />
              </Link>
              <div className="hidden sm:block">
                {isSignedIn ? (
                  <UserButton afterSignOutUrl="/" />
                ) : (
                  <Link href="/sign-in" className="label link-rule text-bone/70 hover:text-bone">
                    Sign in
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col bg-crypt px-6 pb-10 pt-6 lg:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between">
              <div className="w-40">
                <Wordmark />
              </div>
              <button onClick={() => setMenuOpen(false)} aria-label="Close menu" className="text-bone/80">
                <X className="h-7 w-7" strokeWidth={1.25} />
              </button>
            </div>
            <nav className="mt-14 flex flex-col">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.07, duration: 0.6 }}
                >
                  <Link
                    href={link.href}
                    className="flex items-baseline gap-5 border-b border-bone/10 py-4"
                  >
                    <span className="rune w-8 text-xl text-blood-500">{toRoman(i + 1)}</span>
                    <span className="font-display text-5xl text-bone">{link.label}</span>
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="mt-auto flex items-center justify-between pt-10">
              {isSignedIn ? (
                <>
                  <Link href="/profile" className="label text-bone/70">Profile</Link>
                  <Link href="/wishlist" className="label text-bone/70">Wishlist ({wishlistCount})</Link>
                </>
              ) : (
                <Link href="/sign-in" className="btn btn-ghost w-full">Sign in</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
