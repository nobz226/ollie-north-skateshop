"use client";

import Link from "next/link";
import Image from "next/image";
import Header from "../Header";
import Footer from "../Footer";

export default function BoardsPage() {
  const subcategories = [
    {
      name: "Skateboards",
      slug: "skateboards",
      image: "https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=800",
      description: "Classic street skateboards for tricks and technical skating",
    },
    {
      name: "Longboards",
      slug: "longboards",
      image: "https://images.unsplash.com/photo-1593642532400-2682810df593?w=800",
      description: "Cruising and carving boards for smooth rides",
    },
    {
      name: "Pennyboards",
      slug: "pennyboards",
      image: "https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=800",
      description: "Portable mini cruisers perfect for commuting",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Page Header */}
        <section className="bg-black text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">BOARDS</h1>
            <p className="text-xl text-gray-400">Choose your ride</p>
          </div>
        </section>

        {/* Subcategories Grid */}
        <section className="container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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