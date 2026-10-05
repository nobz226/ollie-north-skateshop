"use client";

import Link from "next/link";
import Image from "next/image";
import Header from "../Header";
import Footer from "../Footer";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function HardwarePage() {
  const subcategories = [
    {
      name: "Bolts",
      slug: "bolts",
      image: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=800",
      description: "Mounting hardware for trucks and decks",
    },
    {
      name: "Griptape",
      slug: "griptape",
      image: "https://images.unsplash.com/photo-1564982752979-d682fb485798?w=800",
      description: "Adhesive grip for your deck surface",
    },
    {
      name: "Risers",
      slug: "risers",
      image: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=800",
      description: "Shock pads and wheel bite prevention",
    },
    {
      name: "Bearings",
      slug: "bearings",
      image: "https://images.unsplash.com/photo-1595452767848-1d0ffa7f4d8c?w=800",
      description: "Precision bearings for smooth rolling",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Page Header */}
        <section className="bg-gradient-to-r from-black via-gray-900 to-black text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">HARDWARE</h1>
            <p className="text-xl text-gray-300">Essential components for your setup</p>
          </div>
        </section>

        {/* Subcategories Grid */}
        <section className="container mx-auto px-4 py-20">
          <Breadcrumbs items={[{ label: "Hardware", href: "/hardware" }]} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {subcategories.map((subcategory) => (
              <Link
                key={subcategory.slug}
                href={`/products?subcategory=${subcategory.slug}`}
                className="group"
              >
                <div className="relative h-64 overflow-hidden bg-gray-100 mb-4 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500">
                  <Image
                    src={subcategory.image}
                    alt={subcategory.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-cyan-500 transition-colors">
                  {subcategory.name}
                </h3>
                <p className="text-sm text-gray-600">{subcategory.description}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}