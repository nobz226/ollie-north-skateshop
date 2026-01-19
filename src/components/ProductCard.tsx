"use client";

import Image from "next/image";
import Link from "next/link";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useConvexUser } from "@/hooks/useConvexUser";
import { Doc } from "../../convex/_generated/dataModel";

interface ProductCardProps {
  product: Doc<"products">;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { convexUser } = useConvexUser();
  const addToCart = useMutation(api.cart.addToCart);

  const handleAddToCart = async () => {
    if (!convexUser) {
      alert("Please sign in to add items to cart");
      return;
    }

    try {
      await addToCart({
        userId: convexUser._id,
        productId: product._id,
        quantity: 1,
      });
      alert(`${product.name} added to cart!`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add to cart. Please try again.");
    }
  };

  const formattedPrice = (product.price / 100).toFixed(2);

  return (
    <div className="group bg-white border border-gray-200 hover:border-black transition-colors">
      <Link href={`/products/${product._id}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {!product.inStock && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
              <span className="text-white text-lg font-bold">OUT OF STOCK</span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/products/${product._id}`}>
          <h3 className="font-bold text-lg mb-1 group-hover:text-red-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-baseline justify-between mb-3">
          <p className="text-2xl font-bold">${formattedPrice}</p>
          {product.size && (
            <span className="text-sm text-gray-600">Size: {product.size}</span>
          )}
        </div>

        <div className="text-sm text-gray-600 mb-3">
          <p className="line-clamp-2">{product.description}</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-4 text-xs">
          <span className="bg-gray-100 px-2 py-1">{product.category}</span>
          <span className="bg-gray-100 px-2 py-1">{product.subcategory}</span>
          {product.productType !== product.subcategory && (
            <span className="bg-gray-100 px-2 py-1">{product.productType}</span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className="w-full bg-black text-white py-3 font-bold hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {product.inStock ? "ADD TO CART" : "OUT OF STOCK"}
        </button>
      </div>
    </div>
  );
}