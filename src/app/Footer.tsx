"use client";

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4">OLLIE NORTH</h3>
            <p className="text-sm text-gray-400">
              Your premier destination for quality skate gear. From complete boards to the smallest hardware, we got you covered.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-lg font-bold mb-4">SHOP</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/boards" className="text-gray-400 hover:text-red-500 transition-colors">
                  Boards
                </Link>
              </li>
              <li>
                <Link href="/hardware" className="text-gray-400 hover:text-red-500 transition-colors">
                  Hardware
                </Link>
              </li>
              <li>
                <Link href="/apparel" className="text-gray-400 hover:text-red-500 transition-colors">
                  Apparel
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">INFO</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-red-500 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-gray-400 hover:text-red-500 transition-colors">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-gray-400 hover:text-red-500 transition-colors">
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">CONTACT</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>123 Skate Street</li>
              <li>Venice Beach, CA 90291</li>
              <li>Phone: (555) 123-4567</li>
              <li>Email: shop@ollienorth.com</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Ollie North Skateshop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}