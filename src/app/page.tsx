"use client";

import Link from "next/link";
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import ProductCard from "@/components/ProductCard";
import Header from "./Header";
import Footer from "./Footer";

export default function Home() {
  const featuredProducts = useQuery(api.products.getFeatured);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[600px] bg-black text-white">
          <Image
            src="https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=1600"
            alt="Skateboarding"
            fill
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-6xl md:text-8xl font-bold mb-4 tracking-tight">
              OLLIE NORTH
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl">
              Premium skate gear for riders who push limits
            </p>
            <Link
              href="/boards"
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg font-bold transition-colors"
            >
              SHOP BOARDS
            </Link>
          </div>
        </section>

        {/* Categories Section */}
        <section className="container mx-auto px-4 py-20">
          <h2 className="text-4xl font-bold text-center mb-12">
            SHOP BY CATEGORY
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Boards */}
            <Link
              href="/boards"
              className="group relative h-80 overflow-hidden bg-gray-100"
            >
              <Image
                src="https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=800"
                alt="Boards"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                <h3 className="text-white text-3xl font-bold">BOARDS</h3>
              </div>
            </Link>

            {/* Hardware */}
            <Link
              href="/hardware"
              className="group relative h-80 overflow-hidden bg-gray-100"
            >
              <Image
                src="https://images.unsplash.com/photo-1564982752979-d682fb485798?w=800"
                alt="Hardware"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                <h3 className="text-white text-3xl font-bold">HARDWARE</h3>
              </div>
            </Link>

            {/* Apparel */}
            <Link
              href="/apparel"
              className="group relative h-80 overflow-hidden bg-gray-100"
            >
              <Image
                src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800"
                alt="Apparel"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                <h3 className="text-white text-3xl font-bold">APPAREL</h3>
              </div>
            </Link>
          </div>
        </section>

        {/* Featured Products */}
        <section className="container mx-auto px-4 py-20 bg-gray-50">
          <h2 className="text-4xl font-bold text-center mb-12">
            FEATURED PRODUCTS
          </h2>
          {!featuredProducts ? (
            <div className="text-center py-12">Loading...</div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No featured products available
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="bg-black text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-4">JOIN THE CREW</h2>
            <p className="text-xl mb-8 text-gray-400">
              Get exclusive access to new drops, sales, and skate tips
            </p>
            <div className="flex justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-grow px-4 py-3 text-black"
              />
              <button className="bg-red-600 hover:bg-red-700 px-8 py-3 font-bold transition-colors">
                SUBSCRIBE
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

