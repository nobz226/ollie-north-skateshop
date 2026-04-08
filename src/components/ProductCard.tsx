"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { useConvexUser } from "@/hooks/useConvexUser";
import { useGuestCart } from "@/hooks/useGuestCart";
import { useState } from "react";
import { Heart, ShoppingCart } from "lucide-react";

interface Product {
  _id: Id<"products">;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  subcategory: string;
  productType: string;
  size?: string;
  inStock: boolean;
  stockQuantity?: number;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { convexUser, isLoading: userLoading } = useConvexUser();
  const addToCartMutation = useMutation(api.cart.addToCart);
  const addToWishlist = useMutation(api.wishlist.addToWishlist);
  const removeFromWishlist = useMutation(api.wishlist.removeFromWishlistByProduct);
  const { addToCart: addToGuestCart } = useGuestCart();
  
  const isInWishlist = useQuery(
    api.wishlist.isInWishlist,
    convexUser ? { userId: convexUser._id, productId: product._id } : "skip"
  );
  
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent Link navigation

    setIsAddingToCart(true);

    try {
      if (convexUser) {
        // Authenticated user - add to Convex cart
        await addToCartMutation({
          userId: convexUser._id,
          productId: product._id,
        });
      } else {
        // Guest user - add to localStorage cart
        addToGuestCart(product._id);
      }

      // Show success feedback
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add item to cart. Please try again.");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!convexUser || userLoading) {
      router.push("/sign-in?redirectUrl=" + encodeURIComponent(window.location.pathname));
      return;
    }

    try {
      if (isInWishlist) {
        await removeFromWishlist({
          userId: convexUser._id,
          productId: product._id,
        });
      } else {
        await addToWishlist({
          userId: convexUser._id,
          productId: product._id,
        });
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    }
  };

  return (
    <Link href={`/products/${product._id}`} className="group block h-full">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-cyan-500 transition-all duration-500 h-full flex flex-col">
        {/* Product Image */}
        <div className="relative h-72 bg-gray-50 overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
          {!product.inStock && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center backdrop-blur-sm">
              <span className="text-white font-bold text-lg tracking-wide">OUT OF STOCK</span>
            </div>
          )}
          {/* Wishlist Button - Only show for logged-in users */}
          {convexUser && (
            <button
              onClick={handleToggleWishlist}
              className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-cyan-500 hover:text-white transition-all duration-300 z-10 group/heart"
            >
              <Heart
                className={`h-5 w-5 transition-all ${isInWishlist ? "fill-cyan-500 text-cyan-500 group-hover/heart:fill-white group-hover/heart:text-white" : "text-gray-700 group-hover/heart:text-white"}`}
              />
            </button>
          )}
        </div>

        {/* Product Details */}
        <div className="p-5 flex-grow flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-cyan-600 transition-colors duration-300 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 mb-2 uppercase tracking-wide">
            {product.subcategory} {product.size && `• ${product.size}`}
          </p>
          {product.inStock && (
            <p className="text-xs text-cyan-600 font-medium mb-2">
              {product.stockQuantity && product.stockQuantity > 0
                ? `${product.stockQuantity} in stock`
                : "In stock"}
            </p>
          )}
          <p className="text-gray-600 text-base line-clamp-2 mb-4 flex-grow leading-relaxed">
            {product.description}
          </p>

          {/* Price and Add to Cart */}
          <div className="flex items-center justify-between mt-auto">
            <span className="text-2xl font-bold text-gray-900">
              ${(product.price / 100).toFixed(2)}
            </span>
            <button
              onClick={handleAddToCart}
              disabled={Boolean(!product.inStock || isAddingToCart || userLoading)}
              className={`px-5 py-2.5 rounded-lg text-base font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-2 ${
                showSuccess
                  ? "bg-green-500 text-white shadow-lg"
                  : product.inStock
                  ? "bg-cyan-500 text-white hover:bg-cyan-600 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              <ShoppingCart className="h-5 w-5" />
              {showSuccess
                ? "ADDED"
                : isAddingToCart
                ? "ADDING..."
                : product.inStock
                ? ""
                : "OUT OF STOCK"}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}