"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { useConvexUser } from "@/hooks/useConvexUser";
import Header from "../../Header";
import Footer from "../../Footer";
import { ArrowLeft } from "lucide-react";

export default function ProductDetailPage({
  params,
}: {
  params: { id: Id<"products"> };
}) {
  const product = useQuery(api.products.getById, { id: params.id });
  const { convexUser } = useConvexUser();
  const addToCart = useMutation(api.cart.addToCart);

  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = async () => {
    if (!convexUser) {
      alert("Please sign in to add items to cart");
      return;
    }

    if (!product) return;

    try {
      await addToCart({
        userId: convexUser._id,
        productId: product._id,
        quantity,
      });
      alert(`${quantity} x ${product.name} added to cart!`);
      setQuantity(1);
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add to cart. Please try again.");
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold mb-2">Loading product...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const formattedPrice = (product.price / 100).toFixed(2);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          {/* Back Button */}
          <Link
            href="/products"
            className="inline-flex items-center text-gray-600 hover:text-black mb-8 group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Products
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="relative aspect-square bg-gray-100">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {!product.inStock && (
                <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">OUT OF STOCK</span>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>

              <div className="flex items-baseline mb-6">
                <p className="text-4xl font-bold">${formattedPrice}</p>
                {product.size && (
                  <span className="ml-4 text-xl text-gray-600">Size: {product.size}</span>
                )}
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-black text-white px-4 py-2 text-sm font-bold">
                  {product.category}
                </span>
                <span className="bg-gray-200 px-4 py-2 text-sm font-bold">
                  {product.subcategory}
                </span>
                {product.productType !== product.subcategory && (
                  <span className="bg-gray-100 px-4 py-2 text-sm">
                    {product.productType}
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-3">DESCRIPTION</h2>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>

              {/* Quantity Selector */}
              <div className="mb-8">
                <label className="block text-sm font-bold mb-3">QUANTITY</label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 border border-gray-300 hover:border-black font-bold"
                  >
                    −
                  </button>
                  <span className="text-xl font-bold w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 border border-gray-300 hover:border-black font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="w-full bg-black text-white py-4 text-lg font-bold hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed mb-4"
              >
                {product.inStock ? "ADD TO CART" : "OUT OF STOCK"}
              </button>

              {/* Stock Status */}
              <p className="text-center text-sm text-gray-600">
                {product.inStock ? "✓ In Stock - Ships within 24 hours" : "Currently unavailable"}
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}