"use client";

import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useConvexUser } from "@/hooks/useConvexUser";
import { useGuestCart } from "@/hooks/useGuestCart";
import { ShoppingCart, User, Heart } from "lucide-react";

export default function Header() {
  const { isSignedIn } = useUser();
  const { convexUser } = useConvexUser();
  const { guestCart, isLoaded } = useGuestCart();
  
  const cart = useQuery(
    api.cart.getUserCart,
    convexUser ? { userId: convexUser._id } : "skip"
  );

  // Wishlist query - will be available once Convex dev picks up the new file
  const wishlist = useQuery(
    api.wishlist?.getUserWishlist,
    convexUser && api.wishlist?.getUserWishlist ? { userId: convexUser._id } : "skip"
  );

  // Use guest cart count if not signed in, otherwise use convex cart
  const itemCount = convexUser 
    ? (cart?.reduce((sum, item) => sum + item.quantity, 0) || 0)
    : (isLoaded ? guestCart.reduce((sum, item) => sum + item.quantity, 0) : 0);
  
  const wishlistCount = wishlist?.length || 0;

  return (
    <header className="border-b border-gray-100 bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div style={{ fontFamily: 'var(--font-heading-1)' }} className="text-2xl font-bold tracking-wide transition-colors group-hover:text-cyan-500">OLLIE NORTH</div>
          </Link>

          {/* Main Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-base font-bold tracking-wide hover:text-cyan-500 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-cyan-500 after:transition-all hover:after:w-full"
            >
              HOME
            </Link>
            <Link
              href="/boards"
              className="text-base font-bold tracking-wide hover:text-cyan-500 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-cyan-500 after:transition-all hover:after:w-full"
            >
              BOARDS
            </Link>
            <Link
              href="/hardware"
              className="text-base font-bold tracking-wide hover:text-cyan-500 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-cyan-500 after:transition-all hover:after:w-full"
            >
              HARDWARE
            </Link>
            <Link
              href="/apparel"
              className="text-base font-bold tracking-wide hover:text-cyan-500 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-cyan-500 after:transition-all hover:after:w-full"
            >
              APPAREL
            </Link>
            <Link
              href="/about"
              className="text-base font-bold tracking-wide hover:text-cyan-500 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-cyan-500 after:transition-all hover:after:w-full"
            >
              ABOUT
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-5">
            {isSignedIn && (
              <>
                <Link
                  href="/wishlist"
                  className="relative flex items-center text-gray-700 hover:text-cyan-500 transition-colors group"
                >
                  <Heart className="h-6 w-6 transition-transform group-hover:scale-110" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-cyan-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
                <Link
                  href="/profile"
                  className="text-base font-bold tracking-wide text-gray-700 hover:text-cyan-500 transition-colors hidden md:block"
                >
                  PROFILE
                </Link>
              </>
            )}
            <Link
              href="/cart"
              className="relative flex items-center text-gray-700 hover:text-cyan-500 transition-colors group"
            >
              <ShoppingCart className="h-6 w-6 transition-transform group-hover:scale-110" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-cyan-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md animate-pulse">
                  {itemCount}
                </span>
              )}
            </Link>
            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <Link
                href="/sign-in"
                className="flex items-center gap-2 px-5 py-2.5 text-base font-bold bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <User className="h-5 w-5" />
                <span>SIGN IN</span>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden flex items-center justify-around py-3 border-t border-gray-100 bg-white/95 backdrop-blur-md">
          <Link
            href="/"
            className="text-sm font-bold tracking-wide hover:text-cyan-500 transition-colors"
          >
            HOME
          </Link>
          <Link
            href="/boards"
            className="text-sm font-bold tracking-wide hover:text-cyan-500 transition-colors"
          >
            BOARDS
          </Link>
          <Link
            href="/hardware"
            className="text-sm font-bold tracking-wide hover:text-cyan-500 transition-colors"
          >
            HARDWARE
          </Link>
          <Link
            href="/apparel"
            className="text-sm font-bold tracking-wide hover:text-cyan-500 transition-colors"
          >
            APPAREL
          </Link>
          <Link
            href="/about"
            className="text-sm font-bold tracking-wide hover:text-cyan-500 transition-colors"
          >
            ABOUT
          </Link>
        </nav>
      </div>
    </header>
  );
}