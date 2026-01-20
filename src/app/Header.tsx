"use client";

import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useConvexUser } from "@/hooks/useConvexUser";
import { ShoppingCart, User } from "lucide-react";

export default function Header() {
  const { isSignedIn } = useUser();
  const { convexUser } = useConvexUser();
  
  const cart = useQuery(
    api.cart.getUserCart,
    convexUser ? { userId: convexUser._id } : "skip"
  );

  const itemCount = cart?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold">OLLIE NORTH</div>
          </Link>

          {/* Main Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-sm font-medium hover:text-red-600 transition-colors"
            >
              HOME
            </Link>
            <Link
              href="/boards"
              className="text-sm font-medium hover:text-red-600 transition-colors"
            >
              BOARDS
            </Link>
            <Link
              href="/hardware"
              className="text-sm font-medium hover:text-red-600 transition-colors"
            >
              HARDWARE
            </Link>
            <Link
              href="/apparel"
              className="text-sm font-medium hover:text-red-600 transition-colors"
            >
              APPAREL
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium hover:text-red-600 transition-colors"
            >
              ABOUT
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            <Link
              href="/cart"
              className="relative flex items-center text-gray-700 hover:text-red-600 transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <Link
                href="/sign-in"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
              >
                <User className="h-5 w-5" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden flex items-center justify-around py-3 border-t border-gray-200">
          <Link
            href="/"
            className="text-xs font-medium hover:text-red-600 transition-colors"
          >
            HOME
          </Link>
          <Link
            href="/boards"
            className="text-xs font-medium hover:text-red-600 transition-colors"
          >
            BOARDS
          </Link>
          <Link
            href="/hardware"
            className="text-xs font-medium hover:text-red-600 transition-colors"
          >
            HARDWARE
          </Link>
          <Link
            href="/apparel"
            className="text-xs font-medium hover:text-red-600 transition-colors"
          >
            APPAREL
          </Link>
          <Link
            href="/about"
            className="text-xs font-medium hover:text-red-600 transition-colors"
          >
            ABOUT
          </Link>
        </nav>
      </div>
    </header>
  );
}