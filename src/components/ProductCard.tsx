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
import { Heart } from "lucide-react";

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
  stockQuantity: number;
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
    <Link href={`/products/${product._id}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        {/* Product Image */}
        <div className="relative h-64 bg-gray-200">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {!product.inStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-bold text-lg">Out of Stock</span>
            </div>
          )}
          {/* Wishlist Button - Only show for logged-in users */}
          {convexUser && (
            <button
              onClick={handleToggleWishlist}
              className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors z-10"
            >
              <Heart
                className={`h-5 w-5 ${isInWishlist ? "fill-red-500 text-red-500" : "text-gray-600"}`}
              />
            </button>
          )}
        </div>

        {/* Product Details */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            {product.subcategory} {product.size && `• ${product.size}`}
          </p>
          {product.inStock && (
            <p className="text-xs text-gray-500 mb-2">
              {product.stockQuantity > 0 
                ? `${product.stockQuantity} in stock` 
                : "Low stock"}
            </p>
          )}
          <p className="text-gray-700 text-sm line-clamp-2 mb-3">
            {product.description}
          </p>

          {/* Price and Add to Cart */}
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-gray-900">
              ${(product.price / 100).toFixed(2)}
            </span>
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock || isAddingToCart || userLoading}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                showSuccess
                  ? "bg-green-600 text-white"
                  : product.inStock
                  ? "bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {showSuccess
                ? "Added ✓"
                : isAddingToCart
                ? "Adding..."
                : product.inStock
                ? "Add to Cart"
                : "Out of Stock"}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}