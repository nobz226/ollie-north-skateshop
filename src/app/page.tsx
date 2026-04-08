"use client";

import Link from "next/link";
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import ProductCard from "@/components/ProductCard";
import Header from "./Header";
import Footer from "./Footer";
import { motion } from "framer-motion";

export default function Home() {
  const featuredProducts = useQuery(api.products.getFeatured);

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[600px] bg-black text-white overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=1600"
            alt="Skateboarding"
            fill
            className="object-cover opacity-50"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60"></div>
          <motion.div 
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h1 
              className="text-6xl md:text-8xl font-bold mb-4 tracking-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              OLLIE NORTH
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl mb-8 max-w-2xl text-gray-200"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Premium skate gear for riders who push limits
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Link
                href="/boards"
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-10 py-4 text-lg font-bold transition-all shadow-lg hover:shadow-2xl transform hover:scale-105 inline-block rounded-lg"
              >
                SHOP BOARDS
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* Categories Section */}
        <section className="container mx-auto px-4 py-20">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            SHOP BY CATEGORY
          </motion.h2>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {/* Boards */}
            <motion.div variants={fadeInUp}>
              <Link
                href="/boards"
                className="group relative h-80 overflow-hidden bg-gray-100 block rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500"
              >
                <Image
                  src="https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=800"
                  alt="Boards"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent group-hover:from-black/80 transition-all flex items-center justify-center">
                  <h3 className="text-white text-3xl font-bold tracking-wide transform group-hover:scale-110 transition-transform duration-300">BOARDS</h3>
                </div>
              </Link>
            </motion.div>

            {/* Hardware */}
            <motion.div variants={fadeInUp}>
              <Link
                href="/hardware"
                className="group relative h-80 overflow-hidden bg-gray-100 block rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500"
              >
                <Image
                  src="https://images.unsplash.com/photo-1564982752979-d682fb485798?w=800"
                  alt="Hardware"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent group-hover:from-black/80 transition-all flex items-center justify-center">
                  <h3 className="text-white text-3xl font-bold tracking-wide transform group-hover:scale-110 transition-transform duration-300">HARDWARE</h3>
                </div>
              </Link>
            </motion.div>

            {/* Apparel */}
            <motion.div variants={fadeInUp}>
              <Link
                href="/apparel"
                className="group relative h-80 overflow-hidden bg-gray-100 block rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500"
              >
                <Image
                  src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800"
                  alt="Apparel"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent group-hover:from-black/80 transition-all flex items-center justify-center">
                  <h3 className="text-white text-3xl font-bold tracking-wide transform group-hover:scale-110 transition-transform duration-300">APPAREL</h3>
                </div>
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* Featured Products */}
        <section className="container mx-auto px-4 py-20 bg-gradient-to-b from-white to-gray-50">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            FEATURED PRODUCTS
          </motion.h2>
          {!featuredProducts ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-cyan-500 border-r-transparent"></div>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No featured products available
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {featuredProducts.map((product) => (
                <motion.div
                  key={product._id}
                  variants={fadeInUp}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>

        {/* Deals and Discounts Section */}
        <section className="bg-gradient-to-br from-cyan-500 via-cyan-600 to-cyan-700 text-white py-20 relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full" style={{
              backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)`
            }}></div>
          </div>
          
          <motion.div 
            className="container mx-auto px-4 relative z-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-12">
              <motion.h2 
                className="text-5xl md:text-6xl font-bold mb-4"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                DEALS & DISCOUNTS
              </motion.h2>
              <p className="text-xl text-cyan-100 max-w-2xl mx-auto">
                Score big savings on premium gear - limited time offers!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Deal Card 1 */}
              <motion.div 
                className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=800"
                    alt="Complete Decks"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-black text-cyan-400 px-6 py-2 rounded-full font-bold text-xl shadow-lg">
                    25% OFF
                  </div>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">Complete Decks</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Save big on ready-to-ride complete skateboards
                  </p>
                  <Link 
                    href="/products?productType=Complete Skateboards"
                    className="inline-block bg-cyan-500 text-white px-8 py-3 rounded-lg font-bold hover:bg-cyan-600 transition-all shadow-lg transform hover:scale-105"
                  >
                    SHOP NOW
                  </Link>
                </div>
              </motion.div>

              {/* Deal Card 2 */}
              <motion.div 
                className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1595452767848-1d0ffa7f4d8c?w=800"
                    alt="Wheels and Bearings"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-black text-cyan-400 px-6 py-2 rounded-full font-bold text-xl shadow-lg">
                    BUY 2 GET 1
                  </div>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">Wheels & Bearings</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Mix and match your favorite wheels and bearings
                  </p>
                  <Link 
                    href="/hardware"
                    className="inline-block bg-cyan-500 text-white px-8 py-3 rounded-lg font-bold hover:bg-cyan-600 transition-all shadow-lg transform hover:scale-105"
                  >
                    SHOP NOW
                  </Link>
                </div>
              </motion.div>

              {/* Deal Card 3 */}
              <motion.div 
                className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800"
                    alt="Apparel"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-black text-cyan-400 px-6 py-2 rounded-full font-bold text-xl shadow-lg">
                    30% OFF
                  </div>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">Apparel</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Refresh your wardrobe with skate-inspired styles
                  </p>
                  <Link 
                    href="/apparel"
                    className="inline-block bg-cyan-500 text-white px-8 py-3 rounded-lg font-bold hover:bg-cyan-600 transition-all shadow-lg transform hover:scale-105"
                  >
                    SHOP NOW
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* Limited Time Banner */}
            <motion.div 
              className="text-center mt-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <p className="text-lg font-bold text-cyan-100">
                Hurry! Offers end soon. Limited stock available.
              </p>
            </motion.div>
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-br from-black via-gray-900 to-black text-white py-20 mt-20">
          <motion.div 
            className="container mx-auto px-4 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">JOIN THE CREW</h2>
            <p className="text-xl mb-8 text-gray-300">
              Get exclusive access to new drops, sales, and skate tips
            </p>
            <div className="flex justify-center max-w-md mx-auto gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-grow px-6 py-4 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <button className="bg-cyan-500 hover:bg-cyan-600 px-8 py-4 font-bold transition-all rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105">
                SUBSCRIBE
              </button>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

