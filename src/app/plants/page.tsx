"use client";

import Link from "next/link";
import Image from "next/image";
import Header from "../Header";
import Footer from "../Footer";
import Breadcrumbs from "@/components/Breadcrumbs";

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
        <section className="bg-gradient-to-r from-black via-gray-900 to-black text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">BOARDS</h1>
            <p className="text-xl text-gray-300">Choose your ride</p>
          </div>
        </section>

        {/* Subcategories Grid */}
        <section className="container mx-auto px-4 py-20">
          <Breadcrumbs items={[{ label: "Boards", href: "/boards" }]} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {subcategories.map((subcategory) => (
              <Link
                key={subcategory.slug}
                href={`/products?subcategory=${subcategory.slug}`}
                className="group"
              >
                <div className="relative h-80 overflow-hidden bg-gray-100 mb-4 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500">
                  <Image
                    src={subcategory.image}
                    alt={subcategory.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                </div>
                <h3 className="text-2xl font-bold mb-2 group-hover:text-cyan-500 transition-colors">
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