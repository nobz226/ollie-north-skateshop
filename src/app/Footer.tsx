"use client";

import Link from "next/link";
import { Instagram, Facebook, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-black to-gray-900 text-white mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-cyan-400">OLLIE NORTH</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your premier destination for quality skate gear. From complete boards to the smallest hardware, we got you covered.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-cyan-400">SHOP</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/boards" className="text-gray-400 hover:text-cyan-400 transition-colors inline-block hover:translate-x-1 transform duration-300">
                  Boards
                </Link>
              </li>
              <li>
                <Link href="/hardware" className="text-gray-400 hover:text-cyan-400 transition-colors inline-block hover:translate-x-1 transform duration-300">
                  Hardware
                </Link>
              </li>
              <li>
                <Link href="/apparel" className="text-gray-400 hover:text-cyan-400 transition-colors inline-block hover:translate-x-1 transform duration-300">
                  Apparel
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-cyan-400">INFO</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-cyan-400 transition-colors inline-block hover:translate-x-1 transform duration-300">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-gray-400 hover:text-cyan-400 transition-colors inline-block hover:translate-x-1 transform duration-300">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-gray-400 hover:text-cyan-400 transition-colors inline-block hover:translate-x-1 transform duration-300">
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-cyan-400">CONTACT</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>123 Skate Street</li>
              <li>Venice Beach, CA 90291</li>
              <li>Phone: (555) 123-4567</li>
              <li>Email: shop@ollienorth.com</li>
            </ul>
            
            {/* Social Media Links */}
            <div className="mt-6">
              <h4 className="text-sm font-bold mb-3 text-cyan-400">FOLLOW US</h4>
              <div className="flex gap-4">
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-cyan-400 transition-all transform hover:scale-110 duration-300"
                  aria-label="Instagram"
                >
                  <Instagram className="h-6 w-6" />
                </a>
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-cyan-400 transition-all transform hover:scale-110 duration-300"
                  aria-label="Facebook"
                >
                  <Facebook className="h-6 w-6" />
                </a>
                <a 
                  href="https://youtube.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-cyan-400 transition-all transform hover:scale-110 duration-300"
                  aria-label="YouTube"
                >
                  <Youtube className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Ollie North Skateshop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}