"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from "framer-motion";
import { api } from "../../convex/_generated/api";
import { useConvexUser } from "@/hooks/useConvexUser";
import { useGuestCart } from "@/hooks/useGuestCart";
import { ShoppingBag, User, Heart } from "lucide-react";
import { Marquee, TrapMark } from "@/components/motion";

const NAV_LINKS = [
  { href: "/plants", label: "Plants" },
  { href: "/seeds", label: "Seeds" },
  { href: "/supplies", label: "Supplies" },
  { href: "/care", label: "Care Guide" },
  { href: "/about", label: "About" },
];

const ANNOUNCEMENTS = [
  "Hand-grown in pure water",
  "Ships Mon–Wed, weather permitting",
  "Live arrival guarantee",
  "New Sarracenia divisions just potted",
  "Local pickup by appointment",
];

export default function Header() {
  const { isSignedIn } = useUser();
  const { convexUser } = useConvexUser();
  const { guestCart, isLoaded } = useGuestCart();
  const pathname = usePathname();

  const cart = useQuery(
    api.cart.getUserCart,
    convexUser ? { userId: convexUser._id } : "skip"
  );

  const wishlist = useQuery(
    api.wishlist.getUserWishlist,
    convexUser ? { userId: convexUser._id } : "skip"
  );

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

  return (
    <motion.header
      className="sticky top-0 z-50"
      animate={{ y: hidden ? "-100%" : "0%" }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Announcement ticker */}
      <div className="bg-ink text-parchment py-2">
        <Marquee>
          {ANNOUNCEMENTS.map((text) => (
            <span key={text} className="label flex items-center gap-6 px-6 text-parchment/80">
              {text}
              <span className="h-1.5 w-1.5 rounded-full bg-trap-400" />
            </span>
          ))}
        </Marquee>
      </div>

      <div className="border-b border-ink/10 bg-parchment/85 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="flex h-[4.5rem] items-center justify-between gap-6">
            {/* Logo */}
            <Link href="/" className="group flex items-center gap-2.5 text-ink">
              <TrapMark className="h-9 w-9" />
              <span className="font-display text-[1.65rem] leading-none tracking-tight">
                MD <em className="latin text-moss-700">Plants</em>
              </span>
            </Link>

            {/* Main Navigation */}
            <nav className="hidden lg:flex items-center gap-1 rounded-full border border-ink/10 bg-white/50 p-1">
              {NAV_LINKS.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      active ? "text-parchment" : "text-ink/75 hover:text-ink"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-moss-800"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className="relative">{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center gap-4">
              {isSignedIn && (
                <>
                  <Link
                    href="/wishlist"
                    className="relative flex items-center text-ink/75 hover:text-trap-500 transition-colors"
                    aria-label="Wishlist"
                  >
                    <Heart className="h-[22px] w-[22px]" />
                    {wishlistCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-trap-500 text-white text-[10px] font-bold rounded-full h-[18px] w-[18px] flex items-center justify-center">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    href="/profile"
                    className="label text-ink/75 hover:text-ink transition-colors hidden md:block"
                  >
                    Profile
                  </Link>
                </>
              )}
              <Link
                href="/cart"
                className="relative flex items-center text-ink/75 hover:text-ink transition-colors"
                aria-label="Cart"
              >
                <ShoppingBag className="h-[22px] w-[22px]" />
                <AnimatePresence>
                  {itemCount > 0 && (
                    <motion.span
                      key={itemCount}
                      initial={{ scale: 0, rotate: -30 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 15 }}
                      className="absolute -top-2 -right-2 bg-trap-500 text-white text-[10px] font-bold rounded-full h-[18px] w-[18px] flex items-center justify-center"
                    >
                      {itemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
              {isSignedIn ? (
                <UserButton afterSignOutUrl="/" />
              ) : (
                <Link
                  href="/sign-in"
                  className="flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-medium text-parchment hover:bg-moss-800 transition-colors"
                >
                  <User className="h-4 w-4" />
                  <span>Sign in</span>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          <nav className="lg:hidden flex items-center gap-6 overflow-x-auto pb-3 -mt-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`label whitespace-nowrap transition-colors ${
                  pathname === link.href ? "text-trap-500" : "text-ink/70 hover:text-ink"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </motion.header>
  );
}
