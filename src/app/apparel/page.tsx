"use client";

import Link from "next/link";
import Image from "next/image";
import Header from "../Header";
import Footer from "../Footer";

export default function ApparelPage() {
  const subcategories = [
    {
      name: "T-Shirts",
      slug: "t-shirts",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
      description: "Comfortable tees for skate sessions",
    },
    {
      name: "Hoodies",
      slug: "hoodies",
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800",
      description: "Cozy hoodies for cooler weather",
    },
    {
      name: "Pants",
      slug: "pants",
      image: "https://images.unsplash.com/photo-1542272454315-7f6d6e106672?w=800",
      description: "Durable pants built for skating",
    },
    {
      name: "Shoes",
      slug: "shoes",
      image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800",
      description: "Skate shoes with grip and durability",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Page Header */}
        <section className="bg-black text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">APPAREL</h1>
            <p className="text-xl text-gray-400">Gear up with style</p>
          </div>
        </section>

        {/* Subcategories Grid */}
        <section className="container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {subcategories.map((subcategory) => (
              <Link
                key={subcategory.slug}
                href={`/products?subcategory=${subcategory.slug}`}
                className="group"
              >
                <div className="relative h-80 overflow-hidden bg-gray-100 mb-4">
                  <Image
                    src={subcategory.image}
                    alt={subcategory.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-2xl font-bold mb-2 group-hover:text-red-600 transition-colors">
                  {subcategory.name}
                </h3>
                <p className="text-gray-600">{subcategory.description}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}